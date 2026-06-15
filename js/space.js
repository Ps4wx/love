// ═══════════════════════════════════════
//   MOON & EARTH ORBIT — SECTION 5
// ═══════════════════════════════════════
(function() {
  const canvas = document.getElementById('spaceCanvas');
  const ctx = canvas.getContext('2d');
  let W, H;
  let isActive = false;
  let angle = 0;
  const stars = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initStars();
  }

  function initStars() {
    stars.length = 0;
    const count = Math.floor((W * H) / 4000);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.4 + 0.2,
        alpha: Math.random() * 0.7 + 0.2,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.03 + 0.01
      });
    }
  }

  function drawStars(time) {
    stars.forEach(s => {
      const a = s.alpha * (0.5 + 0.5 * Math.sin(s.twinkle + time * s.twinkleSpeed * 60));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,230,245,${a})`;
      ctx.fill();
    });
  }

  // Draw Earth (Priyanshu)
  function drawEarth(x, y, r) {
    // Atmosphere glow
    const atmoGrad = ctx.createRadialGradient(x, y, r * 0.9, x, y, r * 1.4);
    atmoGrad.addColorStop(0, 'rgba(100,180,255,0.15)');
    atmoGrad.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(x, y, r * 1.4, 0, Math.PI * 2);
    ctx.fillStyle = atmoGrad;
    ctx.fill();

    // Earth body
    const earthGrad = ctx.createRadialGradient(x - r*0.3, y - r*0.3, r*0.1, x, y, r);
    earthGrad.addColorStop(0, '#4fc3f7');
    earthGrad.addColorStop(0.3, '#29b6f6');
    earthGrad.addColorStop(0.6, '#1565c0');
    earthGrad.addColorStop(1, '#0d47a1');
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = earthGrad;
    ctx.fill();

    // Continents (green patches)
    ctx.save();
    ctx.clip();
    ctx.beginPath();
    ctx.ellipse(x - r*0.2, y - r*0.1, r*0.25, r*0.3, Math.PI/6, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(76,175,80,0.7)';
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + r*0.3, y + r*0.1, r*0.2, r*0.25, -Math.PI/5, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(76,175,80,0.6)';
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x - r*0.1, y + r*0.3, r*0.3, r*0.15, Math.PI/3, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(76,175,80,0.5)';
    ctx.fill();
    ctx.restore();

    // Highlight
    const hlGrad = ctx.createRadialGradient(x - r*0.35, y - r*0.35, 0, x - r*0.1, y - r*0.1, r*0.7);
    hlGrad.addColorStop(0, 'rgba(255,255,255,0.25)');
    hlGrad.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2);
    ctx.fillStyle = hlGrad;
    ctx.fill();

    // Label
    ctx.save();
    ctx.font = `${r*0.4}px "Dancing Script"`;
    ctx.fillStyle = 'rgba(255,220,240,0.9)';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(100,180,255,0.8)';
    ctx.shadowBlur = 10;
    ctx.fillText('🌍 Priyanshu', x, y + r * 1.7);
    ctx.restore();
  }

  // Draw Moon (Prachi)
  function drawMoon(x, y, r) {
    // Moon glow
    const moonGlow = ctx.createRadialGradient(x, y, r*0.8, x, y, r*1.5);
    moonGlow.addColorStop(0, 'rgba(255,200,230,0.2)');
    moonGlow.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(x, y, r*1.5, 0, Math.PI*2);
    ctx.fillStyle = moonGlow;
    ctx.fill();

    // Moon body
    const moonGrad = ctx.createRadialGradient(x - r*0.3, y - r*0.3, r*0.05, x, y, r);
    moonGrad.addColorStop(0, '#fff9f0');
    moonGrad.addColorStop(0.4, '#f5deb3');
    moonGrad.addColorStop(0.8, '#d4a96a');
    moonGrad.addColorStop(1, '#b8860b');
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2);
    ctx.fillStyle = moonGrad;
    ctx.fill();

    // Craters
    [[x+r*0.2, y-r*0.1, r*0.12], [x-r*0.3, y+r*0.2, r*0.08], [x+r*0.1, y+r*0.3, r*0.1]].forEach(([cx,cy,cr]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, cr, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(160,120,60,0.4)';
      ctx.fill();
    });

    // Highlight
    const mhl = ctx.createRadialGradient(x-r*0.3, y-r*0.3, 0, x-r*0.1, y-r*0.1, r*0.6);
    mhl.addColorStop(0, 'rgba(255,255,255,0.4)');
    mhl.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2);
    ctx.fillStyle = mhl;
    ctx.fill();

    // Pink tint (love)
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(255,182,193,0.12)';
    ctx.fill();

    // Label
    ctx.save();
    ctx.font = `${r*0.5}px "Dancing Script"`;
    ctx.fillStyle = 'rgba(255,220,240,0.9)';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(255,150,200,0.8)';
    ctx.shadowBlur = 10;
    ctx.fillText('🌙 Prachi', x, y - r * 1.6);
    ctx.restore();
  }

  // Draw orbit trail
  function drawOrbitTrail(cx, cy, orbitR) {
    ctx.save();
    ctx.beginPath();
    ctx.setLineDash([4, 8]);
    ctx.arc(cx, cy, orbitR, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,182,193,0.15)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  // Love thread between Earth and Moon
  function drawLoveThread(ex, ey, mx, my) {
    ctx.save();
    ctx.beginPath();
    const mid = { x: (ex+mx)/2, y: (ey+my)/2 };
    ctx.moveTo(ex, ey);
    ctx.lineTo(mx, my);
    const grad = ctx.createLinearGradient(ex, ey, mx, my);
    grad.addColorStop(0, 'rgba(100,180,255,0.2)');
    grad.addColorStop(0.5, 'rgba(255,182,193,0.3)');
    grad.addColorStop(1, 'rgba(255,210,230,0.2)');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 0.8;
    ctx.stroke();
    ctx.restore();
  }

  let time = 0;
  function loop() {
    ctx.clearRect(0, 0, W, H);

    if (isActive) {
      time += 0.006;
      angle += 0.006;
    }

    drawStars(time);

    const earthR = Math.min(W, H) * 0.12;
    const ex = W / 2, ey = H / 2;
    const orbitR = Math.min(W, H) * 0.3;
    const moonR = earthR * 0.45;
    const mx = ex + Math.cos(angle) * orbitR;
    const my = ey + Math.sin(angle) * orbitR;

    drawOrbitTrail(ex, ey, orbitR);
    drawLoveThread(ex, ey, mx, my);
    drawEarth(ex, ey, earthR);
    drawMoon(mx, my, moonR);

    requestAnimationFrame(loop);
  }

  const s5 = document.getElementById('s5');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { isActive = e.isIntersecting; });
  }, { threshold: 0.3 });

  if (s5) observer.observe(s5);

  window.addEventListener('resize', resize);
  resize();
  loop();
})();
