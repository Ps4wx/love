// ═══════════════════════════════════════
//   HEARTS BURST ANIMATION — SECTION 6
// ═══════════════════════════════════════
(function() {
  const canvas = document.getElementById('heartsCanvas');
  const ctx = canvas.getContext('2d');
  let W, H;
  const hearts = [];
  let isActive = false;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createHeart(x, y, burst) {
    const angle = Math.random() * Math.PI * 2;
    const spd = burst ? (3 + Math.random() * 8) : (0.5 + Math.random() * 1.5);
    return {
      x: x || Math.random() * W,
      y: y || Math.random() * H,
      vx: Math.cos(angle) * spd,
      vy: Math.sin(angle) * spd - (burst ? 2 : 0.5),
      size: burst ? (8 + Math.random() * 20) : (4 + Math.random() * 8),
      alpha: 0.8 + Math.random() * 0.2,
      hue: 320 + (Math.random() - 0.5) * 60,
      life: 1,
      decay: burst ? (0.008 + Math.random() * 0.015) : (0.004 + Math.random() * 0.006),
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.06
    };
  }

  function drawHeart(h) {
    ctx.save();
    ctx.translate(h.x, h.y);
    ctx.rotate(h.rotation);
    ctx.globalAlpha = h.alpha * h.life;

    const s = h.size;
    ctx.beginPath();
    ctx.moveTo(0, s * 0.25);
    ctx.bezierCurveTo(-s * 0.5, -s * 0.25, -s, s * 0.1, 0, s * 0.9);
    ctx.bezierCurveTo(s, s * 0.1, s * 0.5, -s * 0.25, 0, s * 0.25);

    const grad = ctx.createRadialGradient(0, s*0.3, 0, 0, s*0.3, s);
    grad.addColorStop(0, `hsla(${h.hue}, 100%, 85%, 1)`);
    grad.addColorStop(1, `hsla(${h.hue - 20}, 80%, 55%, 0.6)`);
    ctx.fillStyle = grad;

    ctx.shadowColor = `hsla(${h.hue}, 100%, 70%, 0.8)`;
    ctx.shadowBlur = s * 0.6;
    ctx.fill();

    ctx.restore();
  }

  // Ambient hearts that float always in section 6
  let ambientInterval = null;

  function startAmbient() {
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        hearts.push(createHeart(null, null, false));
      }, i * 200);
    }
    ambientInterval = setInterval(() => {
      if (hearts.length < 40) hearts.push(createHeart(null, null, false));
    }, 400);
  }

  function stopAmbient() {
    if (ambientInterval) {
      clearInterval(ambientInterval);
      ambientInterval = null;
    }
  }

  // BURST on Love You button click
  const loveBtn = document.getElementById('loveYouBtn');
  const loveMsg = document.getElementById('loveMessage');

  if (loveBtn) {
    loveBtn.addEventListener('click', () => {
      // Create burst
      const bx = W / 2, by = H / 2;
      for (let i = 0; i < 120; i++) {
        setTimeout(() => {
          hearts.push(createHeart(bx, by, true));
        }, i * 10);
      }

      // Show message
      setTimeout(() => {
        if (loveMsg) loveMsg.classList.remove('hidden');
      }, 600);

      // Button animation
      loveBtn.style.transform = 'scale(1.2)';
      loveBtn.style.boxShadow = '0 0 60px rgba(255,110,180,1), 0 0 120px rgba(255,110,180,0.5)';
      setTimeout(() => {
        loveBtn.style.transform = '';
        loveBtn.style.boxShadow = '';
      }, 300);
    });
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);

    for (let i = hearts.length - 1; i >= 0; i--) {
      const h = hearts[i];
      h.x += h.vx;
      h.y += h.vy;
      h.vy += 0.03; // slight gravity
      h.vx *= 0.995;
      h.life -= h.decay;
      h.rotation += h.rotSpeed;

      if (h.life <= 0) {
        hearts.splice(i, 1);
      } else {
        drawHeart(h);
      }
    }

    requestAnimationFrame(loop);
  }

  // Section visibility
  const s6 = document.getElementById('s6');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        isActive = true;
        startAmbient();
      } else {
        isActive = false;
        stopAmbient();
        hearts.length = 0;
        if (loveMsg) loveMsg.classList.add('hidden');
      }
    });
  }, { threshold: 0.3 });

  if (s6) observer.observe(s6);

  window.addEventListener('resize', resize);
  resize();
  loop();
})();
