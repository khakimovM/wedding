"use client";

import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { wedding } from "@/lib/config";
import { photos } from "@/lib/photos";
import { Picture } from "./Photo";
import { HeartIcon } from "./ui";

const KNOB = 56;
const PAD = 4;
/** Qulf ochilgach eshiklar surila boshlaguncha o'tadigan vaqt (ms) */
const UNLOCK_MS = 950;
/** Eshiklarning ochilish davomiyligi (s) */
const DOOR_S = 1.6;

type Phase = "idle" | "unlocked" | "open";

/**
 * Muqova. Qulfni o'ngga oxirigacha surganda o'rtadan nur chiqib,
 * rasm ikki tavaqali eshikdek ochiladi.
 *   onUnlock  barmoq qo'yib yuborilgan zahoti (musiqa shu yerda yoqiladi)
 *   onOpen    eshiklar ochila boshlaganda
 *   onGone    eshiklar to'liq ochilib bo'lgach
 */
export default function Cover({
  onUnlock,
  onOpen,
  onGone,
}: {
  onUnlock: () => void;
  onOpen: () => void;
  onGone: () => void;
}) {
  const track = useRef<HTMLDivElement>(null);
  const maxRef = useRef(220);
  const timers = useRef<number[]>([]);
  const [max, setMax] = useState(220);
  const [phase, setPhase] = useState<Phase>("idle");
  const [touched, setTouched] = useState(false);

  const x = useMotionValue(0);
  const fill = useTransform(x, (v) => v + KNOB + PAD * 2);
  const labelOpacity = useTransform(x, (v) => Math.max(0, 1 - v / (maxRef.current * 0.5)));

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      const m = el.clientWidth - KNOB - PAD * 2;
      maxRef.current = m;
      setMax(m);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach((id) => window.clearTimeout(id));
  }, []);

  const finish = () => {
    if (phase !== "idle") return;
    setPhase("unlocked");
    onUnlock();
    animate(x, maxRef.current, { type: "spring", stiffness: 500, damping: 42 });
    timers.current.push(
      window.setTimeout(() => {
        setPhase("open");
        onOpen();
      }, UNLOCK_MS),
      window.setTimeout(onGone, UNLOCK_MS + DOOR_S * 1000 + 150),
    );
  };

  const unlocked = phase !== "idle";

  return (
    <div className={`cover is-${phase}`}>
      {(["l", "r"] as const).map((side) => (
        <motion.div
          key={side}
          className={`cover__door cover__door--${side}`}
          initial={false}
          animate={{ x: phase === "open" ? (side === "l" ? "-51%" : "51%") : "0%" }}
          transition={{ duration: DOOR_S, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden
        >
          <div className="cover__bg">
            <Picture photo={photos.cover} eager />
          </div>
          <div className="cover__veil" />
          <div className="cover__frame" />
        </motion.div>
      ))}
      <span className="cover__seam" aria-hidden />

      <motion.div
        className="cover__in"
        initial={false}
        animate={
          unlocked
            ? { opacity: 0, y: -28, scale: 0.97 }
            : { opacity: 1, y: 0, scale: 1 }
        }
        transition={{ duration: 0.7, delay: unlocked ? 0.15 : 0, ease: "easeInOut" }}
      >
        <p className="label label--lines intro" style={{ animationDelay: "0.2s" }}>
          Nikoh to’yi
        </p>

        <p className="cover__names" aria-label={`${wedding.groom} va ${wedding.bride}`}>
          <span className="gold-text" style={{ animationDelay: "0.4s" }} aria-hidden>
            {wedding.groom}
          </span>
          <em className="intro" style={{ animationDelay: "0.65s" }} aria-hidden>
            &amp;
          </em>
          <span className="gold-text" style={{ animationDelay: "0.85s" }} aria-hidden>
            {wedding.bride}
          </span>
        </p>

        <p className="datebar intro" style={{ animationDelay: "1.1s" }}>
          <span>{wedding.day}</span>
          <span>{wedding.monthNumber}</span>
          <span>{wedding.year}</span>
        </p>

        <p className="cover__note intro" style={{ animationDelay: "1.25s" }}>
          Sizni to’yimizga lutfan taklif etamiz
        </p>

        <HeartIcon className="cover__heart" />

        <div
          className={`slider intro${unlocked ? " is-open" : ""}${touched ? " is-touched" : ""}`}
          style={{ animationDelay: "1.6s" }}
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
    </div>
  );
}
