// TuZhi Codes deco name : "matrix-frame"
(function () {
  const cv = document.getElementById('decoCanvas');
  if (!cv) return;
  const ctx = cv.getContext('2d');

  const W = 150, H = 150, CX = 75, CY = 75, R = 52;

  const GREEN1 = '#00ff41';
  const GREEN2 = '#00c832';
  const GREEN3 = '#007a1f';
  const GLOW = '#00ff41';

  const CHARS = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ'.split('');

  function rndChar() {
    return CHARS[Math.floor(Math.random() * CHARS.length)];
  }

  function rndRange(a, b) {
    return a + Math.random() * (b - a);
  }

  const OUTER_COUNT = 20;
  const outer = Array.from({ length: OUTER_COUNT }, (_, i) => ({
    angle: (i / OUTER_COUNT) * Math.PI * 2,
    orbit: R + 2,
    char: rndChar(),
    timer: Math.floor(Math.random() * 40),
    speed: 18 + Math.floor(Math.random() * 22),
    bright: Math.random() < 0.25,
    alpha: 0.55 + Math.random() * 0.45,
    size: 8 + Math.floor(Math.random() * 4),
  }));

  const INNER_COUNT = 12;
  const inner = Array.from({ length: INNER_COUNT }, (_, i) => ({
    angle: (i / INNER_COUNT) * Math.PI * 2 + (Math.PI / INNER_COUNT),
    orbit: R - 12,
    char: rndChar(),
    timer: Math.floor(Math.random() * 40),
    speed: 28 + Math.floor(Math.random() * 30),
    bright: false,
    alpha: 0.18 + Math.random() * 0.2,
    size: 6 + Math.floor(Math.random() * 3),
  }));

  const accents = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map(a => ({
    angle: a,
    orbit: R + 2,
    char: rndChar(),
    timer: 0,
    speed: 8,
    alpha: 1,
    size: 11,
    accent: true,
  }));

  const ORBITER_COUNT = 6;
  const orbiters = Array.from({ length: ORBITER_COUNT }, (_, i) => ({
    angle: (i / ORBITER_COUNT) * Math.PI * 2,
    orbit: R + 8,
    speed: (i % 2 === 0 ? 1 : -1) * rndRange(0.008, 0.02),
    char: rndChar(),
    timer: 0,
    size: rndRange(6, 8),
    alpha: rndRange(0.5, 0.9),
  }));

  function resetSpore(initial) {
    return {
      x: initial ? CX + rndRange(-R + 6, R - 6) : CX + rndRange(-R * 0.6, R * 0.6),
      y: initial ? CY + rndRange(-R + 6, R - 6) : CY + R * 0.75,
      speed: rndRange(0.25, 0.7),
      drift: rndRange(-0.35, 0.35),
      phase: rndRange(0, Math.PI * 2),
      size: rndRange(0.8, 2),
      alpha: rndRange(0.25, 0.6),
      glyph: Math.random() < 0.35 ? rndChar() : '',
    };
  }

  const SPORE_COUNT = 12;
  const spores = Array.from({ length: SPORE_COUNT }, () => resetSpore(true));

  let t = 0;
  let pulseTimer = 0;
  let pulseRadius = -1;

  function drawChar(x, y, ch, alpha, size, bright, accent) {
    ctx.save();
    ctx.font = `${accent ? 'bold ' : ''}${size}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (accent) {
      ctx.shadowColor = GLOW;
      ctx.shadowBlur = 18;
      ctx.fillStyle = GREEN1;
      ctx.globalAlpha = alpha;
      ctx.fillText(ch, x, y);
      ctx.shadowBlur = 28;
      ctx.globalAlpha = alpha * 0.4;
      ctx.fillText(ch, x, y);
    } else if (bright) {
      ctx.shadowColor = GLOW;
      ctx.shadowBlur = 14;
      ctx.fillStyle = GREEN1;
      ctx.globalAlpha = alpha;
      ctx.fillText(ch, x, y);
    } else {
      ctx.shadowColor = GREEN2;
      ctx.shadowBlur = 5;
      ctx.fillStyle = GREEN3;
      ctx.globalAlpha = alpha;
      ctx.fillText(ch, x, y);
    }

    ctx.restore();
  }

  function drawSpore(s) {
    ctx.save();
    if (s.glyph) {
      ctx.font = '7px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = GLOW;
      ctx.shadowBlur = 8;
      ctx.fillStyle = GREEN2;
      ctx.globalAlpha = s.alpha;
      ctx.fillText(s.glyph, s.x, s.y);
    } else {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = GREEN1;
      ctx.shadowColor = GLOW;
      ctx.shadowBlur = 6;
      ctx.globalAlpha = s.alpha;
      ctx.fill();
    }
    ctx.restore();
  }

  function drawHudRing(radius, dash, reverse, color, alpha) {
    ctx.save();
    ctx.translate(CX, CY);
    ctx.rotate(t * (reverse ? -0.0025 : 0.004));
    ctx.beginPath();
    ctx.setLineDash(dash);
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    t++;

    const aura = ctx.createRadialGradient(CX, CY, R - 14, CX, CY, R + 8);
    aura.addColorStop(0, 'rgba(0,255,65,0)');
    aura.addColorStop(0.55, 'rgba(0,255,65,0.07)');
    aura.addColorStop(1, 'rgba(0,255,65,0)');
    ctx.beginPath();
    ctx.arc(CX, CY, R + 8, 0, Math.PI * 2);
    ctx.fillStyle = aura;
    ctx.fill();

    const inner2 = ctx.createRadialGradient(CX, CY, 0, CX, CY, R - 8);
    inner2.addColorStop(0, 'rgba(0,200,50,0.05)');
    inner2.addColorStop(1, 'rgba(0,200,50,0)');
    ctx.beginPath();
    ctx.arc(CX, CY, R - 8, 0, Math.PI * 2);
    ctx.fillStyle = inner2;
    ctx.fill();

    drawHudRing(R + 10, [5, 9], false, GREEN3, 0.5);
    drawHudRing(R + 14, [2, 7], true, GREEN2, 0.28);

    spores.forEach((s, i) => {
      s.y -= s.speed;
      s.x += s.drift + Math.sin(t * 0.03 + s.phase) * 0.15;
      const dx = s.x - CX, dy = s.y - CY;
      if (s.y < CY - R - 14 || dx * dx + dy * dy > (R + 16) * (R + 16)) {
        spores[i] = resetSpore(false);
        return;
      }
      drawSpore(s);
    });

    pulseTimer++;
    if (pulseTimer >= 170) {
      pulseTimer = 0;
      pulseRadius = R;
      const pick = outer[Math.floor(Math.random() * outer.length)];
      pick.bright = true;
      pick.timer = 0;
    }

    if (pulseRadius >= 0) {
      pulseRadius += 0.9;
      const fade = Math.max(0, 1 - (pulseRadius - R) / 18);
      if (fade <= 0) {
        pulseRadius = -1;
      } else {
        ctx.save();
        ctx.beginPath();
        ctx.arc(CX, CY, pulseRadius, 0, Math.PI * 2);
        ctx.strokeStyle = GREEN1;
        ctx.shadowColor = GLOW;
        ctx.shadowBlur = 12;
        ctx.globalAlpha = fade * 0.6;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      }
    }

    outer.forEach(c => {
      c.timer++;
      if (c.timer >= c.speed) {
        c.char = rndChar();
        c.timer = 0;
        if (Math.random() < 0.15) c.bright = !c.bright;
      }
      const x = CX + Math.cos(c.angle) * c.orbit;
      const y = CY + Math.sin(c.angle) * c.orbit;
      const flicker = c.timer < 2 ? 0.3 : c.alpha;
      drawChar(x, y, c.char, flicker, c.size, c.bright, false);
    });

    inner.forEach(c => {
      c.timer++;
      if (c.timer >= c.speed) { c.char = rndChar(); c.timer = 0; }
      const x = CX + Math.cos(c.angle) * c.orbit;
      const y = CY + Math.sin(c.angle) * c.orbit;
      drawChar(x, y, c.char, c.alpha, c.size, false, false);
    });

    orbiters.forEach(o => {
      o.angle += o.speed;
      o.timer++;
      if (o.timer >= 24) { o.char = rndChar(); o.timer = 0; }
      const x = CX + Math.cos(o.angle) * o.orbit;
      const y = CY + Math.sin(o.angle) * o.orbit;
      drawChar(x, y, o.char, o.alpha, o.size, true, false);
    });

    accents.forEach(c => {
      c.timer++;
      if (c.timer >= c.speed) { c.char = rndChar(); c.timer = 0; }
      const x = CX + Math.cos(c.angle) * c.orbit;
      const y = CY + Math.sin(c.angle) * c.orbit;
      const flicker = c.timer < 2 ? 0.5 : 1;
      drawChar(x, y, c.char, flicker, c.size, true, true);
    });

    window._decoRaf = requestAnimationFrame(draw);
  }

  if (window._decoRaf) cancelAnimationFrame(window._decoRaf);
  draw();
})();
