"use client";

import { useEffect, useRef } from "react";

type Mote = {
  x: number;
  y: number;
  size: number;
  vy: number;
  sway: number;
  phase: number;
  speed: number;
  alpha: number;
  bokeh: boolean;
};

/** Butun sahifa ustida sekin ko'tarilib, miltillab turadigan zar uchqunlari */
export default function Dust() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Bitta yumshoq nur dog'i oldindan chiziladi, keyin faqat ko'chirib qo'yiladi
    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = 64;
    const sctx = sprite.getContext("2d");
    if (!sctx) return;
    const glow = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    glow.addColorStop(0, "rgba(255, 244, 214, 1)");
    glow.addColorStop(0.22, "rgba(233, 205, 150, 0.75)");
    glow.addColorStop(0.55, "rgba(201, 169, 110, 0.18)");
    glow.addColorStop(1, "rgba(201, 169, 110, 0)");
    sctx.fillStyle = glow;
    sctx.fillRect(0, 0, 64, 64);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    let last = performance.now();
    let motes: Mote[] = [];

    const make = (anywhere: boolean): Mote => {
      const bokeh = Math.random() < 0.14;
      return {
        x: Math.random() * w,
        y: anywhere ? Math.random() * h : h + 30,
        size: bokeh ? 46 + Math.random() * 70 : 5 + Math.random() * 11,
        vy: bokeh ? 4 + Math.random() * 7 : 8 + Math.random() * 20,
        sway: 10 + Math.random() * 28,
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 1.6,
        alpha: bokeh ? 0.05 + Math.random() * 0.06 : 0.35 + Math.random() * 0.5,
        bokeh,
      };
    };

    const resize = () => {
      // Telefonda manzil satri yashirilganda faqat balandlik o'zgaradi: uchqunlar joyida qoladi
      const widthChanged = window.innerWidth !== w;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (widthChanged) {
        const count = w < 700 ? 30 : 56;
        motes = Array.from({ length: count }, () => make(true));
      }
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = now / 1000;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < motes.length; i++) {
        const m = motes[i];
        m.y -= m.vy * dt;
        if (m.y < -m.size) {
          motes[i] = make(false);
          continue;
        }
        const x = m.x + Math.sin(t * 0.35 * m.speed + m.phase) * m.sway;
        const twinkle = m.bokeh ? 1 : 0.45 + 0.55 * Math.sin(t * m.speed * 1.7 + m.phase);
        ctx.globalAlpha = Math.max(0, m.alpha * twinkle);
        ctx.drawImage(sprite, x - m.size / 2, m.y - m.size / 2, m.size, m.size);
      }
      ctx.globalAlpha = 1;
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

  return <canvas ref={ref} className="dust" aria-hidden />;
}
