// TuZhi Codes deco name : "green-pire"
(function () {
  const cv = document.getElementById('decoCanvas');
  if (!cv) return;
  const ctx = cv.getContext('2d');

  const W = 150, H = 150, CX = 75, CY = 75, R = 52;

  const LEAF1 = { bx: 121, by: 70, tx: 86, ty: 50, len: 42, wid: 26, phase: 0 };
  const LEAF2 = { bx: 26, by: 82, cx: 28, cy: 126, tx: 74, ty: 133, wid: 20, phase: 2.1 };
  const SPARKS = [
    { x: 40, y: 38, s: 5, phase: 0 },
    { x: 112, y: 112, s: 4, phase: 2.1 },
    { x: 80, y: 122, s: 4.5, phase: 4.2 },
  ];

  function mottle(seed, n, spread) {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = Math.sin(seed * 12.9 + i * 78.2) * 43758.5;
      const b = Math.sin(seed * 7.7 + i * 39.4) * 24634.7;
      pts.push({
        u: (a - Math.floor(a) - 0.5) * 2,
        v: (b - Math.floor(b) - 0.5) * 2,
        r: 2 + ((a * 7 - Math.floor(a * 7)) * 3),
      });
    }
    return { pts: pts, spread: spread };
  }

  LEAF1.blotches = mottle(3, 6);
  LEAF2.blotches = mottle(11, 8);

  let t = 0;

  function bladePath(len, wid, bend) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(len * 0.25, -wid * 0.62 + bend, len * 0.7, -wid * 0.5 + bend, len, bend * 1.6);
    ctx.bezierCurveTo(len * 0.7, wid * 0.5 + bend, len * 0.25, wid * 0.62 + bend, 0, 0);
    ctx.closePath();
  }

  function paintBlade(len, wid, blotches, light) {
    const g = ctx.createLinearGradient(0, -wid * 0.6, len * 0.4, wid * 0.6);
    g.addColorStop(0, '#14532d');
    g.addColorStop(0.45, '#16a34a');
    g.addColorStop(0.8, '#4ade80');
    g.addColorStop(1, '#bbf7d0');
    ctx.fillStyle = g;
    ctx.fill();

    ctx.save();
    ctx.clip();
    blotches.pts.forEach(p => {
      const px = len * (0.5 + p.u * 0.38);
      const py = p.v * wid * 0.4;
      const bg = ctx.createRadialGradient(px, py, 0.5, px, py, p.r);
      bg.addColorStop(0, 'rgba(10,60,25,0.35)');
      bg.addColorStop(1, 'rgba(10,60,25,0)');
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.arc(px, py, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    const sheen = ctx.createLinearGradient(0, -wid * 0.6, 0, 0);
    sheen.addColorStop(0, `rgba(255,255,255,${light})`);
    sheen.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = sheen;
    ctx.fillRect(0, -wid * 0.7, len, wid * 0.7);
    ctx.restore();

    ctx.strokeStyle = '#0b3d1f';
    ctx.lineWidth = 1.4;
    ctx.stroke();
  }

  function paintVeins(len, wid, bend, pairs) {
    ctx.strokeStyle = '#0e4d24';
    ctx.lineCap = 'round';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(1, 0);
    ctx.quadraticCurveTo(len * 0.5, bend * 0.8, len - 1, bend * 1.6);
    ctx.stroke();
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    for (let i = 1; i <= pairs; i++) {
      const u = i / (pairs + 1);
      const vx = len * u;
      const vy = bend * u * 1.4;
      const dir = i % 2 === 0 ? 1 : -1;
      ctx.moveTo(vx, vy);
      ctx.quadraticCurveTo(vx + len * 0.1, vy + dir * wid * 0.22, vx + len * 0.16, vy + dir * wid * 0.34);
    }
    ctx.stroke();
    ctx.strokeStyle = 'rgba(220,255,230,0.5)';
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(1, -0.7);
    ctx.quadraticCurveTo(len * 0.5, bend * 0.8 - 0.7, len - 1, bend * 1.6 - 0.7);
    ctx.stroke();
  }

  function drawLeaf1() {
    const sway = Math.sin(t * 0.022 + LEAF1.phase) * 0.035;
    const bend = Math.sin(t * 0.03 + LEAF1.phase) * 2;
    const ang = Math.atan2(LEAF1.ty - LEAF1.by, LEAF1.tx - LEAF1.bx) + sway;
    ctx.save();
    ctx.translate(LEAF1.bx, LEAF1.by);
    ctx.rotate(ang);
    ctx.shadowColor = '#22c55e';
    ctx.shadowBlur = 14;
    bladePath(LEAF1.len, LEAF1.wid, bend);
    ctx.shadowBlur = 0;
    ctx.save();
    bladePath(LEAF1.len, LEAF1.wid, bend);
    paintBlade(LEAF1.len, LEAF1.wid, LEAF1.blotches, 0.28 + 0.1 * Math.sin(t * 0.02));
    paintVeins(LEAF1.len, LEAF1.wid, bend, 4);
    ctx.restore();
    ctx.strokeStyle = '#14532d';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(-6, 1);
    ctx.quadraticCurveTo(-2, 0.5, 1, 0);
    ctx.stroke();
    ctx.restore();
  }

  function spinePoint(u, swayX) {
    const bx = LEAF2.bx, by = LEAF2.by;
    const cx = LEAF2.cx + swayX, cy = LEAF2.cy;
    const tx = LEAF2.tx, ty = LEAF2.ty;
    const v = 1 - u;
    return {
      x: v * v * bx + 2 * v * u * cx + u * u * tx,
      y: v * v * by + 2 * v * u * cy + u * u * ty,
    };
  }

  function drawLeaf2() {
    const swayX = Math.sin(t * 0.02 + LEAF2.phase) * 2;
    const N = 24;
    const top = [], bot = [];
    for (let i = 0; i <= N; i++) {
      const u = i / N;
      const p = spinePoint(u, swayX);
      const p2 = spinePoint(Math.min(1, u + 0.02), swayX);
      let dx = p2.x - p.x, dy = p2.y - p.y;
      const m = Math.hypot(dx, dy) || 1;
      dx /= m; dy /= m;
      const wdt = LEAF2.wid * Math.sin(Math.PI * Math.min(1, 0.12 + u * 0.95)) * (1 - u * 0.55);
      top.push({ x: p.x - dy * wdt * 0.5, y: p.y + dx * wdt * 0.5 });
      bot.push({ x: p.x + dy * wdt * 0.5, y: p.y - dx * wdt * 0.5 });
    }
    ctx.save();
    ctx.shadowColor = '#22c55e';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.moveTo(top[0].x, top[0].y);
    top.forEach(p => ctx.lineTo(p.x, p.y));
    for (let i = N; i >= 0; i--) ctx.lineTo(bot[i].x, bot[i].y);
    ctx.closePath();
    ctx.shadowBlur = 0;
    ctx.save();
    ctx.clip();
    const g = ctx.createLinearGradient(LEAF2.bx, LEAF2.by, LEAF2.tx, LEAF2.ty);
    g.addColorStop(0, '#14532d');
    g.addColorStop(0.45, '#16a34a');
    g.addColorStop(0.85, '#4ade80');
    g.addColorStop(1, '#bbf7d0');
    ctx.fillStyle = g;
    ctx.fillRect(10, 70, 80, 70);
    LEAF2.blotches.pts.forEach((p, i) => {
      const u = 0.15 + (i / LEAF2.blotches.pts.length) * 0.7;
      const sp = spinePoint(u, swayX);
      const bg = ctx.createRadialGradient(sp.x, sp.y, 0.5, sp.x, sp.y, p.r);
      bg.addColorStop(0, 'rgba(10,60,25,0.35)');
      bg.addColorStop(1, 'rgba(10,60,25,0)');
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.strokeStyle = '#0e4d24';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (let i = 0; i <= N; i += 2) {
      const u = i / N;
      const p = spinePoint(u, swayX);
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    for (let i = 2; i < N; i += 4) {
      const u = i / N;
      const p = spinePoint(u, swayX);
      const p2 = spinePoint(Math.min(1, u + 0.02), swayX);
      let dx = p2.x - p.x, dy = p2.y - p.y;
      const m = Math.hypot(dx, dy) || 1;
      dx /= m; dy /= m;
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - dy * 5 + dx * 3, p.y + dx * 5 + dy * 3);
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + dy * 5 + dx * 3, p.y - dx * 5 + dy * 3);
    }
    ctx.stroke();
    ctx.restore();
    ctx.strokeStyle = '#0b3d1f';
    ctx.lineWidth = 1.4;
    ctx.stroke();
    ctx.restore();
  }

  function drawSparkle(s) {
    const tw = 0.5 + 0.5 * Math.sin(t * 0.06 + s.phase);
    const r = s.s * (0.6 + 0.4 * tw);
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.globalAlpha = 0.35 + 0.6 * tw;
    ctx.strokeStyle = '#d9fbe8';
    ctx.shadowColor = '#4ade80';
    ctx.shadowBlur = 8;
    ctx.lineWidth = 1.2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-r, 0); ctx.lineTo(r, 0);
    ctx.moveTo(0, -r); ctx.lineTo(0, r);
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, 1.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    t++;
    drawLeaf2();
    drawLeaf1();
    SPARKS.forEach(drawSparkle);
    window._decoRaf = requestAnimationFrame(draw);
  }

  if (window._decoRaf) cancelAnimationFrame(window._decoRaf);
  draw();
})();
