// ═══════════════════════════════════════
//   FLOWER FINALE — SECTION 9
// ═══════════════════════════════════════
(function() {
  const canvas = document.getElementById('flowersCanvas');
  const ctx = canvas.getContext('2d');
  let W, H;
  const flowers = [];
  let flowersSpawned = 0;
  let coverageReady = false;
  let isFlowing = false; // flowing away
  let flowProgress = 0;
  let isActive = false;
  let spawnInterval = null;

  const TOTAL_FLOWERS = 120;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  const FLOWER_COLORS = [
    ['#ff99cc', '#ff66aa', '#ff3388'],
    ['#ffb3de', '#ff80c0', '#ff4da6'],
    ['#cc99ff', '#9966ff', '#7733ff'],
    ['#ff99ff', '#ff66ff', '#ff33ff'],
    ['#ffcc99', '#ff9966', '#ff6633'],
    ['#ffb3b3', '#ff8080', '#ff4d4d'],
    ['#99ffcc', '#66ffaa', '#33ff88'],
  ];

  function createFlower() {
    const x = Math.random() * W;
    const y = -60 - Math.random() * 80;
    const targetY = Math.random() * H;
    const colors = FLOWER_COLORS[Math.floor(Math.random() * FLOWER_COLORS.length)];
    return {
      x,
      y,
      targetY,
      originalY: y,
      vy: 0.5 + Math.random() * 2.5,
      vx: (Math.random() - 0.5) * 1.2,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.04,
      size: 20 + Math.random() * 25,
      colors,
      petalCount: 5 + Math.floor(Math.random() * 4),
      alpha: 0,
      placed: false,
      flowAwayVy: 0,
      flowAwayVx: 0,
    };
  }

  function drawFlower(f) {
    ctx.save();
    ctx.translate(f.x, f.y);
    ctx.rotate(f.rotation);
    ctx.globalAlpha = f.alpha;

    const s = f.size;
    const pc = f.petalCount;

    // Petals
    for (let i = 0; i < pc; i++) {
      const a = (i / pc) * Math.PI * 2;
      ctx.save();
      ctx.rotate(a);

      const pGrad = ctx.createRadialGradient(0, s*0.35, 0, 0, s*0.4, s*0.55);
      pGrad.addColorStop(0, f.colors[0]);
      pGrad.addColorStop(0.6, f.colors[1]);
      pGrad.addColorStop(1, f.colors[2] + '80');

      ctx.beginPath();
      ctx.ellipse(0, s * 0.38, s * 0.2, s * 0.38, 0, 0, Math.PI * 2);
      ctx.fillStyle = pGrad;
      ctx.fill();
      ctx.restore();
    }

    // Center
    const cGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, s * 0.18);
    cGrad.addColorStop(0, '#fff8b0');
    cGrad.addColorStop(0.5, '#ffd700');
    cGrad.addColorStop(1, '#ff8c00');
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.18, 0, Math.PI * 2);
    ctx.fillStyle = cGrad;
    ctx.fill();

    // Center dots
    for (let i = 0; i < 5; i++) {
      const da = (i / 5) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(Math.cos(da) * s*0.1, Math.sin(da) * s*0.1, s*0.03, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(180,100,0,0.6)';
      ctx.fill();
    }

    ctx.restore();
  }

  function spawnFlowers() {
    if (flowersSpawned >= TOTAL_FLOWERS || !isActive) return;

    const f = createFlower();
    flowers.push(f);
    flowersSpawned++;

    if (flowersSpawned >= TOTAL_FLOWERS) {
      // Mark coverage ready after a delay
      setTimeout(() => { coverageReady = true; }, 1000);
      clearInterval(spawnInterval);
      spawnInterval = null;
    }
  }

  // Flow away animation
  function startFlowAway() {
    if (!coverageReady) return;
    isFlowing = true;

    flowers.forEach(f => {
      const angle = Math.atan2(f.y - H/2, f.x - W/2);
      const speed = 3 + Math.random() * 5;
      f.flowAwayVx = Math.cos(angle) * speed + (Math.random()-0.5) * 2;
      f.flowAwayVy = Math.sin(angle) * speed + (Math.random()-0.5) * 2 - 2;
    });

    // Reveal finale after flowers clear
    setTimeout(() => {
      const flowerOverlay = document.getElementById('flowerOverlay');
      const finaleReveal = document.getElementById('finaleReveal');
      if (flowerOverlay) flowerOverlay.style.opacity = '0';
      if (finaleReveal) {
        finaleReveal.classList.remove('hidden');
        finaleReveal.style.animation = 'fadeInUp 1s ease both';
        // Start finale butterflies
        startFinaleButterflies();
      }
    }, 1500);
  }

  // Finale butterfly animation
  function startFinaleButterflies() {
    const bCanvas = document.getElementById('finaleButterflies');
    if (!bCanvas) return;
    const bCtx = bCanvas.getContext('2d');
    const butterflies = [];
    let bW, bH;

    function bResize() {
      bW = bCanvas.width = window.innerWidth;
      bH = bCanvas.height = window.innerHeight;
    }

    for (let i = 0; i < 15; i++) {
      butterflies.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random()-0.5) * 2,
        vy: (Math.random()-0.5) * 2,
        size: 12 + Math.random() * 16,
        hue: 290 + Math.random() * 90,
        wingPhase: Math.random() * Math.PI * 2,
        angle: Math.random() * Math.PI * 2
      });
    }

    function bLoop() {
      bCtx.clearRect(0, 0, bW || window.innerWidth, bH || window.innerHeight);
      butterflies.forEach(b => {
        b.wingPhase += 0.1;
        b.x += b.vx;
        b.y += b.vy;
        b.vx += (Math.random()-0.5) * 0.1;
        b.vy += (Math.random()-0.5) * 0.1;
        const spd = Math.hypot(b.vx, b.vy);
        if (spd > 2) { b.vx *= 2/spd; b.vy *= 2/spd; }
        b.angle = Math.atan2(b.vy, b.vx);
        if (b.x < -50) b.x = (bW || window.innerWidth) + 50;
        if (b.x > (bW || window.innerWidth) + 50) b.x = -50;
        if (b.y < -50) b.y = (bH || window.innerHeight) + 50;
        if (b.y > (bH || window.innerHeight) + 50) b.y = -50;

        // Simple butterfly
        bCtx.save();
        bCtx.translate(b.x, b.y);
        bCtx.rotate(b.angle);
        const wf = Math.cos(b.wingPhase) * 0.6;
        const s = b.size;

        bCtx.globalAlpha = 0.7;
        // Left wing
        bCtx.save();
        bCtx.scale(-1+wf*0.3, 1);
        bCtx.beginPath();
        bCtx.moveTo(0, 0);
        bCtx.bezierCurveTo(s, -s*0.7, s*1.1, -s*0.2, s*0.8, s*0.15);
        bCtx.bezierCurveTo(s*0.5, s*0.35, s*0.1, s*0.05, 0, 0);
        bCtx.fillStyle = `hsla(${b.hue}, 80%, 70%, 0.85)`;
        bCtx.fill();
        bCtx.restore();
        // Right wing
        bCtx.save();
        bCtx.scale(1+wf*0.3, 1);
        bCtx.beginPath();
        bCtx.moveTo(0, 0);
        bCtx.bezierCurveTo(s, -s*0.7, s*1.1, -s*0.2, s*0.8, s*0.15);
        bCtx.bezierCurveTo(s*0.5, s*0.35, s*0.1, s*0.05, 0, 0);
        bCtx.fillStyle = `hsla(${b.hue+30}, 80%, 70%, 0.85)`;
        bCtx.fill();
        bCtx.restore();
        bCtx.restore();
      });
      requestAnimationFrame(bLoop);
    }

    bResize();
    window.addEventListener('resize', bResize);
    bLoop();
  }

  let tapHintHidden = false;
  const flowerOverlay = document.getElementById('flowerOverlay');

  if (flowerOverlay) {
    flowerOverlay.addEventListener('click', startFlowAway);
    flowerOverlay.addEventListener('touchstart', (e) => {
      e.preventDefault();
      startFlowAway();
    }, { passive: false });
  }

  let time = 0;
  function loop() {
    ctx.clearRect(0, 0, W, H);

    flowers.forEach((f, i) => {
      if (isFlowing) {
        f.x += f.flowAwayVx;
        f.y += f.flowAwayVy;
        f.flowAwayVy -= 0.1;
        f.alpha = Math.max(0, f.alpha - 0.015);
      } else if (!f.placed) {
        f.y += f.vy;
        f.x += f.vx;
        f.rotation += f.rotSpeed;
        f.alpha = Math.min(1, f.alpha + 0.04);

        if (f.y >= f.targetY) {
          f.y = f.targetY;
          f.vy = 0;
          f.vx = 0;
          f.placed = true;
        }
      } else {
        // Gentle sway
        f.rotation += Math.sin(time * 0.5 + i) * 0.002;
        f.alpha = 0.85 + Math.sin(time + i * 0.5) * 0.1;
      }

      if (f.alpha > 0.02) drawFlower(f);
    });

    time += 0.02;
    requestAnimationFrame(loop);
  }

  const s9 = document.getElementById('s9');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !isActive) {
        isActive = true;
        spawnInterval = setInterval(spawnFlowers, 60);
      }
    });
  }, { threshold: 0.2 });

  if (s9) observer.observe(s9);

  window.addEventListener('resize', resize);
  resize();
  loop();
})();
