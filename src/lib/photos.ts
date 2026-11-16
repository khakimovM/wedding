/**
 * Fon rasmlari. Har bir bo'lim uchun ikkita fayl bor:
 *   *-portrait.jpg   telefon uchun (tik, 9:16)
 *   *-landscape.jpg  kompyuter uchun (yotiq, 16:10)
 *
 * Rasmni almashtirish uchun src/assets/photos ichidagi faylni xuddi shu nom bilan
 * o'zingizning rasmingizga almashtiring. Rangli rasm ham bo'laveradi:
 * sahifa uni o'zi oq-qora qilib ko'rsatadi.
 */
import type { StaticImageData } from "next/image";

import closingL from "@/assets/photos/closing-landscape.jpg";
import closingP from "@/assets/photos/closing-portrait.jpg";
import coverL from "@/assets/photos/cover-landscape.jpg";
import coverP from "@/assets/photos/cover-portrait.jpg";
import dateL from "@/assets/photos/date-landscape.jpg";
import dateP from "@/assets/photos/date-portrait.jpg";
import heroL from "@/assets/photos/hero-landscape.jpg";
import heroP from "@/assets/photos/hero-portrait.jpg";
import letterL from "@/assets/photos/letter-landscape.jpg";
import letterP from "@/assets/photos/letter-portrait.jpg";
import rsvpL from "@/assets/photos/rsvp-landscape.jpg";
import rsvpP from "@/assets/photos/rsvp-portrait.jpg";
import venueL from "@/assets/photos/venue-landscape.jpg";
import venueP from "@/assets/photos/venue-portrait.jpg";

export type PhotoSource = { portrait: StaticImageData; landscape: StaticImageData };

export const photos = {
  cover: { portrait: coverP, landscape: coverL },
  hero: { portrait: heroP, landscape: heroL },
  letter: { portrait: letterP, landscape: letterL },
  date: { portrait: dateP, landscape: dateL },
  venue: { portrait: venueP, landscape: venueL },
  rsvp: { portrait: rsvpP, landscape: rsvpL },
  closing: { portrait: closingP, landscape: closingL },
} satisfies Record<string, PhotoSource>;
