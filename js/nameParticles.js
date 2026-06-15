// ═══════════════════════════════════════
//   NAME PARTICLES — SECTION 2
// ═══════════════════════════════════════
(function() {
  const canvas = document.getElementById('nameParticlesCanvas');
  const ctx = canvas.getContext('2d');
  let W, H;
  const particles = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initParticles();
  }

  function initParticles() {
    particles.length = 0;
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6 - 0.15,
        r: Math.random() * 2.5 + 0.3,
        alpha: Math.random() * 0.5 + 0.1,
        hue: 290 + Math.random() * 80,
        life: Math.random(),
        decay: 0.003 + Math.random() * 0.004
      });
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;

      if (p.life <= 0) {
        particles[i] = {
          x: Math.random() * W,
          y: H + 10,
          vx: (Math.random() - 0.5) * 0.6,
          vy: -(Math.random() * 0.5 + 0.1),
          r: Math.random() * 2.5 + 0.3,
          alpha: Math.random() * 0.5 + 0.1,
          hue: 290 + Math.random() * 80,
          life: 1,
          decay: 0.003 + Math.random() * 0.004
        };
        return;
      }

      const fade = p.life > 0.8 ? (1 - p.life) * 5 : (p.life < 0.2 ? p.life * 5 : 1);

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 80%, 75%, ${p.alpha * fade})`;
      ctx.shadowColor = `hsla(${p.hue}, 80%, 75%, 0.5)`;
      ctx.shadowBlur = 4;
      ctx.fill();
    });

    requestAnimationFrame(loop);
  }

  // Trigger name lines to appear when in view
  const nameLines = document.querySelectorAll('.name-line');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay * 400);
      }
    });
  }, { threshold: 0.3 });

  nameLines.forEach(line => observer.observe(line));

  window.addEventListener('resize', resize);
  resize();
  loop();
})();
