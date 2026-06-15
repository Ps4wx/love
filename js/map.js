// ═══════════════════════════════════════
//   MAP ANIMATION — SECTION 8
// ═══════════════════════════════════════
(function() {
  const s8 = document.getElementById('s8');
  const lovePath = document.getElementById('lovePath');
  const markerUP = document.getElementById('markerUP');
  const markerBihar = document.getElementById('markerBihar');
  const distLabel = document.getElementById('distanceLabel');
  const textLines = document.querySelectorAll('.s8-line');

  let animated = false;

  function animateMap() {
    if (animated) return;
    animated = true;

    // Animate path drawing
    setTimeout(() => {
      if (lovePath) {
        lovePath.style.transition = 'stroke-dashoffset 2s ease-in-out';
        lovePath.setAttribute('stroke-dashoffset', '0');
        lovePath.style.filter = 'url(#glow)';
      }
    }, 500);

    // Show UP marker (Priyanshu)
    setTimeout(() => {
      if (markerUP) {
        markerUP.style.transition = 'opacity 0.8s ease';
        markerUP.setAttribute('opacity', '1');
        // Pulse animation
        markerUP.querySelectorAll('circle').forEach((c, i) => {
          c.style.animation = `markerPulse ${1 + i*0.3}s ease-in-out infinite`;
        });
      }
    }, 1200);

    // Show Bihar marker (Prachi)
    setTimeout(() => {
      if (markerBihar) {
        markerBihar.style.transition = 'opacity 0.8s ease';
        markerBihar.setAttribute('opacity', '1');
      }
    }, 1800);

    // Show distance
    setTimeout(() => {
      if (distLabel) {
        distLabel.style.transition = 'opacity 0.8s ease';
        distLabel.setAttribute('opacity', '1');
      }
    }, 2200);

    // Show text lines
    textLines.forEach((line, i) => {
      setTimeout(() => {
        line.classList.add('visible');
      }, 2500 + i * 600);
    });
  }

  function resetMap() {
    animated = false;
    if (lovePath) lovePath.setAttribute('stroke-dashoffset', '200');
    if (markerUP) markerUP.setAttribute('opacity', '0');
    if (markerBihar) markerBihar.setAttribute('opacity', '0');
    if (distLabel) distLabel.setAttribute('opacity', '0');
    textLines.forEach(l => l.classList.remove('visible'));
  }

  // Add CSS animation for markers
  const style = document.createElement('style');
  style.textContent = `
    @keyframes markerPulse {
      0%, 100% { opacity: 0.5; transform: scale(1); }
      50% { opacity: 0.9; transform: scale(1.15); }
    }
    @keyframes pathGlow {
      0%, 100% { filter: url(#glow) drop-shadow(0 0 4px #ff6eb4); }
      50% { filter: url(#glow) drop-shadow(0 0 12px #ff9de2); }
    }
  `;
  document.head.appendChild(style);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateMap();
      } else if (e.boundingClientRect.top > 0) {
        resetMap();
      }
    });
  }, { threshold: 0.3 });

  if (s8) observer.observe(s8);
})();
