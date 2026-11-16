"use client";

import { motion, useScroll, useTransform, type Variants } from "motion/react";
import { wedding } from "@/lib/config";
import { EASE, fadeUp } from "./ui";

const write: Variants = {
  hidden: { clipPath: "inset(-40% 110% -40% -10%)", opacity: 0.2 },
  show: {
    clipPath: "inset(-40% -10% -40% -10%)",
    opacity: 1,
    transition: { duration: 1.6, ease: [0.5, 0, 0.2, 1] },
  },
};

const ringText = `${wedding.groom} & ${wedding.bride}  ✦  ${wedding.day} ${wedding.month} ${wedding.year}  ✦  Nikoh to’yi  ✦  `;

export default function Hero({ opened }: { opened: boolean }) {
  const { scrollY } = useScroll();
  const ringY = useTransform(scrollY, [0, 700], [0, 110]);
  const ringRotate = useTransform(scrollY, [0, 700], [0, 50]);
  const fade = useTransform(scrollY, [0, 520], [1, 0]);

  return (
    <section className="hero" id="bosh">
      <div className="blobs" aria-hidden>
        <i />
        <i />
        <i />
      </div>

      <motion.div
        className="hero__in"
        initial="hidden"
        animate={opened ? "show" : "hidden"}
        transition={{ staggerChildren: 0.2, delayChildren: 0.55 }}
        style={{ opacity: fade }}
      >
        <motion.p className="label label--lines" variants={fadeUp}>
          Nikoh to’yi
        </motion.p>

        <div className="seal">
          <motion.div className="seal__ring" style={{ y: ringY, rotate: ringRotate }} aria-hidden>
            <motion.svg
              viewBox="0 0 400 400"
              variants={{
                hidden: { opacity: 0, scale: 0.7, rotate: -40 },
                show: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 1.8, ease: EASE } },
              }}
            >
              <defs>
                <path id="ring-path" d="M200 200m-178 0a178 178 0 1 1 356 0a178 178 0 1 1-356 0" />
              </defs>
              <g className="seal__spin">
                <text>
                  <textPath href="#ring-path" textLength="1105">
                    {ringText}
                  </textPath>
                </text>
              </g>
              <circle cx="200" cy="200" r="152" className="seal__line" />
              <circle cx="200" cy="200" r="196" className="seal__line seal__line--dash" />
            </motion.svg>
          </motion.div>

          <h1 className="names" aria-label={`${wedding.groom} va ${wedding.bride}`}>
            <motion.span className="names__a" variants={write} aria-hidden>
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
            <motion.span className="names__b" variants={write} aria-hidden>
              {wedding.bride}
            </motion.span>
          </h1>
        </div>

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
      </motion.div>
    </section>
  );
}
