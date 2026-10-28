// TuZhi Codes deco name : "cloud-charm"
(function () {
  const cv = document.getElementById('decoCanvas');
  if (!cv) return;
  const ctx = cv.getContext('2d');

  const W = 150, H = 150, CX = 75, CY = 75, R = 52;

  const dpr = (ctx.getTransform && ctx.getTransform().a) || 1;

  const BANDS = [
    { a0: 178, a1: 252, radius: 55, count: 7, baseR: 11, seed: 3 },
    { a0: 322, a1: 388, radius: 55, count: 6, baseR: 11, seed: 7 },
    { a0: 108, a1: 168, radius: 54, count: 7, baseR: 11, seed: 11 },
    { a0: 33, a1: 68, radius: 55, count: 5, baseR: 10, seed: 17 },
  ];

  const STARS = [
    { x: 55, y: 33, s: 5, phase: 0 },
    { x: 29, y: 75, s: 4, phase: 2.4 },
  ];

  const ANCHOR = { x: 98, y: 35 };
  const STRING_LEN = 30;

  const off = document.createElement('canvas');
  off.width = 150 * dpr;
  off.height = 150 * dpr;
  const oc = off.getContext('2d');
  oc.setTransform(dpr, 0, 0, dpr, 0, 0);

  function puff(c, x, y, r, style, alpha) {
    const g = c.createRadialGradient(x, y, r * 0.1, x, y, r);
    if (style === 0) {
      g.addColorStop(0, `rgba(190,205,228,${alpha})`);
      g.addColorStop(1, 'rgba(190,205,228,0)');
    } else if (style === 1) {
      g.addColorStop(0, `rgba(255,255,255,${alpha})`);
      g.addColorStop(0.7, `rgba(232,240,250,${alpha * 0.8})`);
      g.addColorStop(1, 'rgba(220,230,245,0)');
    } else {
      g.addColorStop(0, `rgba(255,255,255,${alpha})`);
      g.addColorStop(1, 'rgba(255,255,255,0)');
    }
    c.fillStyle = g;
    c.beginPath();
    c.arc(x, y, r, 0, Math.PI * 2);
    c.fill();
  }

  function paintPuff(x, y, r) {
    puff(oc, x, y + r * 0.28, r * 1.05, 0, 0.5);
    puff(oc, x, y, r, 1, 0.95);
    puff(oc, x - r * 0.25, y - r * 0.3, r * 0.55, 2, 0.95);
  }

  function paintBands() {
    BANDS.forEach(b => {
      for (let i = 0; i < b.count; i++) {
        const u = b.count === 1 ? 0.5 : i / (b.count - 1);
        const a = (b.a0 + (b.a1 - b.a0) * u) * Math.PI / 180;
        const swell = Math.sin(u * Math.PI);
        const r = b.baseR * (0.68 + 0.55 * swell) + Math.sin(b.seed + i * 2.3) * 1.4;
        const rr = b.radius + Math.sin(b.seed + i * 1.7) * 2;
        const x = CX + Math.cos(a) * rr;
        const y = CY + Math.sin(a) * rr;
        paintPuff(x, y, r);
      }
    });
  }

  paintBands();

  let t = 0;

  function starPath(c, x, y, s, rot) {
    c.beginPath();
    for (let i = 0; i < 10; i++) {
      const rr = i % 2 === 0 ? s : s * 0.45;
      const a = -Math.PI / 2 + rot + (i * Math.PI) / 5;
      const px = x + Math.cos(a) * rr;
      const py = y + Math.sin(a) * rr;
      if (i === 0) c.moveTo(px, py);
      else c.lineTo(px, py);
    }
    c.closePath();
  }

  function drawStar(s, big) {
    const tw = 0.5 + 0.5 * Math.sin(t * 0.06 + s.phase);
    const sc = (big ? 1.2 : 1) * (0.75 + 0.35 * tw);
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.scale(sc, sc);
    const g = ctx.createRadialGradient(0, 0, 0.5, 0, 0, s.s * 1.7);
    g.addColorStop(0, '#fff7d6');
    g.addColorStop(0.5, '#ffd166');
    g.addColorStop(1, 'rgba(255,160,40,0)');
    ctx.fillStyle = g;
    starPath(ctx, 0, 0, s.s, t * 0.008 + s.phase);
    ctx.shadowColor = '#ffcf5c';
    ctx.shadowBlur = 11;
    ctx.globalAlpha = 0.45 + 0.55 * tw;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = `rgba(255,255,255,${0.4 + 0.5 * tw})`;
    ctx.lineWidth = 0.9;
    const fl = s.s * (1.1 + tw * 1.1);
    ctx.beginPath();
    ctx.moveTo(-fl, 0); ctx.lineTo(fl, 0);
    ctx.moveTo(0, -fl); ctx.lineTo(0, fl);
    ctx.stroke();
    ctx.restore();
  }

  function drawBead(x, y, r) {
    const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 0.5, x, y, r);
    g.addColorStop(0, '#ffffff');
    g.addColorStop(0.55, '#cfe4ff');
    g.addColorStop(1, '#7fa8d8');
    ctx.fillStyle = g;
    ctx.shadowColor = '#bcd8ff';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  function drawFlower(x, y, r, petal, spin) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(spin);
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      const px = Math.cos(a) * r * 0.55;
      const py = Math.sin(a) * r * 0.55;
      const g = ctx.createRadialGradient(px, py, 0.5, px, py, r * 0.6);
      g.addColorStop(0, '#ffffff');
      g.addColorStop(0.55, petal);
      g.addColorStop(1, '#7c3f6e');
      ctx.fillStyle = g;
      ctx.shadowColor = petal;
      ctx.shadowBlur = 7;
      ctx.beginPath();
      ctx.ellipse(px, py, r * 0.52, r * 0.34, a, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    const cg = ctx.createRadialGradient(-1, -1, 0.5, 0, 0, r * 0.42);
    cg.addColorStop(0, '#fffbe8');
    cg.addColorStop(0.6, '#ffd166');
    cg.addColorStop(1, '#c78a1e');
    ctx.fillStyle = cg;
    ctx.shadowColor = '#ffd166';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.42, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  function drawCharm() {
    const swing = 0.09 * Math.sin(t * 0.03);
    const lag = 0.14 * Math.sin(t * 0.03 - 0.9);
    const bob = Math.sin(t * 0.045) * 1.2;

    ctx.save();
    ctx.translate(ANCHOR.x, ANCHOR.y);
    ctx.rotate(swing);

    ctx.strokeStyle = 'rgba(255,235,180,0.9)';
    ctx.lineWidth = 1.2;
    ctx.shadowColor = '#ffd166';
    ctx.shadowBlur = 4;
    ctx.beginPath();
    ctx.moveTo(0, 5);
    ctx.quadraticCurveTo(Math.sin(swing) * 6, STRING_LEN * 0.55, 0, STRING_LEN + bob);
    ctx.stroke();
    ctx.shadowBlur = 0;

    const midY = STRING_LEN * 0.55 + bob * 0.5;
    drawBead(0, midY, 2.2);

    const bx = 0, by = STRING_LEN + bob;
    drawBead(bx, by, 4);

    const spread = 10, drop = 13;
    const cA = Math.cos(lag), sA = Math.sin(lag);
    const lx = bx + sA * drop - cA * spread;
    const ly = by + cA * drop + sA * spread;
    const rx = bx + sA * drop + cA * spread;
    const ry = by + cA * drop - sA * spread;

    ctx.strokeStyle = 'rgba(255,235,180,0.75)';
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.moveTo(bx, by + 3); ctx.lineTo(lx, ly - 6);
    ctx.moveTo(bx, by + 3); ctx.lineTo(rx, ry - 6);
    ctx.stroke();
    ctx.restore();

    const cosS = Math.cos(swing), sinS = Math.sin(swing);
    const fBase = { x: ANCHOR.x, y: ANCHOR.y };
    const toWorld = (px, py) => ({
      x: fBase.x + px * cosS - py * sinS,
      y: fBase.y + px * sinS + py * cosS,
    });
    const wL = toWorld(lx, ly), wR = toWorld(rx, ry);
    drawFlower(wL.x, wL.y, 8, '#f2a3c0', lag * 1.5 + t * 0.004);
    drawFlower(wR.x, wR.y, 8, '#c9a3f2', -lag * 1.5 - t * 0.004);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    t++;

    ctx.drawImage(off, 0, 0, W, H);

    STARS.forEach(s => drawStar(s, false));
    drawStar(ANCHOR, true);
    drawCharm();

    window._decoRaf = requestAnimationFrame(draw);
  }

  if (window._decoRaf) cancelAnimationFrame(window._decoRaf);
  draw();
})();
