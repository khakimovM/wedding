"use client";

import { motion, useScroll, useTransform, type Variants } from "motion/react";
import { useRef } from "react";
import { wedding } from "@/lib/config";
import { photos } from "@/lib/photos";
import { PhotoBg } from "./Photo";
import { EASE, fadeUp } from "./ui";

/** Ism chapdan o'ngga, qo'lda yozilgandek ochiladi */
const write: Variants = {
  hidden: { clipPath: "inset(-40% 110% -40% -10%)", opacity: 0.2 },
  show: {
    clipPath: "inset(-40% -10% -40% -10%)",
    opacity: 1,
    transition: { duration: 1.7, ease: [0.5, 0, 0.2, 1] },
  },
};

export default function Hero({ opened }: { opened: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const lift = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);
  const yearY = useTransform(scrollYProgress, [0, 1], ["0%", "55%"]);

  return (
    <section className="hero" id="bosh" ref={ref}>
      {/* Muqova ochilganda rasm yaqindan uzoqlashib, o'z joyiga tushadi */}
      <motion.div
        className="hero__bg"
        initial={false}
        animate={opened ? { scale: 1, opacity: 1 } : { scale: 1.3, opacity: 0.5 }}
        transition={{ duration: 2.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <PhotoBg photo={photos.hero} eager />
      </motion.div>

      {/* Yil raqami avval yorqin ko'rinadi, ismlar yozilgach xiralashib, orqa fonga o'tadi */}
      <motion.span
        className="hero__year"
        style={{ y: yearY }}
        initial={false}
        animate={{ opacity: opened ? [0, 1, 0.34] : 0 }}
        transition={{ duration: 4.4, times: [0, 0.3, 1], delay: 0.3, ease: "easeInOut" }}
        aria-hidden
      >
        {wedding.year}
      </motion.span>
      <div className="hero__shade" aria-hidden />

      <motion.div
        className="hero__in"
        initial="hidden"
        animate={opened ? "show" : "hidden"}
        transition={{ staggerChildren: 0.2, delayChildren: 0.75 }}
        style={{ opacity: fade, y: lift }}
      >
        <div className="hero__top">
          <motion.p className="label label--lines" variants={fadeUp}>
            Nikoh to’yi
          </motion.p>

          <h1 className="names" aria-label={`${wedding.groom} va ${wedding.bride}`}>
            <motion.span className="names__a gold-text" variants={write} aria-hidden>
              {wedding.groom}
            </motion.span>
            <motion.em
              aria-hidden
              variants={{
                hidden: { opacity: 0, scale: 0.4, rotate: -30 },
                show: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 0.9, ease: EASE } },
              }}
            >
              &amp;
            </motion.em>
            <motion.span className="names__b gold-text" variants={write} aria-hidden>
              {wedding.bride}
            </motion.span>
          </h1>
        </div>

        <div className="hero__bottom">
          <motion.div className="lockup" variants={fadeUp}>
            <p>
              {wedding.weekday}
              <strong>kuni</strong>
            </p>
            <p className="lockup__day">
              <strong>{wedding.day}</strong>
              {wedding.month} {wedding.year}
            </p>
            <p>
              soat
              <strong>{wedding.time}</strong>
            </p>
          </motion.div>

          <motion.a className="cue" href="#taklif" variants={fadeUp} aria-label="Pastga o’tish">
            <span />
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
}
