// TuZhi Codes deco name : "ocean-frame"
(function () {
  const cv = document.getElementById('decoCanvas');
  if (!cv) return;
  const ctx = cv.getContext('2d');

  const W = 150, H = 150, CX = 75, CY = 75, R = 52;

  const TEAL   = '#38d9c0';
  const BLUE   = '#4fa8d8';
  const FOAM   = '#a8eeff';
  const DEEP   = '#1a7a9a';
  const WHITE  = '#ffffff';

  let t = 0;


  const bubbles = Array.from({ length: 14 }, (_, i) => ({
    angle  : (i / 14) * Math.PI * 2 + Math.random() * 0.4,
    orbit  : R - 4 + Math.random() * 10,
    speed  : (0.006 + Math.random() * 0.009) * (Math.random() < 0.5 ? 1 : -1),
    size   : 2.5 + Math.random() * 4.5,
    phase  : Math.random() * Math.PI * 2,
    opacity: 0.45 + Math.random() * 0.45,
    color  : Math.random() < 0.5 ? TEAL : BLUE,
  }));


  const foam = Array.from({ length: 10 }, (_, i) => ({
    angle: (i / 10) * Math.PI * 2,
    speed: 0.005 + Math.random() * 0.006,
    phase: Math.random() * Math.PI * 2,
    size : 1.2 + Math.random() * 1.6,
  }));


  const micro = Array.from({ length: 8 }, () => ({
    x    : CX + (Math.random() - 0.5) * (R * 1.2),
    y    : CY + Math.random() * R * 0.8,
    speed: 0.3 + Math.random() * 0.5,
    size : 0.8 + Math.random() * 1.4,
    alpha: 0.2 + Math.random() * 0.25,
    drift: (Math.random() - 0.5) * 0.3,
  }));


  function drawBubble(x, y, r, alpha, color) {
    ctx.save();
    ctx.globalAlpha = alpha;


    const fill = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.05, x, y, r);
    fill.addColorStop(0, 'rgba(255,255,255,0.55)');
    fill.addColorStop(0.5, color + '55');
    fill.addColorStop(1, color + '22');
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.shadowColor = color;
    ctx.shadowBlur = 8;
    ctx.fill();


    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.strokeStyle = FOAM;
    ctx.lineWidth = 0.6;
    ctx.globalAlpha = alpha * 0.5;
    ctx.stroke();


    ctx.beginPath();
    ctx.arc(x - r * 0.3, y - r * 0.3, r * 0.28, 0, Math.PI * 2);
    ctx.fillStyle = WHITE;
    ctx.globalAlpha = alpha * 0.55;
    ctx.shadowBlur = 0;
    ctx.fill();

    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    t++;


    const auraAlpha = 0.13 + 0.05 * Math.sin(t * 0.03);
    const g = ctx.createRadialGradient(CX, CY, R - 18, CX, CY, R + 2);
    g.addColorStop(0, 'rgba(56,217,192,0)');
    g.addColorStop(0.6, `rgba(56,217,192,${auraAlpha})`);
    g.addColorStop(1, 'rgba(79,168,216,0)');
    ctx.beginPath();
    ctx.arc(CX, CY, R + 2, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();


    const g2 = ctx.createRadialGradient(CX, CY, 0, CX, CY, R - 10);
    g2.addColorStop(0, 'rgba(56,217,192,0.06)');
    g2.addColorStop(1, 'rgba(56,217,192,0)');
    ctx.beginPath();
    ctx.arc(CX, CY, R - 10, 0, Math.PI * 2);
    ctx.fillStyle = g2;
    ctx.fill();


    micro.forEach(m => {
      m.y  -= m.speed;
      m.x  += m.drift;

      const dx = m.x - CX, dy = m.y - CY;
      if (m.y < CY - R || dx * dx + dy * dy > R * R) {
        m.x = CX + (Math.random() - 0.5) * R * 1.1;
        m.y = CY + R * 0.7;
      }
      ctx.save();
      ctx.globalAlpha = m.alpha;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
      ctx.fillStyle = FOAM;
      ctx.shadowColor = TEAL;
      ctx.shadowBlur = 4;
      ctx.fill();
      ctx.restore();
    });


    bubbles.forEach((b, i) => {
      b.angle += b.speed;
      const bob = Math.sin(t * 0.04 + b.phase) * 2.5;
      const x   = CX + Math.cos(b.angle) * b.orbit;
      const y   = CY + Math.sin(b.angle) * b.orbit + bob;

      const cx2 = Math.max(b.size + 1, Math.min(W - b.size - 1, x));
      const cy2 = Math.max(b.size + 1, Math.min(H - b.size - 1, y));
      const alphaPulse = b.opacity * (0.75 + 0.25 * Math.sin(t * 0.05 + b.phase));
      drawBubble(cx2, cy2, b.size, alphaPulse, b.color);
    });


    foam.forEach(f => {
      f.angle += f.speed;
      const x     = CX + Math.cos(f.angle) * (R - 2);
      const y     = CY + Math.sin(f.angle) * (R - 2);
      const alpha = 0.3 + 0.45 * Math.abs(Math.sin(t * 0.06 + f.phase));
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(x, y, f.size, 0, Math.PI * 2);
      ctx.fillStyle = WHITE;
      ctx.shadowColor = FOAM;
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.restore();
    });

    window._decoRaf = requestAnimationFrame(draw);
  }

  if (window._decoRaf) cancelAnimationFrame(window._decoRaf);
  draw();
})();

