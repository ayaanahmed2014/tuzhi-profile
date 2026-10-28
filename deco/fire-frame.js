// TuZhi Codes deco name : "fire-frame"
(function () {
  const cv = document.getElementById('decoCanvas');
  if (!cv) return;
  const ctx = cv.getContext('2d');

  const W = 150, H = 150, CX = 75, CY = 75, R = 52;

  const RED = '#ff3b00';
  const ORANGE = '#ff8c1a';
  const GOLD = '#ffd166';

  const TONGUE_COUNT = 14;
  const tongues = Array.from({ length: TONGUE_COUNT }, (_, i) => ({
    seed: (i / TONGUE_COUNT) * Math.PI * 2,
    wobble: Math.random() * Math.PI * 2,
    width: 0.30 + Math.random() * 0.10,
    boost: 0.8 + Math.random() * 0.45,
  }));

  function resetSpark(initial) {
    const a = Math.random() * Math.PI * 2;
    const rr = R - 4 + Math.random() * 10;
    return {
      x: initial ? CX + (Math.random() - 0.5) * 110 : CX + Math.cos(a) * rr,
      y: initial ? CY + (Math.random() - 0.5) * 110 : CY + Math.sin(a) * rr,
      speed: 0.4 + Math.random() * 0.9,
      drift: (Math.random() - 0.5) * 0.6,
      size: 0.8 + Math.random() * 1.8,
      life: 0,
      maxLife: 50 + Math.random() * 70,
      streak: Math.random() < 0.4,
    };
  }

  const SPARK_COUNT = 18;
  const sparks = Array.from({ length: SPARK_COUNT }, () => resetSpark(true));

  const SMOKE_COUNT = 5;
  const smokes = Array.from({ length: SMOKE_COUNT }, (_, i) => ({
    x: CX + (Math.random() - 0.5) * 70,
    y: CY + 10 + Math.random() * 40,
    r: 8 + Math.random() * 8,
    speed: 0.15 + Math.random() * 0.2,
    alpha: 0.05 + Math.random() * 0.06,
    phase: i * 1.3,
  }));

  let t = 0;
  let flareStart = -1000;

  function flamePath(bx, by, tx, ty, wdt, lean) {
    const mx = (bx + tx) / 2 + lean;
    const my = (by + ty) / 2;
    ctx.beginPath();
    ctx.moveTo(bx - wdt, by + 3);
    ctx.quadraticCurveTo(mx - wdt * 0.4, my, tx, ty);
    ctx.quadraticCurveTo(mx + wdt * 0.4, my, bx + wdt, by + 3);
    ctx.quadraticCurveTo(bx, by - 2, bx - wdt, by + 3);
    ctx.closePath();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    t++;

    if (t - flareStart > 240 && Math.random() < 0.006) flareStart = t;
    const flareAge = t - flareStart;
    const flare = flareAge < 45 ? Math.sin((flareAge / 45) * Math.PI) : 0;

    const breathe = 0.5 + 0.5 * Math.sin(t * 0.03);
    const aura = ctx.createRadialGradient(CX, CY, R - 20, CX, CY, R + 14);
    aura.addColorStop(0, 'rgba(255,80,0,0)');
    aura.addColorStop(0.65, `rgba(255,70,0,${0.16 + breathe * 0.08 + flare * 0.12})`);
    aura.addColorStop(1, 'rgba(255,40,0,0)');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(CX, CY, R + 14, 0, Math.PI * 2);
    ctx.fill();

    smokes.forEach(s => {
      s.y -= s.speed;
      s.x += Math.sin(t * 0.02 + s.phase) * 0.2;
      s.r += 0.03;
      if (s.y < -12) {
        s.y = CY + 20 + Math.random() * 30;
        s.x = CX + (Math.random() - 0.5) * 70;
        s.r = 8 + Math.random() * 8;
      }
      const sg = ctx.createRadialGradient(s.x, s.y, 1, s.x, s.y, s.r);
      sg.addColorStop(0, `rgba(120,90,110,${s.alpha})`);
      sg.addColorStop(1, 'rgba(120,90,110,0)');
      ctx.fillStyle = sg;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    tongues.forEach(f => {
      const ang = f.seed + t * 0.008 + Math.sin(t * 0.03 + f.wobble) * 0.05;
      const dx = Math.cos(ang), dy = Math.sin(ang);
      const len = (13 + 5 * Math.sin(t * 0.09 + f.wobble * 2) + 3 * Math.sin(t * 0.23 + f.wobble * 5)) * f.boost * (1 + flare * 0.45);
      const bx = CX + dx * (R - 5), by = CY + dy * (R - 5);
      const tx = CX + dx * (R - 5 + len), ty = CY + dy * (R - 5 + len);
      const lean = Math.cos(t * 0.05 + f.wobble * 3) * 4;
      const wdt = f.width * 9;

      flamePath(bx, by, tx, ty, wdt, lean);
      ctx.fillStyle = 'rgba(200,30,0,0.55)';
      ctx.fill();

      flamePath(bx, by, CX + dx * (R - 5 + len * 0.72), CY + dy * (R - 5 + len * 0.72), wdt * 0.66, lean * 0.7);
      ctx.fillStyle = 'rgba(255,110,10,0.6)';
      ctx.fill();

      flamePath(bx, by, CX + dx * (R - 5 + len * 0.45), CY + dy * (R - 5 + len * 0.45), wdt * 0.38, lean * 0.45);
      ctx.fillStyle = 'rgba(255,220,120,0.75)';
      ctx.fill();
    });

    const ringPulse = 0.35 + breathe * 0.25 + flare * 0.4;
    ctx.strokeStyle = `rgba(255,140,26,${ringPulse})`;
    ctx.lineWidth = 1.4;
    ctx.shadowColor = ORANGE;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(CX, CY, R + 1, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.restore();

    sparks.forEach((s, i) => {
      s.life++;
      s.y -= s.speed * (1 + flare * 0.8);
      s.x += s.drift + Math.sin(t * 0.06 + s.size * 7) * 0.25;
      s.speed += 0.004;
      const fade = 1 - s.life / s.maxLife;
      const dx = s.x - CX, dy = s.y - CY;
      if (s.life > s.maxLife || s.y < -6 || dx * dx + dy * dy > 74 * 74) {
        sparks[i] = resetSpark(false);
        return;
      }
      const heat = Math.max(0, fade);
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      if (s.streak) {
        ctx.strokeStyle = `rgba(255,150,40,${0.7 * heat})`;
        ctx.lineWidth = s.size * 0.8;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.drift * 4, s.y + 4 + s.speed * 3);
        ctx.stroke();
      } else {
        ctx.globalAlpha = heat;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = heat > 0.6 ? GOLD : ORANGE;
        ctx.shadowColor = RED;
        ctx.shadowBlur = 8;
        ctx.fill();
      }
      ctx.restore();
    });
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';

    const coreGlow = ctx.createRadialGradient(CX, CY, R - 22, CX, CY, R - 6);
    coreGlow.addColorStop(0, 'rgba(255,120,20,0.05)');
    coreGlow.addColorStop(1, 'rgba(255,120,20,0)');
    ctx.fillStyle = coreGlow;
    ctx.beginPath();
    ctx.arc(CX, CY, R - 6, 0, Math.PI * 2);
    ctx.fill();

    window._decoRaf = requestAnimationFrame(draw);
  }

  if (window._decoRaf) cancelAnimationFrame(window._decoRaf);
  draw();
})();
