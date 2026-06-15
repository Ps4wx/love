// ═══════════════════════════════════════
//   STARS + AMBIENT PARTICLES BACKGROUND
// ═══════════════════════════════════════
(function() {
  const starsC = document.getElementById('starsCanvas');
  const ctx = starsC.getContext('2d');
  const bgC = document.getElementById('particlesBg');
  const bgCtx = bgC.getContext('2d');

  let W, H;
  const stars = [];
  const ambientParticles = [];

  function resize() {
    W = starsC.width = window.innerWidth;
    H = starsC.height = window.innerHeight;
    bgC.width = window.innerWidth;
    bgC.height = window.innerHeight;
    initStars();
    initAmbient();
  }

  function initStars() {
    stars.length = 0;
    const count = Math.floor((W * H) / 3000);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.5 + 0.2,
        alpha: Math.random() * 0.7 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
        color: Math.random() > 0.8 ? '#ffcce6' : (Math.random() > 0.5 ? '#ffffff' : '#ffe0f0')
      });
    }
  }

  function initAmbient() {
    ambientParticles.length = 0;
    for (let i = 0; i < 60; i++) {
      ambientParticles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3 - 0.1,
        r: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.3 + 0.05,
        hue: 300 + Math.random() * 60
      });
    }
  }

  let time = 0;
  function drawStars() {
    ctx.clearRect(0, 0, W, H);
    time += 0.01;

    stars.forEach(s => {
      const a = s.alpha * (0.6 + 0.4 * Math.sin(time * s.twinkleSpeed * 60 + s.twinkleOffset));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.globalAlpha = a;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  function drawAmbient() {
    bgCtx.clearRect(0, 0, W, H);

    ambientParticles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      bgCtx.beginPath();
      bgCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      bgCtx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.alpha})`;
      bgCtx.fill();
    });
  }

  function loop() {
    drawStars();
    drawAmbient();
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  resize();
  loop();
})();
