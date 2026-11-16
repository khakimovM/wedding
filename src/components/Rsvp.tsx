"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState, type FormEvent } from "react";
import { wedding } from "@/lib/config";
import { EASE, Heading, Reveal } from "./ui";

type Status = "idle" | "sending" | "done";

const ERRORS: Record<string, string> = {
  name: "Ism va familiyangizni yozing.",
  rate: "Juda ko’p urinish bo’ldi. Bir necha daqiqadan keyin qayta yuboring.",
  fail: "Javob yuborilmadi. Internetni tekshirib, qayta urinib ko’ring.",
};

export default function Rsvp() {
  const [name, setName] = useState("");
  const [coming, setComing] = useState(true);
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // yashirin maydon, odamlar to'ldirmaydi
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 2) return setError(ERRORS.name);
    setError("");
    setStatus("sending");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed, attending: coming, guests: coming ? guests : 0, message: message.trim(), website }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error === "rate" ? "rate" : "fail");
      setStatus("done");
    } catch (err) {
      setStatus("idle");
      setError(ERRORS[err instanceof Error && err.message === "rate" ? "rate" : "fail"]);
    }
  }

  return (
    <section className="section" id="javob">
      <div className="wrap">
        <Heading label="Javob" title="Kelishingizni tasdiqlang" />
        <Reveal>
          <p className="section__lead">Javobingiz to’g’ridan-to’g’ri kuyovning Telegramiga boradi.</p>
        </Reveal>

        <Reveal className="card rsvp">
          <AnimatePresence mode="wait" initial={false}>
            {status === "done" ? (
              <motion.div
                key="done"
                className="done"
                role="status"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                <span className="done__burst" aria-hidden>
                  {Array.from({ length: 10 }, (_, i) => (
                    <i key={i} style={{ ["--a" as string]: `${i * 36}deg` }} />
                  ))}
                </span>
                <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <motion.circle cx="32" cy="32" r="27" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, ease: "easeInOut" }} />
                  <motion.path d="M21 33l8 8 15-17" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }} />
                </svg>
                <h3>Javobingiz yuborildi</h3>
                <p>{coming ? `Rahmat, ${name.trim()}! Sizni to’yda kutamiz.` : `Rahmat, ${name.trim()}. Tilaklaringiz kuyovga yetkazildi.`}</p>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={submit} noValidate exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }}>
                <div className="field">
                  <label htmlFor="rsvp-name">Ism va familiyangiz</label>
                  <input
                    id="rsvp-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    maxLength={60}
                    placeholder="Masalan, Anvar Karimov"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    aria-invalid={error === ERRORS.name}
                  />
                  <i className="field__line" aria-hidden />
                </div>

                <div className="field" role="radiogroup" aria-labelledby="rsvp-coming">
                  <span className="field__label" id="rsvp-coming">
                    To’yga kelasizmi?
                  </span>
                  <div className="toggle">
                    {[
                      { value: true, text: "Albatta kelaman" },
                      { value: false, text: "Kela olmayman" },
                    ].map((option) => (
                      <button
                        key={option.text}
                        type="button"
                        role="radio"
                        aria-checked={coming === option.value}
                        className={coming === option.value ? "is-on" : undefined}
                        onClick={() => setComing(option.value)}
                      >
                        {coming === option.value && (
                          <motion.span layoutId="toggle-pill" className="toggle__pill" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                        )}
                        <span>{option.text}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {coming && (
                    <motion.div
                      className="field field--row"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                    >
                      <span className="field__label" id="rsvp-guests">
                        Necha kishi bo’lib kelasiz?
                        <small>O’zingiz bilan birga hisoblang</small>
                      </span>
                      <div className="stepper" role="group" aria-labelledby="rsvp-guests">
                        <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))} disabled={guests <= 1} aria-label="Bir kishiga kamaytirish">
                          −
                        </button>
                        <output aria-live="polite">
                          <AnimatePresence mode="popLayout" initial={false}>
                            <motion.span key={guests} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.25 }}>
                              {guests}
                            </motion.span>
                          </AnimatePresence>
                        </output>
                        <button type="button" onClick={() => setGuests((g) => Math.min(wedding.maxGuests, g + 1))} disabled={guests >= wedding.maxGuests} aria-label="Bir kishiga ko’paytirish">
                          +
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="field">
                  <label htmlFor="rsvp-wish">
                    Tilaklaringiz <small>(ixtiyoriy)</small>
                  </label>
                  <textarea
                    id="rsvp-wish"
                    name="message"
                    rows={3}
                    maxLength={500}
                    placeholder="Yoshlarga ezgu tilaklaringizni yozing"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <i className="field__line" aria-hidden />
                </div>

                <div className="hp" aria-hidden>
                  <label htmlFor="rsvp-web">Sayt</label>
                  <input id="rsvp-web" name="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
                </div>

                <p className="form__error" role="alert">
                  {error}
                </p>
                <button className="btn btn--wide" type="submit" disabled={status === "sending"}>
                  {status === "sending" ? (
                    <>
                      <i className="spinner" aria-hidden /> Yuborilmoqda…
                    </>
                  ) : (
                    "Javobni yuborish"
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}
