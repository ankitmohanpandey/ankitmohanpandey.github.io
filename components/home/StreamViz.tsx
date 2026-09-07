'use client';

import { useEffect, useRef } from 'react';

/**
 * A live simulation of event-time windowing: records stream in, get bucketed
 * into a tumbling window, the window closes on the watermark and emits an
 * aggregate, and late arrivals get routed to a dead letter queue.
 *
 * It is decorative, but it is not decoration for its own sake — it is the
 * exact topology described in the copy next to it. Everything is drawn on one
 * canvas so React never re-renders during the animation.
 */

const WINDOW_MS = 4200;
const SPAWN_MIN_MS = 90;
const SPAWN_MAX_MS = 220;
const LATE_CHANCE = 0.07;
const HISTORY = 6;

const COLORS = {
  line: '#1c2430',
  lineStrong: '#2b3543',
  dim: '#6b7789',
  muted: '#98a3b5',
  fg: '#e4e9f1',
  signal: '#4ade80',
  flow: '#56a8ff',
  late: '#f0a63a',
};

interface Particle {
  progress: number;
  speed: number;
  value: number;
  late: boolean;
  offset: number;
  counted: boolean;
}

interface ClosedWindow {
  count: number;
  age: number;
}

export function StreamViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let frame = 0;
    let lastTime = performance.now();
    let spawnIn = 0;
    let windowElapsed = 0;

    const particles: Particle[] = [];
    const history: ClosedWindow[] = [];
    let liveCount = 0;
    let dlqCount = 0;
    let emitted = 0;
    let flash = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
      context.beginPath();
      context.roundRect(x, y, w, h, r);
    };

    const draw = (now: number) => {
      const delta = Math.min(now - lastTime, 64);
      lastTime = now;

      const padX = 18;
      const laneY = height * 0.42;
      const dlqY = height * 0.78;
      const gateX = width * 0.52;
      const boxX = gateX + 14;
      const boxW = Math.max(72, width * 0.14);
      const histX = boxX + boxW + 18;
      const histW = width - padX - histX;

      context.clearRect(0, 0, width, height);

      // --- spawn ---------------------------------------------------------
      spawnIn -= delta;
      if (spawnIn <= 0) {
        spawnIn = SPAWN_MIN_MS + Math.random() * (SPAWN_MAX_MS - SPAWN_MIN_MS);
        particles.push({
          progress: 0,
          speed: 0.00042 + Math.random() * 0.00028,
          value: Math.random(),
          late: Math.random() < LATE_CHANCE,
          offset: (Math.random() - 0.5) * 22,
          counted: false,
        });
      }

      // --- window clock --------------------------------------------------
      windowElapsed += delta;
      if (windowElapsed >= WINDOW_MS) {
        windowElapsed -= WINDOW_MS;
        history.unshift({ count: liveCount, age: 0 });
        if (history.length > HISTORY) history.pop();
        emitted += 1;
        flash = 1;
        liveCount = 0;
      }
      const windowProgress = windowElapsed / WINDOW_MS;
      flash = Math.max(0, flash - delta / 420);

      // --- lane rails ----------------------------------------------------
      context.strokeStyle = COLORS.line;
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(padX, laneY);
      context.lineTo(gateX, laneY);
      context.stroke();

      context.setLineDash([3, 5]);
      context.beginPath();
      context.moveTo(padX + 40, dlqY);
      context.lineTo(gateX, dlqY);
      context.stroke();
      context.setLineDash([]);

      // --- watermark sweep ----------------------------------------------
      const wmX = padX + (gateX - padX) * windowProgress;
      context.strokeStyle = 'rgba(86,168,255,0.5)';
      context.setLineDash([2, 4]);
      context.beginPath();
      context.moveTo(wmX, laneY - 30);
      context.lineTo(wmX, dlqY + 14);
      context.stroke();
      context.setLineDash([]);
      context.fillStyle = 'rgba(86,168,255,0.75)';
      context.font = '9px ui-monospace, monospace';
      context.fillText('watermark', wmX + 4, laneY - 34);

      // --- particles ------------------------------------------------------
      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const particle = particles[i];
        particle.progress += particle.speed * delta;

        if (particle.progress >= 1) {
          if (particle.late) dlqCount += 1;
          particles.splice(i, 1);
          continue;
        }

        const y = particle.late ? dlqY : laneY + particle.offset * (1 - particle.progress);
        const x = padX + (gateX - padX) * particle.progress;

        if (!particle.counted && particle.progress > 0.97) {
          particle.counted = true;
          if (!particle.late) liveCount += 1;
        }

        const color = particle.late ? COLORS.late : COLORS.signal;
        const radius = particle.late ? 2 : 1.8 + particle.value * 1.4;

        // trail
        const trail = context.createLinearGradient(x - 16, 0, x, 0);
        trail.addColorStop(0, 'rgba(0,0,0,0)');
        trail.addColorStop(1, color);
        context.strokeStyle = trail;
        context.globalAlpha = 0.35;
        context.lineWidth = radius;
        context.beginPath();
        context.moveTo(x - 16, y);
        context.lineTo(x, y);
        context.stroke();
        context.globalAlpha = 1;

        context.fillStyle = color;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
      }

      // --- window box -----------------------------------------------------
      const boxY = laneY - 34;
      const boxH = 68;

      context.strokeStyle = flash > 0 ? COLORS.signal : COLORS.lineStrong;
      context.globalAlpha = flash > 0 ? 0.4 + flash * 0.6 : 1;
      roundRect(boxX, boxY, boxW, boxH, 8);
      context.stroke();
      context.globalAlpha = 1;

      // fill meter for elapsed window time
      context.fillStyle = 'rgba(74,222,128,0.10)';
      roundRect(boxX, boxY + boxH - boxH * windowProgress, boxW, boxH * windowProgress, 8);
      context.fill();

      context.fillStyle = COLORS.dim;
      context.font = '9px ui-monospace, monospace';
      context.fillText('tumbling 10s', boxX + 8, boxY + 15);

      context.fillStyle = COLORS.fg;
      context.font = '600 22px ui-monospace, monospace';
      context.fillText(String(liveCount).padStart(2, '0'), boxX + 8, boxY + 42);

      context.fillStyle = COLORS.dim;
      context.font = '9px ui-monospace, monospace';
      context.fillText('events', boxX + 8, boxY + 56);

      // --- emitted history bars -------------------------------------------
      if (histW > 40) {
        const slot = histW / HISTORY;
        const maxCount = Math.max(8, ...history.map((item) => item.count));
        const baseY = laneY + 34;

        context.fillStyle = COLORS.dim;
        context.font = '9px ui-monospace, monospace';
        context.fillText('emitted aggregates', histX, boxY + 15);

        history.forEach((item, index) => {
          item.age += delta;
          const barH = Math.max(3, (item.count / maxCount) * 44);
          const x = histX + index * slot;
          const appear = Math.min(1, item.age / 260);

          context.globalAlpha = 0.25 + (1 - index / HISTORY) * 0.75;
          context.fillStyle = index === 0 ? COLORS.signal : COLORS.flow;
          roundRect(x, baseY - barH * appear, Math.max(4, slot - 8), barH * appear, 2);
          context.fill();
          context.globalAlpha = 1;
        });
      }

      // --- dlq sink ---------------------------------------------------------
      context.strokeStyle = COLORS.line;
      roundRect(boxX, dlqY - 12, boxW, 24, 6);
      context.stroke();
      context.fillStyle = dlqCount > 0 ? COLORS.late : COLORS.dim;
      context.font = '9px ui-monospace, monospace';
      context.fillText(`dlq · ${dlqCount}`, boxX + 8, dlqY + 3);

      // --- labels ------------------------------------------------------------
      context.fillStyle = COLORS.dim;
      context.font = '9px ui-monospace, monospace';
      context.fillText('source', padX, laneY - 12);
      context.fillText('late', padX, dlqY - 8);
      context.fillText(`sink · ${emitted}`, histX, laneY + 50);

      if (!reduceMotion) frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      role="presentation"
      className="h-[210px] w-full"
    />
  );
}
