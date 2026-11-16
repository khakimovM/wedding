/**
 * To'yga oid barcha ma'lumotlar shu yerda.
 * Ism, sana, manzil yoki karta raqamini o'zgartirish uchun faqat shu faylni tahrirlang.
 */

export type ProgramIcon = "welcome" | "table" | "toast" | "music";

export const wedding = {
  groom: "Zikrullo",
  bride: "Baxoroy",

  /** To'y boshlanishi (Toshkent vaqti, UTC+5) */
  dateISO: "2026-11-27T14:00:00+05:00",
  day: "27",
  monthNumber: "11",
  month: "noyabr",
  monthTitle: "Noyabr",
  year: "2026",
  weekday: "juma",
  time: "14:00",

  program: [
    { time: "14:00", title: "Mehmonlarni kutib olish", icon: "welcome" },
    { time: "16:00", title: "Bazm dasturxoni", icon: "table" },
    { time: "16:30", title: "Ziyofat va tabriklar", icon: "toast" },
    { time: "17:00", title: "Raqs va musiqa", icon: "music" },
  ] satisfies { time: string; title: string; icon: ProgramIcon }[],

  venue: {
    name: "Ko’ksaroy",
    kind: "to’yxonasi",
    address: "Farg’ona kichik xalqa yo’li",
    // To'yxonaning xaritadagi aniq nuqtasi: 40.4035177 (kenglik), 71.784955 (uzunlik).
    // Manzil o'zgarsa, quyidagi uchala havoladagi koordinatalarni ham yangilang.
    google: "https://maps.app.goo.gl/ejcPMxCwNpNeseNr5",
    yandex:
      "https://yandex.uz/maps/?ll=71.784955%2C40.4035177&pt=71.784955%2C40.4035177&z=17",
    /** Sahifaning o'zida ko'rinadigan xarita */
    embed:
      "https://maps.google.com/maps?q=40.4035177%2C71.784955&z=16&hl=uz&output=embed",
  },

  googleCalendar:
    "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Zikrullo%20va%20Baxoroy%20to%E2%80%99yi&dates=20261127T090000Z/20261127T140000Z&location=Ko%E2%80%99ksaroy%20to%E2%80%99yxonasi%2C%20Farg%E2%80%99ona%20kichik%20xalqa%20yo%E2%80%99li",

  /** To'yona uchun kartalar. holder bo'sh qolsa, karta egasi ko'rsatilmaydi. */
  cards: [
    { number: "4023 0605 0196 6534", holder: "" },
    { number: "5614 6816 2103 4986", holder: "" },
  ],

  maxGuests: 10,
  music: "/music.mp3",
};
