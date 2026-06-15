// ═══════════════════════════════════════
//   BUTTERFLY ANIMATION — SECTION 4
// ═══════════════════════════════════════
(function() {
  const canvas = document.getElementById('butterflyCanvas');
  const ctx = canvas.getContext('2d');
  let W, H;
  const butterflies = [];
  const BUTTERFLY_COUNT = 22;
  const HEART_BUTTERFLIES = 12;
  let isActive = false;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initButterflies();
  }

  // Heart path points
  function heartPoint(t, scale, cx, cy) {
    const s = scale / 17;
    const x = 16 * Math.pow(Math.sin(t), 3) * s;
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)) * s;
    return { x: cx + x, y: cy + y };
  }

  function createButterfly(onHeart, heartIndex) {
    let x, y, targetX, targetY;
    const cx = W / 2, cy = H / 2;

    if (onHeart) {
      const t = (heartIndex / HEART_BUTTERFLIES) * Math.PI * 2;
      const p = heartPoint(t, Math.min(W,H)*0.28, cx, cy);
      x = p.x + (Math.random()-0.5)*20;
      y = p.y + (Math.random()-0.5)*20;
      targetX = x;
      targetY = y;
    } else {
      x = Math.random() * W;
      y = Math.random() * H;
      targetX = x;
      targetY = y;
    }

    return {
      x, y,
      targetX, targetY,
      vx: (Math.random()-0.5) * 1.5,
      vy: (Math.random()-0.5) * 1.5 - 0.3,
      angle: Math.random() * Math.PI * 2,
      angleSpeed: (Math.random()-0.5) * 0.03,
      wingPhase: Math.random() * Math.PI * 2,
      wingSpeed: 0.08 + Math.random() * 0.06,
      size: onHeart ? (14 + Math.random() * 8) : (10 + Math.random() * 14),
      hue: 280 + Math.random() * 100,
      alpha: 0.8 + Math.random() * 0.2,
      onHeart,
      heartT: onHeart ? (heartIndex / HEART_BUTTERFLIES) * Math.PI * 2 : 0,
      heartOrbitSpeed: (Math.random()-0.5) * 0.003,
      lifetime: 1,
      dying: false,
      stars: [],
      respawnTimer: 0
    };
  }

  function initButterflies() {
    butterflies.length = 0;
    for (let i = 0; i < HEART_BUTTERFLIES; i++) {
      butterflies.push(createButterfly(true, i));
    }
    for (let i = 0; i < BUTTERFLY_COUNT - HEART_BUTTERFLIES; i++) {
      butterflies.push(createButterfly(false, 0));
    }
  }

  // Draw a beautiful butterfly
  function drawButterfly(b) {
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(b.angle);

    const wingFlap = Math.cos(b.wingPhase) * 0.7;
    const s = b.size;

    // Left wing
    ctx.save();
    ctx.scale(-1, 1);
    ctx.scale(1 + wingFlap * 0.3, 1);
    drawWing(ctx, s, b.hue, b.alpha);
    ctx.restore();

    // Right wing
    ctx.save();
    ctx.scale(1 + wingFlap * 0.3, 1);
    drawWing(ctx, s, b.hue, b.alpha);
    ctx.restore();

    // Body
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 0.08, s * 0.4, 0, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${b.hue}, 40%, 20%, 0.9)`;
    ctx.fill();

    ctx.restore();
  }

  function drawWing(ctx, s, hue, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha * 0.85;

    // Upper wing
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.1);
    ctx.bezierCurveTo(s * 0.8, -s * 0.8, s * 1.2, -s * 0.3, s * 0.9, s * 0.15);
    ctx.bezierCurveTo(s * 0.6, s * 0.4, s * 0.2, s * 0.1, 0, -s * 0.1);
    ctx.closePath();

    const g = ctx.createRadialGradient(s*0.4, -s*0.3, 0, s*0.4, -s*0.3, s*0.9);
    g.addColorStop(0, `hsla(${hue}, 100%, 80%, 0.95)`);
    g.addColorStop(0.5, `hsla(${hue+20}, 80%, 65%, 0.7)`);
    g.addColorStop(1, `hsla(${hue+40}, 60%, 45%, 0.3)`);
    ctx.fillStyle = g;
    ctx.fill();

    // Lower wing
    ctx.beginPath();
    ctx.moveTo(0, s * 0.1);
    ctx.bezierCurveTo(s * 0.7, s * 0.2, s * 0.9, s * 0.8, s * 0.5, s * 0.9);
    ctx.bezierCurveTo(s * 0.2, s * 1.0, 0, s * 0.7, 0, s * 0.1);
    ctx.closePath();

    const g2 = ctx.createRadialGradient(s*0.35, s*0.5, 0, s*0.35, s*0.5, s*0.7);
    g2.addColorStop(0, `hsla(${hue+10}, 90%, 75%, 0.9)`);
    g2.addColorStop(1, `hsla(${hue+50}, 60%, 40%, 0.3)`);
    ctx.fillStyle = g2;
    ctx.fill();

    // Wing patterns — dots
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(s*(0.3+i*0.25), -s*(0.2+i*0.1), s*0.05, 0, Math.PI*2);
      ctx.fillStyle = `hsla(${hue-30}, 60%, 30%, 0.6)`;
      ctx.fill();
    }

    ctx.restore();
  }

  function drawStarBurst(stars, x, y) {
    stars.forEach((s, i) => {
      s.life -= 0.03;
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.05;

      if (s.life > 0) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * s.life, 0, Math.PI*2);
        ctx.fillStyle = `hsla(${s.hue}, 100%, 80%, ${s.life})`;
        ctx.shadowColor = `hsl(${s.hue}, 100%, 70%)`;
        ctx.shadowBlur = 6;
        ctx.fill();
      }
    });

    // Remove dead stars
    for (let i = stars.length - 1; i >= 0; i--) {
      if (stars[i].life <= 0) stars.splice(i, 1);
    }
  }

  function update() {
    const cx = W/2, cy = H/2;

    butterflies.forEach((b, i) => {
      if (b.dying) {
        b.lifetime -= 0.05;
        drawStarBurst(b.stars, b.x, b.y);
        if (b.lifetime <= 0) {
          // Respawn
          setTimeout(() => {
            const newB = b.onHeart ? createButterfly(true, i) : createButterfly(false, 0);
            butterflies[i] = newB;
          }, 2000 + Math.random() * 3000);
          b.lifetime = -999; // Mark as gone
        }
        return;
      }

      b.wingPhase += b.wingSpeed;

      if (b.onHeart) {
        // Orbit the heart shape
        b.heartT += b.heartOrbitSpeed + 0.006;
        const p = heartPoint(b.heartT, Math.min(W,H)*0.28, cx, cy);
        b.x += (p.x - b.x) * 0.05;
        b.y += (p.y - b.y) * 0.05;
        b.angle = Math.atan2(b.vy, b.vx) + Math.PI/4;
        // Float slightly
        b.x += Math.cos(b.wingPhase * 0.5) * 0.5;
        b.y += Math.sin(b.wingPhase * 0.7) * 0.4;
      } else {
        // Free flying
        b.x += b.vx;
        b.y += b.vy;
        b.angle = Math.atan2(b.vy, b.vx);
        b.vx += (Math.random()-0.5) * 0.1;
        b.vy += (Math.random()-0.5) * 0.1;
        // Clamp speed
        const spd = Math.hypot(b.vx, b.vy);
        if (spd > 1.8) { b.vx *= 1.8/spd; b.vy *= 1.8/spd; }
        // Wrap
        if (b.x < -50) b.x = W + 50;
        if (b.x > W + 50) b.x = -50;
        if (b.y < -50) b.y = H + 50;
        if (b.y > H + 50) b.y = -50;
        b.angleSpeed = (Math.random()-0.5) * 0.04;
      }

      drawButterfly(b);
    });
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    if (isActive) update();
    requestAnimationFrame(loop);
  }

  // Click interaction — butterfly → stars
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    butterflies.forEach(b => {
      if (b.dying || b.lifetime < 0) return;
      const dist = Math.hypot(b.x - mx, b.y - my);
      if (dist < b.size * 1.5) {
        b.dying = true;
        // Create star burst
        for (let i = 0; i < 15; i++) {
          const angle = (i / 15) * Math.PI * 2;
          const spd = 2 + Math.random() * 4;
          b.stars.push({
            x: b.x, y: b.y,
            vx: Math.cos(angle) * spd,
            vy: Math.sin(angle) * spd - 1,
            r: 2 + Math.random() * 3,
            hue: b.hue,
            life: 1
          });
        }
      }
    });
  });

  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const mx = touch.clientX - rect.left;
    const my = touch.clientY - rect.top;

    butterflies.forEach(b => {
      if (b.dying || b.lifetime < 0) return;
      const dist = Math.hypot(b.x - mx, b.y - my);
      if (dist < b.size * 2) {
        b.dying = true;
        for (let i = 0; i < 15; i++) {
          const angle = (i / 15) * Math.PI * 2;
          const spd = 2 + Math.random() * 4;
          b.stars.push({
            x: b.x, y: b.y,
            vx: Math.cos(angle) * spd,
            vy: Math.sin(angle) * spd - 1,
            r: 2 + Math.random() * 3,
            hue: b.hue,
            life: 1
          });
        }
      }
    });
  }, { passive: false });

  // Activate/deactivate based on visibility
  const s4 = document.getElementById('s4');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { isActive = e.isIntersecting; });
  }, { threshold: 0.2 });

  if (s4) observer.observe(s4);

  window.addEventListener('resize', resize);
  resize();
  loop();
})();
