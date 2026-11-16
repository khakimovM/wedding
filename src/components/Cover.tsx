"use client";

import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { wedding } from "@/lib/config";
import { HeartIcon } from "./ui";

const KNOB = 58;
const PAD = 5;

/**
 * Muqova. Qulfni o'ngga oxirigacha surganda taklifnoma ochiladi.
 * onUnlock barmoq qo'yib yuborilgan zahoti chaqiriladi (musiqa shu yerda yoqiladi),
 * onOpen esa qulf animatsiyasi tugagach.
 */
export default function Cover({ onUnlock, onOpen }: { onUnlock: () => void; onOpen: () => void }) {
  const track = useRef<HTMLDivElement>(null);
  const maxRef = useRef(220);
  const [max, setMax] = useState(220);
  const [unlocked, setUnlocked] = useState(false);
  const [touched, setTouched] = useState(false);

  const x = useMotionValue(0);
  const fill = useTransform(x, (v) => v + KNOB + PAD * 2);
  const labelOpacity = useTransform(x, (v) => Math.max(0, 1 - v / (maxRef.current * 0.5)));

  useEffect(() => {
    const measure = () => {
      if (!track.current) return;
      const m = track.current.clientWidth - KNOB - PAD * 2;
      maxRef.current = m;
      setMax(m);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const finish = () => {
    if (unlocked) return;
    setUnlocked(true);
    onUnlock();
    animate(x, maxRef.current, { type: "spring", stiffness: 500, damping: 42 });
    window.setTimeout(onOpen, 750);
  };

  return (
    <motion.div
      className="cover"
      exit={{ y: "-103%" }}
      transition={{ duration: 1.15, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="blobs" aria-hidden>
        <i />
        <i />
        <i />
      </div>
      <div className="cover__frame" aria-hidden />

      <motion.div
        className="cover__in"
        animate={unlocked ? { opacity: 0, y: -26, scale: 0.98 } : { opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: unlocked ? 0.2 : 0, ease: "easeInOut" }}
      >
        <p className="label label--lines intro" style={{ animationDelay: "0.15s" }}>
          Nikoh to’yi
        </p>

        <p className="cover__names" aria-label={`${wedding.groom} va ${wedding.bride}`}>
          <span className="intro" style={{ animationDelay: "0.35s" }} aria-hidden>
            {wedding.groom}
          </span>
          <em className="intro" style={{ animationDelay: "0.6s" }} aria-hidden>
            &amp;
          </em>
          <span className="intro" style={{ animationDelay: "0.8s" }} aria-hidden>
            {wedding.bride}
          </span>
        </p>

        <p className="cover__date intro" style={{ animationDelay: "1.05s" }}>
          <span>{wedding.day}</span>
          <span>11</span>
          <span>{wedding.year}</span>
        </p>

        <HeartIcon className="cover__heart intro" />

        <div
          className={`slider intro${unlocked ? " is-open" : ""}${touched ? " is-touched" : ""}`}
          style={{ animationDelay: "1.4s" }}
          ref={track}
        >
          <motion.span className="slider__fill" style={{ width: fill }} />
          <motion.span className="slider__label" style={{ opacity: labelOpacity }}>
            O’ngga suring
          </motion.span>
          <span className="slider__arrows" aria-hidden>
            <i />
            <i />
            <i />
          </span>
          <motion.button
            type="button"
            className="slider__knob"
            aria-label="Taklifnomani ochish. Qulfni o’ngga suring yoki Enter tugmasini bosing"
            style={{ x }}
            drag={unlocked ? false : "x"}
            dragConstraints={{ left: 0, right: max }}
            dragElastic={0.02}
            dragMomentum={false}
            onDragStart={() => setTouched(true)}
            onDragEnd={() => {
              if (x.get() >= maxRef.current * 0.82) finish();
              else {
                animate(x, 0, { type: "spring", stiffness: 420, damping: 30 });
                setTouched(false);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight") {
                e.preventDefault();
                finish();
              }
            }}
          >
            <span className="slider__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
                <rect x="5.5" y="10.5" width="13" height="9.5" rx="2.2" />
                <motion.path
                  initial={false}
                  animate={{ d: unlocked ? "M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0V7.6" : "M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0V10.5" }}
                  transition={{ duration: 0.35 }}
                />
                <path d="M12 14.2v2.2" />
              </svg>
            </span>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
