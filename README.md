# Zikrullo va Baxoroy to'yi taklifnomasi

Next.js (App Router, TypeScript) da yozilgan, yorug' va minimalistik, animatsiyalarga boy taklifnoma.
Mehmon javoblari Telegram bot orqali faqat kuyovga boradi.

## Ishga tushirish

```bash
npm install
cp .env.example .env.local   # ichiga bot tokeni va chat ID ni yozing
npm run dev                  # http://localhost:3000
```

## Tuzilishi

```
src/lib/config.ts            barcha ma'lumotlar: ismlar, sana, dastur, manzil, kartalar
src/app/api/rsvp/route.ts    javobni Telegramga yuboradigan server funksiyasi
src/app/layout.tsx           shriftlar va meta ma'lumotlar
src/app/globals.css          butun dizayn
src/components/
  Invitation.tsx             sahifa yig'ilishi, musiqa, skroll chizig'i
  Cover.tsx                  muqova va o'ngga suriladigan qulf
  Hero.tsx                   aylanuvchi muhr va ismlar
  Sections.tsx               taklif matni, sanoq, taqvim, kun tartibi, manzil, yakun
  Rsvp.tsx                   mehmon formasi
  Gifts.tsx                  to'yona kartalari
  Petals.tsx                 yog'ilib turadigan gul barglari
public/music.mp3             fon musiqasi (o'zingiz qo'yasiz)
```

## Musiqa

Musiqa faylini `public/music.mp3` nomi bilan qo'ying. Qulf ochilganda musiqa o'zi yoqiladi,
o'ng yuqoridagi tugma bilan to'xtatiladi. Fayl bo'lmasa tugma ko'rinmaydi va sahifa musiqasiz ishlaydi.

## Telegram botni ulash

1. Telegramda [@BotFather](https://t.me/BotFather) ga `/newbot` yozing va tokenni oling.
2. **Kuyovning o'zi** yangi botni ochib `/start` bosishi shart. Bot faqat o'ziga yozgan odamga xabar yubora oladi.
3. Kuyovning chat ID sini aniqlang. Brauzerda quyidagi manzilni oching (`<TOKEN>` o'rniga tokenni qo'ying):

   ```
   https://api.telegram.org/bot<TOKEN>/getUpdates
   ```

   Javobdagi `"chat":{"id":123456789,...}` qismidagi raqam kerak.
4. `.env.local` fayliga (Vercel'da esa **Settings → Environment Variables** ga) yozing:

   ```
   TELEGRAM_BOT_TOKEN=...
   GROOM_CHAT_ID=...
   ```

### Nega javoblar faqat kuyovga boradi

- Xabar boradigan chat ID server tomonda qat'iy belgilangan, sahifadan o'zgartirib bo'lmaydi.
- Token faqat serverda turadi va brauzerga chiqmaydi.
- Botga webhook ulanmagan: unga boshqa odam yozsa ham bot javob bermaydi.

## Deploy (Vercel)

```bash
npm i -g vercel
vercel --prod
```

Yoki loyihani GitHub'ga yuklab, Vercel'da import qiling. Ikkala muhit o'zgaruvchisini qo'shishni unutmang.

## Himoya

- Yashirin maydon (honeypot) oddiy spam-botlarni to'xtatadi.
- Bitta IP dan 10 daqiqada ko'pi bilan 5 ta javob qabul qilinadi.
- Sahifa `noindex` bilan belgilangan, qidiruv tizimlarida chiqmaydi.
