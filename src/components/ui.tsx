"use client";

import {
  animate,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type Variants,
} from "motion/react";
import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";

export const EASE = [0.22, 0.7, 0.2, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.95, ease: EASE } },
};

export const draw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: { pathLength: 1, opacity: 1, transition: { duration: 1.1, ease: "easeInOut" } },
};

/** Ko'rinish maydoniga kirganda yumshoq paydo bo'ladigan blok */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.95, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Shishasimon qora karta. Hoshiyasi bo'ylab zar nur aylanib yuradi,
 * sichqoncha ostida esa yumshoq yorug'lik dog'i ergashadi.
 */
export function Card({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);

  const spot = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    const box = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - box.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - box.top}px`);
  };

  return (
    <motion.div
      ref={ref}
      className={`card ${className}${inView ? " is-inview" : ""}`}
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1.05, delay, ease: EASE }}
      onPointerMove={spot}
    >
      {children}
    </motion.div>
  );
}

/**
 * Matn yumshoq parda ortidan asta ochiladi: uzun matn tepadan pastga, qisqasi chapdan o'ngga.
 *
 * Matn ataylab BITTA butun bo'lak bo'lib turadi. Avval har bir so'z alohida bo'lakka ajratilgan edi,
 * natijada mehmon brauzeridagi avtomatik tarjimon ayrim so'zlarni o'chirib yuborib, gap ma'nosi
 * buzilib qolardi. Bu yerda matnni so'zlarga bo'lmang.
 */
export function Unveil({ text, className }: { text: string; className?: string }) {
  const long = text.length > 60;
  const [done, setDone] = useState(false);
  const sweep = useMotionValue(0);
  const from = useTransform(sweep, [0, 1], [-45, 105]);
  const to = useTransform(sweep, [0, 1], [-5, 145]);
  const mask = useMotionTemplate`linear-gradient(${long ? 168 : 100}deg, #000 ${from}%, transparent ${to}%)`;

  // Ochilib bo'lgach oddiy, hech qanday niqobsiz matn qoladi
  if (done) return <p className={className}>{text}</p>;

  return (
    <motion.p
      className={className}
      style={{ WebkitMaskImage: mask, maskImage: mask }}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.9, ease: EASE }}
      onViewportEnter={() => {
        animate(sweep, 1, { duration: long ? 2.1 : 1.3, ease: "easeInOut", onComplete: () => setDone(true) });
      }}
    >
      {text}
    </motion.p>
  );
}

/** Ko'ringanda noldan (yoki `from` dan) kerakli songacha sanab chiqadi */
export function CountUp({
  to,
  from = 0,
  pad = 0,
  duration = 1.8,
}: {
  to: number;
  from?: number;
  pad?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const value = useMotionValue(to);
  const text = useTransform(value, (v) => String(Math.round(v)).padStart(pad, "0"));

  useEffect(() => {
    if (!inView || reduce) return;
    value.set(from);
    const controls = animate(value, to, { duration, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [inView, reduce, value, from, to, duration]);

  return <motion.span ref={ref}>{text}</motion.span>;
}

/** Bo'lim sarlavhasi: kichik yorliq, sarlavha va chizilib chiqadigan bezak */
export function Heading({ label, title }: { label: string; title: string }) {
  return (
    <motion.header
      className="heading"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
      transition={{ staggerChildren: 0.14 }}
    >
      <motion.p className="label" variants={fadeUp}>
        {label}
      </motion.p>
      <motion.h2 variants={fadeUp}>{title}</motion.h2>
      <Divider />
    </motion.header>
  );
}

export function Divider() {
  return (
    <motion.span
      className="divider"
      aria-hidden
      variants={{ hidden: {}, show: {} }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 1 }}
    >
      <motion.i
        variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.9, ease: EASE } } }}
        style={{ originX: 1 }}
      />
      <motion.b
        variants={{
          hidden: { scale: 0, rotate: -90 },
          show: { scale: 1, rotate: 45, transition: { duration: 0.7, delay: 0.25, ease: EASE } },
        }}
      />
      <motion.i
        variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.9, ease: EASE } } }}
        style={{ originX: 0 }}
      />
    </motion.span>
  );
}

/** Chiziq bilan chizilib chiqadigan novda */
export function Sprig({ className, flip }: { className?: string; flip?: boolean }) {
  const leaves = [0, 1, 2, 3, 4, 5].map((i) => {
    const y = 198 - i * 31;
    const dir = i % 2 ? 1 : -1;
    return `M40 ${y} c${dir * 6} -14 ${dir * 20} -20 ${dir * 30} -22 c${-dir * 2} 12 ${-dir * 14} 22 ${-dir * 30} 22`;
  });
  return (
    <motion.svg
      viewBox="0 0 80 220"
      className={className}
      style={flip ? { scaleX: -1 } : undefined}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      aria-hidden
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      transition={{ staggerChildren: 0.13 }}
    >
      <motion.path d="M40 218 C38 160 43 90 40 16" variants={draw} />
      {leaves.map((d) => (
        <motion.path key={d} d={d} variants={draw} />
      ))}
      <motion.circle cx="40" cy="11" r="3" variants={draw} />
    </motion.svg>
  );
}

/** Bo'limning qora foni ustida sekin suzib yuradigan zar shu'lalar */
export function Glow() {
  return (
    <div className="glow" aria-hidden>
      <i />
      <i />
    </div>
  );
}

export function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
      <path d="M12 20.5C5.5 15.6 3 12.4 3 8.9 3 6.2 5.1 4 7.8 4c1.7 0 3.2.9 4.2 2.3C13 4.900 14.500 4 16.200 4 18.900 4 21 6.200 21 8.900c0 3.500-2.500 6.700-9 11.600Z" strokeLinejoin="round" />
    </svg>
  );
}
