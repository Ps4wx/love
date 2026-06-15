// ═══════════════════════════════════════
//   PHOTO PARTICLE REVEAL — SECTION 3
// ═══════════════════════════════════════
(function() {
  const canvas = document.getElementById('photoParticleCanvas');
  const ctx = canvas.getContext('2d');
  let W, H;
  let particles = [];
  let imageData = null;
  let revealed = false;
  let revealProgress = 0;
  let isActive = false;

  const IMG_SIZE = 300;
  const PARTICLE_COUNT = 3000;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    if (imageData) buildParticles();
  }

  // Load image and sample pixels
  function loadImage() {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function() {
      const offscreen = document.createElement('canvas');
      offscreen.width = IMG_SIZE;
      offscreen.height = IMG_SIZE;
      const oCtx = offscreen.getContext('2d');

      // Circular clip
      oCtx.beginPath();
      oCtx.arc(IMG_SIZE / 2, IMG_SIZE / 2, IMG_SIZE / 2, 0, Math.PI * 2);
      oCtx.clip();
      oCtx.drawImage(img, 0, 0, IMG_SIZE, IMG_SIZE);
      imageData = oCtx.getImageData(0, 0, IMG_SIZE, IMG_SIZE);
      buildParticles();
    };
    img.onerror = function() {
      // Fallback: heart shape particles
      buildHeartParticles();
    };
    img.src = 'images/prachi.jpg';
  }

  function buildParticles() {
    particles = [];
    const data = imageData.data;
    const samples = [];

    // Sample bright pixels
    for (let y = 0; y < IMG_SIZE; y += 2) {
      for (let x = 0; x < IMG_SIZE; x += 2) {
        const i = (y * IMG_SIZE + x) * 4;
        const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
        if (a > 100) {
          samples.push({ x, y, r, g, b, a });
        }
      }
    }

    // Pick random sample subset
    const step = Math.max(1, Math.floor(samples.length / PARTICLE_COUNT));
    for (let i = 0; i < samples.length; i += step) {
      const s = samples[i];
      if (!s) continue;
      const targetX = W / 2 - IMG_SIZE / 2 + s.x;
      const targetY = H / 2 - IMG_SIZE / 2 + s.y;
      particles.push({
        targetX,
        targetY,
        x: Math.random() * W,
        y: Math.random() * H,
        r: `${s.r}`,
        g: `${s.g}`,
        b: `${s.b}`,
        size: 1.5 + Math.random() * 1.5,
        speed: 0.04 + Math.random() * 0.06
      });
    }
  }

  function buildHeartParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const t = (i / PARTICLE_COUNT) * Math.PI * 2;
      const scale = Math.min(W, H) * 0.18 / 17;
      const hx = W/2 + 16 * Math.pow(Math.sin(t), 3) * scale;
      const hy = H/2 - (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)) * scale;
      const r = 255 - Math.floor(Math.random() * 100);
      particles.push({
        targetX: hx + (Math.random() - 0.5) * 40,
        targetY: hy + (Math.random() - 0.5) * 40,
        x: Math.random() * W,
        y: Math.random() * H,
        r: `${r}`,
        g: `${Math.floor(Math.random() * 100)}`,
        b: `${Math.floor(130 + Math.random() * 125)}`,
        size: 1.5 + Math.random() * 2,
        speed: 0.04 + Math.random() * 0.06
      });
    }
    revealProgress = 0;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    if (!isActive) {
      requestAnimationFrame(draw);
      return;
    }

    if (revealProgress < 1) {
      revealProgress = Math.min(1, revealProgress + 0.008);
    }

    const ease = 1 - Math.pow(1 - revealProgress, 3);

    particles.forEach(p => {
      p.x += (p.targetX - p.x) * p.speed * (0.5 + ease * 0.5);
      p.y += (p.targetY - p.y) * p.speed * (0.5 + ease * 0.5);

      const dist = Math.hypot(p.x - p.targetX, p.y - p.targetY);
      const alpha = Math.min(1, ease * 2) * (1 - dist / (W * 0.5));

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${Math.max(0, alpha)})`;
      ctx.fill();
    });

    // Glow overlay
    if (ease > 0.5) {
      const glowAlpha = (ease - 0.5) * 0.3;
      const grad = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, IMG_SIZE * 0.6);
      grad.addColorStop(0, `rgba(255,150,200,${glowAlpha})`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    }

    requestAnimationFrame(draw);
  }

  // Activate when section 3 is in view
  const s3 = document.getElementById('s3');
  const photoText = document.querySelector('.photo-text');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        isActive = true;
        setTimeout(() => {
          if (photoText) photoText.classList.add('visible');
        }, 2000);
      } else {
        if (e.boundingClientRect.top > 0) {
          isActive = false;
          revealProgress = 0;
          particles.forEach(p => {
            p.x = Math.random() * W;
            p.y = Math.random() * H;
          });
          if (photoText) photoText.classList.remove('visible');
        }
      }
    });
  }, { threshold: 0.3 });

  if (s3) observer.observe(s3);

  window.addEventListener('resize', resize);
  resize();
  loadImage();
  draw();
})();
