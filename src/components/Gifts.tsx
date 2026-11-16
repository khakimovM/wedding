"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef, useState, type PointerEvent } from "react";
import { wedding } from "@/lib/config";
import { Glow, Heading, Reveal } from "./ui";

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Eski brauzerlar uchun zaxira usul
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;left:-9999px";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {}
    ta.remove();
    return ok;
  }
}

function GiftCard({ number, holder, tone }: { number: string; holder: string; tone: "gold" | "onyx" }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  // Sichqoncha ostida kartaning yengil 3D og'ishi
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-12, 12]), { stiffness: 180, damping: 18 });
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [9, -9]), { stiffness: 180, damping: 18 });
  const flip = useMotionValue(0);
  const flipSpring = useSpring(flip, { stiffness: 70, damping: 14 });
  const turn = useTransform([rotateY, flipSpring], ([a, b]) => (a as number) + (b as number));

  const move = (e: PointerEvent) => {
    if (e.pointerType === "touch" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const leave = () => {
    px.set(0);
    py.set(0);
  };

  const onCopy = async () => {
    const ok = await copy(number.replace(/\s/g, ""));
    setState(ok ? "copied" : "failed");
    if (ok) flip.set(flip.get() + 360);
    window.setTimeout(() => setState("idle"), 2600);
  };

  return (
    <div className="gift">
      <motion.button
        ref={ref}
        type="button"
        className={`gift__card gift__card--${tone}`}
        style={{ rotateX, rotateY: turn }}
        onPointerMove={move}
        onPointerLeave={leave}
        onClick={onCopy}
        whileTap={{ scale: 0.97 }}
        aria-label={`${number} karta raqamidan nusxa olish`}
      >
        <span className="gift__shine" aria-hidden />
        <span className="gift__chip" aria-hidden />
        <span className="gift__num">{number}</span>
        <span className="gift__row">
          <span>{holder || "To’yona uchun"}</span>
          <span className={`gift__copy${state === "copied" ? " is-ok" : ""}`}>
            {state === "copied" ? "Nusxa olindi" : "Nusxa olish"}
          </span>
        </span>
      </motion.button>
      <p className="form__error" role="status">
        {state === "failed" ? "Nusxa olinmadi. Raqamni bosib turib, qo’lda ko’chiring." : ""}
      </p>
    </div>
  );
}

export default function Gifts() {
  return (
    <section className="section section--solid" id="toyona">
      <Glow />
      <div className="wrap">
        <Heading label="Sovg’a" title="To’yona" />
        <Reveal>
          <p className="section__lead">
            Tabrigingizni masofadan yo’llamoqchi bo’lsangiz, shu kartalardan foydalaning. Raqamdan nusxa olish uchun kartani bosing.
          </p>
        </Reveal>
        <div className="gifts">
          {wedding.cards.map((card, i) => (
            <Reveal key={card.number} delay={i * 0.15}>
              <GiftCard number={card.number} holder={card.holder} tone={i % 2 ? "onyx" : "gold"} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
