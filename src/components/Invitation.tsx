"use client";

import { AnimatePresence, motion, MotionConfig, useScroll, useSpring } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { wedding } from "@/lib/config";
import Cover from "./Cover";
import Gifts from "./Gifts";
import Hero from "./Hero";
import Petals from "./Petals";
import Rsvp from "./Rsvp";
import { Closing, DateSection, Letter, Marquee, Program, Venue } from "./Sections";

export default function Invitation() {
  const [opened, setOpened] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [hasMusic, setHasMusic] = useState(true);
  const audio = useRef<HTMLAudioElement>(null);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });

  // Muqova yopiq turganda sahifa aylantirilmaydi
  useEffect(() => {
    document.documentElement.classList.toggle("is-locked", !opened);
    return () => document.documentElement.classList.remove("is-locked");
  }, [opened]);

  const play = useCallback(() => {
    const el = audio.current;
    if (!el) return;
    el.volume = 0.6;
    el.play().catch(() => setPlaying(false));
  }, []);

  const toggleMusic = () => {
    const el = audio.current;
    if (!el) return;
    if (el.paused) play();
    else el.pause();
  };

  return (
    <MotionConfig reducedMotion="user">
      <audio
        ref={audio}
        src={wedding.music}
        loop
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setHasMusic(false)}
      />

      <AnimatePresence>
        {!opened && (
          <Cover
            key="cover"
            onUnlock={play}
            onOpen={() => {
              window.scrollTo(0, 0);
              setOpened(true);
            }}
          />
        )}
      </AnimatePresence>

      <Petals />
      <motion.span className="progress" style={{ scaleX: progress }} aria-hidden />

      {opened && hasMusic && (
        <motion.button
          type="button"
          className={`music${playing ? " is-playing" : ""}`}
          onClick={toggleMusic}
          aria-label={playing ? "Musiqani to’xtatish" : "Musiqani yoqish"}
          aria-pressed={playing}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 18 }}
        >
          <i />
          <i />
          <i />
          <i />
        </motion.button>
      )}

      <main>
        <Hero opened={opened} />
        <Letter />
        <Marquee />
        <DateSection />
        <Program />
        <Venue />
        <Rsvp />
        <Gifts />
      </main>
      <Closing />
    </MotionConfig>
  );
}
