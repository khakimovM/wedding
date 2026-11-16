# Zikrullo va Baxoroy to'yi taklifnomasi

Next.js (App Router, TypeScript) da yozilgan taklifnoma: qora fon, oq-qora fon rasmlari, zar (oltin) aksentlar
va ko'p animatsiya. Mehmon javoblari Telegram bot orqali faqat kuyovga boradi.

## Ishga tushirish

```bash
npm install
cp .env.example .env.local   # ichiga bot tokeni va chat ID ni yozing
npm run dev                  # http://localhost:3000
```

## Tuzilishi

```
src/lib/config.ts            barcha ma'lumotlar: ismlar, sana, dastur, manzil, kartalar
src/lib/photos.ts            qaysi bo'limda qaysi fon rasmi turishi
src/assets/photos/           fon rasmlari (har biri telefon va kompyuter uchun alohida)
src/app/api/rsvp/route.ts    javobni Telegramga yuboradigan server funksiyasi
src/app/layout.tsx           shriftlar va meta ma'lumotlar
src/app/globals.css          butun dizayn
src/components/
  Invitation.tsx             sahifa yig'ilishi, musiqa, skroll chizig'i
  Cover.tsx                  muqova: qulf surilganda rasm eshikdek ikkiga ochiladi
  Hero.tsx                   bosh sahifa: ismlar, sana va vaqt
  Sections.tsx               taklif matni, sanoq, taqvim, kun tartibi, manzil, yakun
  Rsvp.tsx                   mehmon formasi
  Gifts.tsx                  to'yona kartalari
  Photo.tsx                  oq-qora fon rasmi va uning parallaks harakati
  Dust.tsx                   sahifa ustida suzib yuradigan zar uchqunlari
public/music.mp3             fon musiqasi (o'zingiz qo'yasiz)
```

## Fon rasmlari

Har bir bo'lim uchun `src/assets/photos` ichida ikkita fayl bor:

| Fayl                    | Qayerda ishlatiladi     | O'lcham (tavsiya)        |
| ----------------------- | ----------------------- | ------------------------ |
| `<nom>-portrait.jpg`    | telefon (tik ekran)     | 9:16, masalan 1440×2560  |
| `<nom>-landscape.jpg`   | kompyuter (yotiq ekran) | 16:10, masalan 2400×1500 |

`<nom>` quyidagilardan biri: `cover` (muqova), `hero` (bosh sahifa), `letter` (taklif matni), `date` (sana),
`venue` (manzil), `rsvp` (javob formasi), `closing` (yakun).

O'z rasmingizni qo'yish uchun faylni **xuddi shu nom bilan** almashtiring. Rangli rasm ham bo'laveradi:
sahifa uni o'zi oq-qora qilib, ustidan qoraytirib ko'rsatadi. `hero` va `closing` rasmlarida yozuvlar
tepada turadi, shuning uchun asosiy tasvir (juftlik) rasmning pastki yarmida bo'lgani ma'qul.

Hozirgi rasmlar Wikimedia Commons'dagi CC0 (erkin, muallifni ko'rsatish shart emas) Unsplash suratlari:
Alvin Mahmudov (muqova), Anne Edgar (bosh sahifa), Drew Coffman (taklif matni), thr3 eyes (sana),
Sweet Ice Cream Photography (manzil), Wu Jianxiong (javob), photo-nic.co.uk nic (yakun).

## Manzil va xarita

To'yxona nuqtasi `src/lib/config.ts` dagi `venue` bo'limida turadi: `google` (Google Xarita havolasi),
`yandex` (Yandex Xarita havolasi) va `embed` (sahifaning o'zida ko'rinadigan xarita).
Manzil o'zgarsa, uchalasidagi koordinatalarni birga yangilang.

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
