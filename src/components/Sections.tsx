"use client";

import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { wedding, type ProgramIcon } from "@/lib/config";
import { photos } from "@/lib/photos";
import { PhotoBg } from "./Photo";
import { Card, CountUp, draw, EASE, Glow, Heading, HeartIcon, Reveal, Sprig, Words } from "./ui";

/* ---------------- Taklif matni ---------------- */

export function Letter() {
  return (
    <section className="section section--photo letter" id="taklif">
      <PhotoBg photo={photos.letter} className="photo--dim" />
      <div className="wrap">
        <Heading label="Taklifnoma" title="Aziz mehmonimiz!" />
        <Words
          className="letter__text"
          text="Hayotimizdagi eng quvonchli kunni yaqinlarimiz davrasida nishonlamoqchimiz. Sizni oila a’zolaringiz bilan birga nikoh to’yimizga bag’ishlangan tantanali bazmga taklif etamiz."
        />
        <Words className="letter__text letter__text--soft" text="Tashrifingiz biz uchun eng katta sovg’a bo’ladi." />
        <Reveal className="letter__sign" delay={0.2}>
          <span className="gold-text">
            {wedding.groom} <em>&amp;</em> {wedding.bride}
          </span>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Yuguruvchi yozuv ---------------- */

const wrap = (min: number, max: number, value: number) => {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
};

/** Sahifa qanchalik tez aylantirilsa, yozuv shunchalik tez yuguradi va yo'nalishini o'zgartiradi */
export function Marquee() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const reduce = useReducedMotion();
  const direction = useRef(-1);

  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const skewX = useTransform(velocity, [-3000, 0, 3000], [7, 0, -7]);
  const offset = useMotionValue(0);
  const x = useTransform(offset, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (!inView || reduce) return;
    const v = velocity.get();
    if (v < -40) direction.current = 1;
    else if (v > 40) direction.current = -1;
    const boost = Math.min(Math.abs(v) / 260, 9);
    offset.set(offset.get() + direction.current * (1.3 + boost) * (delta / 1000));
  });

  const item = (
    <span>
      {wedding.groom} &amp; {wedding.bride} <i>✦</i> {wedding.day}.{wedding.monthNumber}.{wedding.year} <i>✦</i>
    </span>
  );
  return (
    <div className="marquee" ref={ref} aria-hidden>
      <motion.div className="marquee__track" style={{ x, skewX }}>
        {item}
        {item}
        {item}
        {item}
        {item}
        {item}
      </motion.div>
    </div>
  );
}

/* ---------------- Sana, sanoq va taqvim ---------------- */

function Roll({ value }: { value: string }) {
  return (
    <span className="roll">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: "70%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-70%", opacity: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

type Left = { d: string; h: string; m: string; s: string } | "done" | null;

function Countdown() {
  const [left, setLeft] = useState<Left>(null);

  useEffect(() => {
    const target = new Date(wedding.dateISO).getTime();
    const pad = (n: number) => String(n).padStart(2, "0");
    const tick = () => {
      const s = Math.floor((target - Date.now()) / 1000);
      if (s <= 0) return setLeft("done");
      setLeft({
        d: String(Math.floor(s / 86400)),
        h: pad(Math.floor((s % 86400) / 3600)),
        m: pad(Math.floor((s % 3600) / 60)),
        s: pad(s % 60),
      });
    };
    const first = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 1000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, []);

  if (left === "done") return <p className="count__done">Bugun to’y kuni. Xush kelibsiz!</p>;

  const cells: [string, string][] = [
    [left?.d ?? "–", "kun"],
    [left?.h ?? "––", "soat"],
    [left?.m ?? "––", "daqiqa"],
    [left?.s ?? "––", "soniya"],
  ];
  return (
    <div className="count" role="timer" aria-label="To’ygacha qolgan vaqt">
      {cells.map(([value, unit]) => (
        <div key={unit}>
          <b>
            <Roll value={value} />
          </b>
          <span>{unit}</span>
        </div>
      ))}
    </div>
  );
}

function Calendar() {
  // Noyabr 2026: 1-sana yakshanba, hafta dushanbadan boshlanadi
  const lead = (new Date(2026, 10, 1).getDay() + 6) % 7;
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  return (
    <div className="cal">
      <p className="cal__title">
        {wedding.monthTitle} {wedding.year}
      </p>
      <div className="cal__grid" aria-label={`${wedding.year}-yil ${wedding.month} taqvimi, ${wedding.day}-sana belgilangan`}>
        {["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"].map((w) => (
          <span key={w} className="cal__wd">
            {w}
          </span>
        ))}
        {Array.from({ length: lead }, (_, i) => (
          <span key={`e${i}`} />
        ))}
        {days.map((d) =>
          String(d) === wedding.day ? (
            <motion.span
              key={d}
              className="cal__d cal__d--on"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 1 }}
            >
              <svg viewBox="0 0 48 48" aria-hidden>
                <motion.path
                  d="M24 40C13 32 8 26.500 8 20.300 8 15.600 11.700 12 16.200 12c3 0 5.800 1.600 7.800 4.400C26 13.600 28.800 12 31.800 12 36.300 12 40 15.600 40 20.300 40 26.500 35 32 24 40Z"
                  variants={{
                    hidden: { pathLength: 0, opacity: 0 },
                    show: { pathLength: 1, opacity: 1, transition: { duration: 1.4, delay: 0.3, ease: "easeInOut" } },
                  }}
                />
              </svg>
              {d}
            </motion.span>
          ) : (
            <span key={d} className="cal__d">
              {d}
            </span>
          ),
        )}
      </div>
    </div>
  );
}

export function DateSection() {
  return (
    <section className="section section--photo" id="sana">
      <PhotoBg photo={photos.date} className="photo--dark" />
      <div className="wrap">
        <Heading label="Sana" title="To’yga qadar" />
        <Reveal className="bigdate">
          <span>
            <CountUp to={Number(wedding.day)} pad={2} />
          </span>
          <i aria-hidden />
          <span>
            <CountUp to={Number(wedding.monthNumber)} pad={2} duration={1.4} />
          </span>
          <i aria-hidden />
          <span>
            <CountUp to={Number(wedding.year)} from={1990} duration={2.2} />
          </span>
        </Reveal>
        <Reveal>
          <Countdown />
        </Reveal>
        <Card>
          <Calendar />
          <p className="cal__note">
            {wedding.day} {wedding.month}, {wedding.weekday}. Boshlanishi soat {wedding.time} da
          </p>
          <a className="btn btn--ghost" href={wedding.googleCalendar} target="_blank" rel="noopener noreferrer">
            Google Taqvimga qo’shish
          </a>
        </Card>
      </div>
    </section>
  );
}

/* ---------------- Kun tartibi ---------------- */

const ICONS: Record<ProgramIcon, string[]> = {
  welcome: ["M6.5 20.500V4.500h11v16", "M3.500 20.500h17", "M14.200 12.500v.6"],
  table: ["M4 16.500h16", "M5.500 16.500a6.500 6.500 0 0 1 13 0", "M12 10V8", "M10.500 8h3", "M3 19.500h18"],
  toast: ["M7.500 4h6l-.7 5.200a2.320 2.320 0 0 1-4.600 0L7.500 4Z", "M10.500 11.300V19", "M7.800 19h5.400", "M17.500 4.500v2.600", "M16.200 5.800h2.600", "M19 10v1.600", "M18.200 10.800h1.600"],
  music: ["M9 17.500V6l10-2v11.500", "M9 17.500a2.500 2.500 0 1 1-5 0 2.500 2.500 0 0 1 5 0Z", "M19 15.500a2.500 2.500 0 1 1-5 0 2.500 2.500 0 0 1 5 0Z"],
};

export function Program() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 78%", "end 55%"] });
  const line = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  const head = useTransform(line, (v) => `${v * 100}%`);
  const headOpacity = useTransform(line, [0, 0.03, 0.97, 1], [0, 1, 1, 0]);

  return (
    <section className="section section--solid" id="tartib">
      <Glow />
      <Sprig className="sprig sprig--l" />
      <Sprig className="sprig sprig--r" flip />
      <div className="wrap">
        <Heading label="Dastur" title="Kun tartibi" />
        <div className="plan" ref={ref}>
          <span className="plan__rail" aria-hidden>
            <motion.span className="plan__line" style={{ scaleY: line }} />
            <motion.span className="plan__head" style={{ top: head, opacity: headOpacity }} />
          </span>
          <ol>
          {wedding.program.map((item) => (
            <motion.li
              key={item.time}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.7 }}
              transition={{ staggerChildren: 0.12 }}
            >
              <motion.span
                className="plan__icon"
                aria-hidden
                variants={{
                  hidden: { scale: 0.4, opacity: 0 },
                  show: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 260, damping: 18 } },
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  {ICONS[item.icon].map((d) => (
                    <motion.path key={d} d={d} variants={draw} />
                  ))}
                </svg>
              </motion.span>
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: 34, filter: "blur(8px)" },
                  show: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.9, ease: EASE } },
                }}
              >
                <time dateTime={item.time}>{item.time}</time>
                <h3>{item.title}</h3>
              </motion.div>
            </motion.li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Manzil ---------------- */

export function Venue() {
  return (
    <section className="section section--photo" id="manzil">
      <PhotoBg photo={photos.venue} className="photo--dark" />
      <div className="wrap wrap--wide">
        <Heading label="Manzil" title="Tantana manzili" />
        <Card className="venue">
          <div className="venue__info">
            <div className="pin" aria-hidden>
              <i />
              <i />
              <i />
              <motion.svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                initial={{ y: -40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, amount: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 12, delay: 0.3 }}
              >
                <path d="M12 21.500s6.500-6.100 6.500-11A6.500 6.500 0 0 0 5.500 10.500c0 4.900 6.500 11 6.500 11Z" strokeLinejoin="round" />
                <circle cx="12" cy="10.300" r="2.300" />
              </motion.svg>
            </div>
            <h3 className="gold-text">{wedding.venue.name}</h3>
            <p className="venue__kind">{wedding.venue.kind}</p>
            <address>{wedding.venue.address}</address>
            <div className="venue__links">
              <a className="btn" href={wedding.venue.yandex} target="_blank" rel="noopener noreferrer">
                Yandex Xaritada ochish
              </a>
              <a className="btn btn--ghost" href={wedding.venue.google} target="_blank" rel="noopener noreferrer">
                Google Xaritada ochish
              </a>
            </div>
          </div>
          <div className="map">
            <iframe
              src={wedding.venue.embed}
              title={`${wedding.venue.name} ${wedding.venue.kind} xaritada`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </Card>
      </div>
    </section>
  );
}

/* ---------------- Yakun ---------------- */

const ringText = `${wedding.groom} & ${wedding.bride}  ✦  ${wedding.day} ${wedding.month} ${wedding.year}  ✦  Nikoh to’yi  ✦  `;

export function Closing() {
  return (
    <footer className="closing">
      <PhotoBg photo={photos.closing} />
      <div className="wrap">
        <div className="emblem">
          <motion.svg
            className="emblem__ring"
            viewBox="0 0 200 200"
            aria-hidden
            initial={{ opacity: 0, scale: 0.7, rotate: -50 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.6, ease: EASE }}
          >
            <defs>
              <path id="emblem-path" d="M100 100m-84 0a84 84 0 1 1 168 0a84 84 0 1 1-168 0" />
            </defs>
            <g className="emblem__spin">
              <text>
                <textPath href="#emblem-path" textLength="520">
                  {ringText}
                </textPath>
              </text>
            </g>
            <circle cx="100" cy="100" r="68" className="emblem__line" />
            <circle cx="100" cy="100" r="97" className="emblem__line emblem__line--dash" />
          </motion.svg>
          <motion.div
            className="emblem__heart"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.4 }}
          >
            <HeartIcon />
          </motion.div>
        </div>
        <Words className="closing__lead" text="Sizni intizorlik bilan kutamiz" />
        <Reveal className="closing__names" delay={0.2}>
          <span className="gold-text">
            {wedding.groom} <em>&amp;</em> {wedding.bride}
          </span>
        </Reveal>
        <Reveal className="datebar" delay={0.35}>
          <span>{wedding.day}</span>
          <span>{wedding.monthNumber}</span>
          <span>{wedding.year}</span>
        </Reveal>
      </div>
    </footer>
  );
}
