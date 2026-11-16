"use client";

import { useEffect, useRef } from "react";

type Petal = {
  x: number;
  y: number;
  r: number;
  vy: number;
  sway: number;
  phase: number;
  rot: number;
  vr: number;
  color: string;
  dot: boolean;
};

const COLORS = ["#EDC3B6", "#F3D7CD", "#E4C98F", "#D9B978", "#F0DFC0"];

/** Butun sahifa ustida sekin yog'ilib turadigan gul barglari va zar uchqunlari */
export default function Petals() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    let last = performance.now();
    let petals: Petal[] = [];

    const make = (anywhere: boolean): Petal => ({
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : -20,
      r: 4 + Math.random() * 6,
      vy: 14 + Math.random() * 22,
      sway: 12 + Math.random() * 26,
      phase: Math.random() * Math.PI * 2,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 1.2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      dot: Math.random() < 0.35,
    });

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = w < 700 ? 16 : 30;
      petals = Array.from({ length: count }, () => make(true));
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = now / 1000;
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.y += p.vy * dt;
        p.rot += p.vr * dt;
        const x = p.x + Math.sin(t * 0.6 + p.phase) * p.sway;
        if (p.y > h + 20) petals[i] = make(false);
        ctx.save();
        ctx.translate(x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.dot) {
          ctx.globalAlpha = 0.55 + Math.sin(t * 2 + p.phase) * 0.3;
          ctx.beginPath();
          ctx.arc(0, 0, p.r * 0.22, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.globalAlpha = 0.6;
          ctx.scale(1, 0.55 + Math.sin(t * 1.4 + p.phase) * 0.35);
          ctx.beginPath();
          ctx.moveTo(0, -p.r);
          ctx.bezierCurveTo(p.r * 0.9, -p.r * 0.5, p.r * 0.7, p.r * 0.7, 0, p.r);
          ctx.bezierCurveTo(-p.r * 0.7, p.r * 0.7, -p.r * 0.9, -p.r * 0.5, 0, -p.r);
          ctx.fill();
        }
        ctx.restore();
      }
    };

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    resize();
    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} className="petals" aria-hidden />;
}
