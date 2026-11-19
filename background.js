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
  let width = 0, height = 0, frame = null, timer = null, burst = null, previousTime = 0;
  const enabled = () => mouse.matches && !reducedMotion.matches && !document.hidden;
  const random = (min, max) => min + Math.random() * (max - min);

  function schedule() {
    if (frame === null && burst && pointer.active && enabled()) frame = requestAnimationFrame(draw);
  }
  function arm(first = false) {
    if (timer !== null || burst || !pointer.active || !enabled()) return;
    timer = setTimeout(() => {
      timer = null;
      if (!pointer.active || !enabled()) return;
      burst = {
        start: performance.now(),
        duration: random(3000, 4200),
        dust: Array.from({ length: 76 }, () => ({
          progress: Math.random(), offset: random(-16, 16), phase: random(0, Math.PI * 2),
          radius: random(.35, 1.1), speed: random(.018, .05), alpha: random(.08, .3)
        }))
      };
      previousTime = 0;
      schedule();
    }, first ? random(4000, 7000) : random(10000, 18000));
  }
  function stop() {
    pointer.active = false;
    if (frame !== null) cancelAnimationFrame(frame);
    if (timer !== null) clearTimeout(timer);
    frame = timer = burst = null;
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
    ctx.shadowColor = '#dc3154';
    ctx.shadowBlur = blur;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
  function glow(x, y, radius, alpha) {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `rgba(248,115,143,${alpha})`);
    gradient.addColorStop(.25, `rgba(218,40,80,${alpha * .45})`);
    gradient.addColorStop(1, 'rgba(204,9,47,0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  function draw(time) {
    frame = null;
    if (!burst || !pointer.active || !enabled()) return;
    const elapsed = time - burst.start;
    if (elapsed >= burst.duration) {
      ctx.clearRect(0, 0, width, height);
      burst = null;
      arm();
      return;
    }
    if (time - previousTime < 1000 / 30) { schedule(); return; }
    previousTime = time;
    const fade = Math.min(1, elapsed / 550, (burst.duration - elapsed) / 1100);
    pointer.x += (pointer.targetX - pointer.x) * .25;
    pointer.y += (pointer.targetY - pointer.y) * .25;
    const rect = source.getBoundingClientRect();
    const origin = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
    const dx = pointer.x - origin.x, dy = pointer.y - origin.y;
    const length = Math.hypot(dx, dy);
    const normal = { x: -dy / (length || 1), y: dx / (length || 1) };
    const amplitude = Math.min(11, length * .022);
    const points = Array.from({ length: 15 }, (_, index) => {
      const progress = index / 14;
      const offset = Math.sin(Math.PI * progress) * amplitude *
        (Math.sin(index * 2.9 + time / 850) + .35 * Math.sin(index * 5.1 - time / 1200));
      return { x: origin.x + dx * progress + normal.x * offset,
        y: origin.y + dy * progress + normal.y * offset };
    });
    ctx.clearRect(0, 0, width, height);
    ctx.globalAlpha = fade;
    stroke(points, 'rgba(204,9,47,.07)', 9, 18);
    stroke(points, 'rgba(229,57,96,.25)', 1.5, 7);
    stroke(points, 'rgba(246,132,157,.3)', .55);
    for (const mote of burst.dust) {
      const progress = (mote.progress + elapsed / 1000 * mote.speed) % 1;
      const segment = progress * (points.length - 1);
      const first = Math.floor(segment), weight = segment - first;
      const a = points[first], b = points[Math.min(first + 1, points.length - 1)];
      const drift = mote.offset + Math.sin(elapsed / 1600 + mote.phase) * 5;
      const x = a.x + (b.x - a.x) * weight + normal.x * drift;
      const y = a.y + (b.y - a.y) * weight + normal.y * drift;
      const alpha = mote.alpha * (.65 + .35 * Math.sin(elapsed / 900 + mote.phase));
      glow(x, y, mote.radius * 4.5, alpha * .3);
      ctx.fillStyle = `rgba(238,96,128,${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, mote.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    glow(origin.x, origin.y, 18, .16);
    glow(pointer.x, pointer.y, 11, .13);
    ctx.globalAlpha = 1;
    schedule();
  }
  window.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch' || !enabled()) return;
    pointer.targetX = event.clientX;
    pointer.targetY = event.clientY;
    if (!pointer.active) { pointer.x = event.clientX; pointer.y = event.clientY; }
    pointer.active = true;
    arm(true);
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
