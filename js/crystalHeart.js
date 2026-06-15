// ═══════════════════════════════════════
//   CRYSTAL HEART BACKGROUND
// ═══════════════════════════════════════
(function() {
  const canvas = document.getElementById('crystalHeartCanvas');
  const ctx = canvas.getContext('2d');

  let W, H, cx, cy, heartSize;
  let scrollProgress = 0; // 0 to 1

  // Heart fragments
  const FRAG_COUNT = 32;
  const fragments = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    cx = W / 2;
    cy = H / 2;
    heartSize = Math.min(W, H) * 0.38;
    initFragments();
  }

  // Heart curve parametric: x = 16 sin³(t), y = 13cos(t) - 5cos(2t) - 2cos(3t) - cos(4t)
  function heartPoint(t) {
    const scale = heartSize / 17;
    const x = 16 * Math.pow(Math.sin(t), 3) * scale;
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)) * scale;
    return { x: cx + x, y: cy + y };
  }

  function initFragments() {
    fragments.length = 0;
    for (let i = 0; i < FRAG_COUNT; i++) {
      const t = (i / FRAG_COUNT) * Math.PI * 2;
      const p = heartPoint(t);
      const angle = Math.random() * Math.PI * 2;
      const dist = (0.3 + Math.random() * 0.7) * heartSize * 0.6;
      fragments.push({
        t,
        targetX: p.x,
        targetY: p.y,
        currentX: p.x + Math.cos(angle) * dist,
        currentY: p.y + Math.sin(angle) * dist,
        size: 4 + Math.random() * 8,
        hue: 310 + Math.random() * 60,
        alpha: 0.5 + Math.random() * 0.5,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02
      });
    }
  }

  // Draw the heart path
  function drawHeartPath(opacity, glowRadius) {
    ctx.save();
    ctx.globalAlpha = opacity;

    // Glow effect
    if (glowRadius > 0) {
      ctx.shadowColor = `hsl(320, 100%, 70%)`;
      ctx.shadowBlur = glowRadius;
    }

    ctx.beginPath();
    const steps = 120;
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * Math.PI * 2;
      const p = heartPoint(t);
      i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();

    // Crystal gradient fill
    const grad = ctx.createRadialGradient(cx, cy - heartSize * 0.1, 0, cx, cy, heartSize * 0.8);
    grad.addColorStop(0, `hsla(320, 100%, 85%, ${opacity * 0.3})`);
    grad.addColorStop(0.4, `hsla(300, 80%, 65%, ${opacity * 0.15})`);
    grad.addColorStop(1, `hsla(270, 70%, 50%, ${opacity * 0.05})`);
    ctx.fillStyle = grad;
    ctx.fill();

    // Crystal outline
    ctx.strokeStyle = `hsla(320, 100%, 80%, ${opacity})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();
  }

  function drawCracks(progress) {
    if (progress >= 0.95) return; // Fully healed
    const crackCount = Math.round(12 * (1 - progress));
    ctx.save();
    ctx.globalAlpha = (1 - progress) * 0.4;

    for (let i = 0; i < crackCount; i++) {
      const t = (i / crackCount) * Math.PI * 2;
      const p = heartPoint(t);
      const p2 = heartPoint(t + 0.3);
      ctx.beginPath();
      ctx.moveTo(p.x + (Math.random() - 0.5) * 20, p.y + (Math.random() - 0.5) * 20);
      const midX = (p.x + p2.x) / 2 + (Math.random() - 0.5) * 30;
      const midY = (p.y + p2.y) / 2 + (Math.random() - 0.5) * 30;
      ctx.lineTo(midX, midY);
      ctx.lineTo(p2.x + (Math.random() - 0.5) * 20, p2.y + (Math.random() - 0.5) * 20);
      ctx.strokeStyle = `hsla(280, 60%, 70%, 0.6)`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawFragments(progress) {
    if (progress > 0.9) return;
    const fragOpacity = Math.max(0, (0.9 - progress) / 0.9);

    fragments.forEach((f, i) => {
      // Move fragments toward target as progress increases
      const lerpFactor = Math.min(1, progress * 1.5);
      f.currentX += (f.targetX - f.currentX) * lerpFactor * 0.05;
      f.currentY += (f.targetY - f.currentY) * lerpFactor * 0.05;
      f.rotation += f.rotSpeed * (1 - progress);

      ctx.save();
      ctx.translate(f.currentX, f.currentY);
      ctx.rotate(f.rotation);
      ctx.globalAlpha = fragOpacity * f.alpha * 0.6;

      // Crystal shard shape
      ctx.beginPath();
      ctx.moveTo(0, -f.size);
      ctx.lineTo(f.size * 0.6, 0);
      ctx.lineTo(0, f.size * 0.8);
      ctx.lineTo(-f.size * 0.6, 0);
      ctx.closePath();

      const fragGrad = ctx.createLinearGradient(-f.size, -f.size, f.size, f.size);
      fragGrad.addColorStop(0, `hsla(${f.hue}, 80%, 85%, 0.8)`);
      fragGrad.addColorStop(1, `hsla(${f.hue - 30}, 60%, 60%, 0.3)`);
      ctx.fillStyle = fragGrad;
      ctx.fill();
      ctx.strokeStyle = `hsla(${f.hue}, 70%, 80%, 0.9)`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
      ctx.restore();
    });
  }

  function drawSparkles(progress) {
    if (progress < 0.85) return;
    const sparkleIntensity = (progress - 0.85) / 0.15;
    const time = Date.now() * 0.002;

    ctx.save();
    for (let i = 0; i < 20; i++) {
      const t = (i / 20) * Math.PI * 2 + time * 0.3;
      const p = heartPoint(t);
      const pulsed = 0.5 + 0.5 * Math.sin(time * 2 + i);
      const sparkSize = (2 + pulsed * 3) * sparkleIntensity;

      ctx.beginPath();
      ctx.arc(
        p.x + Math.cos(time + i) * 8,
        p.y + Math.sin(time * 0.7 + i) * 8,
        sparkSize, 0, Math.PI * 2
      );
      ctx.fillStyle = `hsla(${310 + i * 8}, 100%, 80%, ${sparkleIntensity * pulsed * 0.9})`;
      ctx.shadowColor = `hsl(320, 100%, 70%)`;
      ctx.shadowBlur = 8;
      ctx.fill();
    }
    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Opacity progresses from 0.12 to 1.0
    const baseOpacity = 0.12 + scrollProgress * 0.88;
    const glowRadius = scrollProgress * 30;

    drawFragments(scrollProgress);
    drawCracks(scrollProgress);
    drawHeartPath(baseOpacity, glowRadius);
    drawSparkles(scrollProgress);

    requestAnimationFrame(draw);
  }

  // Update scroll progress
  function updateScrollProgress() {
    const totalH = document.body.scrollHeight - window.innerHeight;
    scrollProgress = totalH > 0 ? Math.min(1, window.scrollY / totalH) : 0;
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  window.addEventListener('resize', resize);
  resize();
  draw();
})();
