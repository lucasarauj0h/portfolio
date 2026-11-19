"use strict";

(() => {
  const canvas = document.querySelector('#brand-energy');
  const source = document.querySelector('.brand-energy-source');
  if (!canvas || !source) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mouse = window.matchMedia('(hover: hover) and (pointer: fine)');
  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0, active: false };
  let width = 0, height = 0, frame = null, previousTime = 0;
  const enabled = () => mouse.matches && !reducedMotion.matches && !document.hidden;
  const schedule = () => { if (frame === null && pointer.active && enabled()) frame = requestAnimationFrame(draw); };

  function stop() {
    pointer.active = false;
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    ctx.clearRect(0, 0, width, height);
  }
  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    schedule();
  }
  function stroke(points, color, lineWidth, blur = 0) {
    ctx.beginPath();
    points.forEach((point, index) => index ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y));
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineJoin = ctx.lineCap = 'round';
    ctx.shadowColor = '#ff315f';
    ctx.shadowBlur = blur;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
  function glow(x, y, radius, alpha) {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `rgba(255,217,230,${alpha})`);
    gradient.addColorStop(.22, `rgba(255,91,132,${alpha * .55})`);
    gradient.addColorStop(1, 'rgba(204,9,47,0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  function draw(time) {
    frame = null;
    if (!pointer.active || !enabled()) return;
    if (time - previousTime < 1000 / 30) { schedule(); return; }
    previousTime = time;
    pointer.x += (pointer.targetX - pointer.x) * .4;
    pointer.y += (pointer.targetY - pointer.y) * .4;
    const rect = source.getBoundingClientRect();
    const origin = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
    const dx = pointer.x - origin.x, dy = pointer.y - origin.y;
    const length = Math.hypot(dx, dy);
    const normal = { x: -dy / (length || 1), y: dx / (length || 1) };
    const amplitude = Math.min(13, length * .025);
    const points = Array.from({ length: 13 }, (_, index) => {
      const progress = index / 12;
      const offset = Math.sin(Math.PI * progress) * amplitude *
        (Math.sin(index * 2.9 + time / 480) + .45 * Math.sin(index * 5.1 - time / 750));
      return { x: origin.x + dx * progress + normal.x * offset,
        y: origin.y + dy * progress + normal.y * offset };
    });
    ctx.clearRect(0, 0, width, height);
    stroke(points, 'rgba(204,9,47,.2)', 9, 20);
    stroke(points, 'rgba(255,74,121,.75)', 2.4, 9);
    stroke(points, 'rgba(255,224,234,.85)', .8);
    // A ramificação e o pulso acompanham a mesma conexão, sem piscar a tela.
    const fork = points[7];
    const tip = { x: origin.x + dx * .88 + normal.x * amplitude * 2.5,
      y: origin.y + dy * .88 + normal.y * amplitude * 2.5 };
    stroke([fork, { x: (fork.x + tip.x) / 2 + normal.x * 6,
      y: (fork.y + tip.y) / 2 + normal.y * 6 }, tip], 'rgba(255,107,147,.3)', .8, 5);
    const pulse = (time % 2600) / 2600;
    const segment = pulse * (points.length - 1);
    const first = Math.floor(segment), weight = segment - first;
    const a = points[first], b = points[Math.min(first + 1, points.length - 1)];
    glow(a.x + (b.x - a.x) * weight, a.y + (b.y - a.y) * weight, 10, .55);
    glow(origin.x, origin.y, 16, .65);
    glow(pointer.x, pointer.y, 9, .6);
    schedule();
  }
  window.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch' || !enabled()) return;
    pointer.targetX = event.clientX;
    pointer.targetY = event.clientY;
    if (!pointer.active) { pointer.x = event.clientX; pointer.y = event.clientY; }
    pointer.active = true;
    schedule();
  }, { passive: true });
  window.addEventListener('pointerout', event => { if (!event.relatedTarget) stop(); });
  window.addEventListener('blur', stop);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  window.addEventListener('resize', resize, { passive: true });
  function updateAvailability() {
    canvas.hidden = !mouse.matches || reducedMotion.matches;
    if (!enabled()) stop();
  }
  mouse.addEventListener('change', updateAvailability);
  reducedMotion.addEventListener('change', updateAvailability);
  resize();
  updateAvailability();
})();
