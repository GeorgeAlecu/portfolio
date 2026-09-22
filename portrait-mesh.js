// Decorative wind/water mesh. The portrait itself stays still.
(() => {
  const panel = document.querySelector('.portrait');
  if (!panel) return;
  const canvas = document.createElement('canvas');
  canvas.className = 'portrait-mesh';
  canvas.setAttribute('aria-hidden', 'true');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  panel.prepend(canvas);
  panel.classList.add('has-mesh');

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let width = 0, height = 0, frame = 0, visible = false;
  let time = 0, previousTime = 0;
  const pointer = { x: 0, y: 0, active: false, strength: 0 };

  function point(x, y) {
    if (reducedMotion.matches) return [x, y];
    const edge = Math.max(0, Math.sin(Math.PI * x / width) * Math.sin(Math.PI * y / height));
    const distance = Math.hypot(x - pointer.x, y - pointer.y);
    const ripple = Math.exp(-distance * distance / 22000) * pointer.strength;
    return [
      x + edge * (7 * Math.sin(y / 75 + time) + 3 * Math.sin(x / 95 - time * .7) + ripple * Math.sin(distance / 28 - time * 3)),
      y + edge * (6 * Math.sin(x / 85 + time * .85) + 3 * Math.cos(y / 70 + time * .6) + ripple * Math.cos(distance / 28 - time * 3)),
    ];
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = 'rgba(103, 149, 215, 0.22)';
    ctx.lineWidth = .7;
    ctx.beginPath();
    for (let x = 0; x <= width; x += 32) {
      for (let y = 0; y <= height + 6; y += 6) {
        const p = point(x, Math.min(y, height));
        if (y === 0) ctx.moveTo(...p); else ctx.lineTo(...p);
      }
    }
    for (let y = 0; y <= height; y += 32) {
      for (let x = 0; x <= width + 6; x += 6) {
        const p = point(Math.min(x, width), y);
        if (x === 0) ctx.moveTo(...p); else ctx.lineTo(...p);
      }
    }
    ctx.stroke();
  }

  function animate(now) {
    time += previousTime ? Math.min((now - previousTime) / 1000, .05) * .65 : 0;
    previousTime = now;
    pointer.strength += ((pointer.active ? 12 : 0) - pointer.strength) * .06;
    draw();
    frame = requestAnimationFrame(animate);
  }

  function update() {
    cancelAnimationFrame(frame);
    previousTime = 0;
    draw();
    if (visible && !document.hidden && !reducedMotion.matches) frame = requestAnimationFrame(animate);
  }

  new ResizeObserver(() => {
    width = panel.clientWidth;
    height = panel.clientHeight;
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    update();
  }).observe(panel);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    update();
  }).observe(panel);
  panel.addEventListener('pointermove', event => {
    const bounds = panel.getBoundingClientRect();
    pointer.x = event.clientX - bounds.left;
    pointer.y = event.clientY - bounds.top;
    pointer.active = true;
  }, { passive: true });
  for (const event of ['pointerleave', 'pointercancel', 'pointerup']) {
    panel.addEventListener(event, () => { pointer.active = false; }, { passive: true });
  }
  document.addEventListener('visibilitychange', update);
  reducedMotion.addEventListener('change', update);
})();
