// TuZhi Codes deco name : "heart-frame"
(function () {
  const cv = document.getElementById('decoCanvas');
  if (!cv) return;
  const ctx = cv.getContext('2d');

  const W = 150, H = 150, CX = 75, CY = 75;
  const R = 52;

  const PINK  = '#ff6b9d';
  const PINK2 = '#ff9ac0';
  const WHITE = '#ffffff';

  let t = 0, raf;


  function heart(x, y, s, a, glow = 10) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    ctx.globalAlpha = a;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(0, -4, -6, -4, -6, 0);
    ctx.bezierCurveTo(-6, 4, 0, 6, 0, 9);
    ctx.bezierCurveTo(0, 6, 6, 4, 6, 0);
    ctx.bezierCurveTo(6, -4, 0, -4, 0, 0);

    const grd = ctx.createLinearGradient(0, -6, 0, 8);
    grd.addColorStop(0, PINK2);
    grd.addColorStop(1, PINK);

    ctx.fillStyle = grd;
    ctx.shadowColor = PINK;
    ctx.shadowBlur = glow;
    ctx.fill();

    ctx.restore();
  }


  function softAura() {
    const g = ctx.createRadialGradient(CX, CY, R - 20, CX, CY, R);
    g.addColorStop(0, 'rgba(255,107,157,0)');
    g.addColorStop(1, 'rgba(255,107,157,0.18)');

    ctx.beginPath();
    ctx.arc(CX, CY, R, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.globalAlpha = 0.9;
    ctx.fill();
  }


  const particles = Array.from({ length: 10 }).map(() => ({
    a: Math.random() * Math.PI * 2,
    r: 28 + Math.random() * 16,
    sp: 0.008 + Math.random() * 0.015,
    sz: 1.2 + Math.random() * 1.5
  }));

  function draw() {
    ctx.clearRect(0, 0, W, H);
    t++;


    softAura();


    const count = 8;

    for (let i = 0; i < count; i++) {
      const ang = (i / count) * Math.PI * 2 + t * 0.015;
      const x = CX + Math.cos(ang) * (R - 7);
      const y = CY + Math.sin(ang) * (R - 7);
      const pulse = 0.85 + Math.sin(t * 0.04 + i) * 0.2;
      heart(x, y, 1.05 * pulse, 0.95, 14);
    }


    for (let i = 0; i < 5; i++) {
      const ang = (i / 5) * Math.PI * 2 - t * 0.01;
      const x = CX + Math.cos(ang) * (R - 18);
      const y = CY + Math.sin(ang) * (R - 18);
      heart(x, y, 0.6, 0.35, 6);
    }


    particles.forEach(p => {
      p.a += p.sp;
      const x = CX + Math.cos(p.a) * p.r;
      const y = CY + Math.sin(p.a) * p.r;
      ctx.beginPath();
      ctx.arc(x, y, p.sz, 0, Math.PI * 2);
      ctx.fillStyle = WHITE;
      ctx.globalAlpha = 0.35;
      ctx.shadowBlur = 5;
      ctx.fill();
    });


    const pulse = 0.15 + 0.1 * Math.sin(t * 0.03);
    ctx.beginPath();
    ctx.arc(CX, CY, R - 20, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,107,157,${pulse})`;
    ctx.globalAlpha = 0.12;
    ctx.fill();

    raf = requestAnimationFrame(draw);
  }

  if (window._decoRaf) cancelAnimationFrame(window._decoRaf);
  draw();
})();

