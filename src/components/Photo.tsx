"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { getImageProps } from "next/image";
import { useCallback, useRef, useState } from "react";
import type { PhotoSource } from "@/lib/photos";

/**
 * Oq-qora fon rasmi. Telefon va kompyuter uchun alohida kesilgan fayl beriladi,
 * rasm yuklanib bo'lgach qorong'ilikdan sekin ochiladi.
 */
export function Picture({ photo, eager = false }: { photo: PhotoSource; eager?: boolean }) {
  const [loaded, setLoaded] = useState(false);

  // Rasm ekranni to'ldirib, parallaks uchun undan biroz kattaroq chiziladi:
  // shuning uchun brauzerga ekran enidan kengroq o'lcham aytiladi, aks holda xira chiqadi.
  const { props: landscape } = getImageProps({ alt: "", sizes: "125vw", src: photo.landscape });
  const { props: portrait } = getImageProps({
    alt: "",
    sizes: "150vw",
    src: photo.portrait,
    loading: eager ? "eager" : "lazy",
    fetchPriority: eager ? "high" : "auto",
  });

  // Rasm sahifa jonlanishidan oldin yuklanib bo'lgan bo'lishi mumkin: unda onLoad kelmaydi
  const ref = useCallback((img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth > 0) setLoaded(true);
  }, []);

  return (
    <picture>
      <source media="(orientation: landscape)" srcSet={landscape.srcSet} sizes={landscape.sizes} />
      <img
        {...portrait}
        alt=""
        ref={ref}
        onLoad={() => setLoaded(true)}
        className={`photo__pic${loaded ? " is-loaded" : ""}`}
      />
    </picture>
  );
}

/**
 * Bo'lim foni: rasm ekranga "yopishib" turadi, sahifa aylantirilganda
 * sekin siljiydi va kattalashadi (parallaks).
 */
export function PhotoBg({ photo, eager, className = "" }: { photo: PhotoSource; eager?: boolean; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.16, 1.04, 1.1]);

  return (
    <div className={`photo ${className}`} ref={ref} aria-hidden>
      <div className="photo__pin">
        <motion.div className="photo__move" style={reduce ? undefined : { y, scale }}>
          <Picture photo={photo} eager={eager} />
        </motion.div>
      </div>
      <div className="photo__shade" />
    </div>
  );
}
