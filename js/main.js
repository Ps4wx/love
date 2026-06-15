// ═══════════════════════════════════════
//   MAIN — SCROLL, AUDIO, MESSAGE
// ═══════════════════════════════════════
(function() {

  // ───── AUDIO ─────
  const tracks = [
    { src: 'audio/finding-her.mp3', label: 'Finding Her' },
    { src: 'audio/perfect.mp3', label: 'Perfect' }
  ];

  let currentTrack = 0;
  let audio = null;
  let muted = false;
  let audioStarted = false;

  const muteBtn = document.getElementById('muteBtn');

  function initAudio() {
    audio = new Audio();
    audio.src = tracks[currentTrack].src;
    audio.loop = false;
    audio.volume = 0.45;
    audio.addEventListener('ended', () => {
      currentTrack = (currentTrack + 1) % tracks.length;
      audio.src = tracks[currentTrack].src;
      audio.play().catch(() => {});
    });
    audio.addEventListener('error', () => {
      // Silently fail if audio not found
    });
  }

  function startAudio() {
    if (audioStarted) return;
    audioStarted = true;
    if (!audio) initAudio();
    audio.play().then(() => {
      if (muteBtn) muteBtn.textContent = '🎵';
    }).catch(() => {
      if (muteBtn) muteBtn.textContent = '🔇';
    });
  }

  // Fade volume
  function fadeVolume(target, duration) {
    if (!audio) return;
    const start = audio.volume;
    const diff = target - start;
    const steps = 20;
    const step = duration / steps;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      audio.volume = Math.max(0, Math.min(1, start + diff * (i / steps)));
      if (i >= steps) clearInterval(interval);
    }, step);
  }

  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      if (!audioStarted) {
        startAudio();
        return;
      }
      muted = !muted;
      if (audio) {
        if (muted) {
          fadeVolume(0, 500);
          muteBtn.textContent = '🔇';
        } else {
          fadeVolume(0.45, 500);
          muteBtn.textContent = '🎵';
        }
      }
    });
  }

  // Start audio on first interaction
  document.addEventListener('click', startAudio, { once: true });
  document.addEventListener('scroll', startAudio, { once: true });
  document.addEventListener('touchstart', startAudio, { once: true });

  // ───── SCROLL SECTION TRACKING ─────
  const sections = document.querySelectorAll('.section');

  function onScroll() {
    const scrollMid = window.scrollY + window.innerHeight * 0.4;
    sections.forEach(s => {
      const top = s.offsetTop;
      const bot = top + s.offsetHeight;
      if (scrollMid >= top && scrollMid < bot) {
        s.classList.add('in-view');
      } else {
        s.classList.remove('in-view');
      }
    });

    // Audio volume by section — louder at emotional sections
    if (audio && !muted && audioStarted) {
      const progress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      const baseVol = 0.35 + progress * 0.15;
      if (!muted) audio.volume = Math.max(0, Math.min(0.7, baseVol));
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // ───── EMAILJS MESSAGE — SECTION 7 ─────
  const sendBtn = document.getElementById('sendBtn');
  const msgInput = document.getElementById('messageInput');
  const sendSuccess = document.getElementById('sendSuccess');

  // Load EmailJS
  function loadEmailJS() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    script.onload = () => {
      // Initialize with public key — replace with your actual EmailJS public key
      if (window.emailjs) {
        emailjs.init('YOUR_EMAILJS_PUBLIC_KEY');
      }
    };
    document.head.appendChild(script);
  }

  loadEmailJS();

  if (sendBtn) {
    sendBtn.addEventListener('click', async () => {
      const message = msgInput ? msgInput.value.trim() : '';
      if (!message) {
        msgInput.style.borderColor = 'rgba(255,100,100,0.6)';
        msgInput.placeholder = 'Please write something, Prachi ❤️';
        return;
      }

      sendBtn.disabled = true;
      sendBtn.textContent = 'Sending ❤️...';

      const now = new Date();
      const dateStr = now.toLocaleString('en-IN', {
        dateStyle: 'full',
        timeStyle: 'short',
        timeZone: 'Asia/Kolkata'
      });

      // Try EmailJS first
      const emailSent = await sendViaEmailJS(message, dateStr);

      if (!emailSent) {
        // Fallback: mailto link
        sendViaMailto(message, dateStr);
      }

      // Show success animation
      if (sendSuccess) {
        sendSuccess.classList.remove('hidden');
        animatePaperPlane();
      }
      if (msgInput) msgInput.value = '';
      sendBtn.textContent = 'Sent ❤️';

      setTimeout(() => {
        sendBtn.disabled = false;
        sendBtn.textContent = 'Send ❤️';
      }, 5000);
    });
  }

  async function sendViaEmailJS(message, dateStr) {
    if (!window.emailjs) return false;
    try {
      await emailjs.send(
        'service_dvqvvmn',      // Replace with your EmailJS service ID
        'service_dvqvvmn',     // Replace with your EmailJS template ID
        {
          to_email: 'fffightergamer3@gmail.com',
          subject: 'New Message From Prachi ❤️',
          date_time: dateStr,
          message: message
        }
      );
      return true;
    } catch (err) {
      console.log('EmailJS not configured, using fallback');
      return false;
    }
  }

  function sendViaMailto(message, dateStr) {
    const subject = encodeURIComponent('New Message From Prachi ❤️');
    const body = encodeURIComponent(`Date & Time: ${dateStr}\n\nMessage:\n${message}\n\n— Sent with love from Prachi ❤️`);
    const mailtoLink = `mailto:fffightergamer3@gmail.com?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
  }

  function animatePaperPlane() {
    const plane = document.querySelector('.paper-plane');
    if (!plane) return;
    plane.style.animation = 'none';
    plane.style.transform = 'translate(0, 0) rotate(0deg)';
    setTimeout(() => {
      plane.style.animation = 'planeFly 2s ease infinite';
      plane.style.transform = '';
    }, 50);
  }

  // Message input glow on focus
  if (msgInput) {
    msgInput.addEventListener('focus', () => {
      msgInput.style.borderColor = 'rgba(255,110,180,0.6)';
    });
    msgInput.addEventListener('input', () => {
      msgInput.style.borderColor = 'rgba(255,110,180,0.4)';
    });
  }

  // ───── SECTION 7 particles ─────
  (function() {
    const canvas = document.getElementById('msgParticlesCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H;
    const particles = [];

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random()-0.5)*0.4,
        vy: -(Math.random()*0.5+0.1),
        r: Math.random()*2+0.3,
        alpha: Math.random()*0.3+0.05,
        hue: 300+Math.random()*80,
        life: Math.random(),
        decay: 0.003+Math.random()*0.004
      });
    }

    function loop() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy; p.life -= p.decay;
        if (p.life <= 0) {
          particles[i] = {x:Math.random()*W,y:H+10,vx:(Math.random()-0.5)*0.4,vy:-(Math.random()*0.5+0.1),r:Math.random()*2+0.3,alpha:Math.random()*0.3+0.05,hue:300+Math.random()*80,life:1,decay:0.003+Math.random()*0.004};
          return;
        }
        const fade = p.life > 0.8 ? (1-p.life)*5 : (p.life<0.2?p.life*5:1);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = `hsla(${p.hue},80%,75%,${p.alpha*fade})`;
        ctx.shadowColor = `hsla(${p.hue},80%,75%,0.5)`;
        ctx.shadowBlur = 4;
        ctx.fill();
      });
      requestAnimationFrame(loop);
    }

    window.addEventListener('resize', resize);
    resize();
    loop();
  })();

  // ───── INIT ─────
  initAudio();

  // Ensure section 1 shows correctly
  setTimeout(() => {
    document.querySelector('.s1-content')?.classList.add('loaded');
  }, 100);

})();
