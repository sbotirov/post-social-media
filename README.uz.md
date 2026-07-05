# Post2SocialMedia (Telepost)

Telegram kanallarini boshqarish, xabarlarni rejalashtirish va formatlash uchun mo'ljallangan kuchli, ochiq kodli (open-source) boshqaruv paneli. Post2SocialMedia sizga boy formatdagi xabarlarni yaratish, media fayllar biriktirish, inline klaviaturalar (jumladan, viktorina/quiz) qo'shish va Telegram botlari orqali xabarlarni avtomatik tarzda kelajakda yuborish imkonini beradi.

## Imkoniyatlari

- **Boy formatli xabar muharriri (Rich Text Composer):** Xabarlarni qalin, qiya, kod bloklari, havolalar va boshqa ko'rinishlarda yuborish.
- **Media qo'llab-quvvatlash:** Rasm, video, audio va hujjatlarni yuklash va biriktirish.
- **Inline klaviaturalar:** Interaktiv inline tugmalar yoki viktorinalarni osongina yaratish.
- **Matndan Ovozga (Text-to-Speech / TTS):** Google TTS orqali ovozli xabarlar yaratish va ularni xabarlarga biriktirish (O'zbek, Ingliz, Rus tillari va boshqalarni qo'llab-quvvatlaydi).
- **Rejalashtirish tizimi:** Xabarlarni kelajakdagi ma'lum bir vaqtda yuborishni rejalashtirish.
- **Tarix va Qoralamalar (History & Drafts):** O'tgan xabarlarni ko'rish, xabarlarni qoralama sifatida saqlash va keyinroq tahrirlash.
- **Ko'p kanallarni boshqarish:** Bir nechta Telegram kanallarini osongina qo'shish va boshqarish.
- **Ko'p tilli UI:** Interfeys **Ingliz** va **O'zbek** tillarida mavjud.
- **Dark Mode / Glassmorphism dizayni:** Premium, to'liq moslashuvchan, shishasimon (glassmorphism) zamonaviy interfeys.

## Talablar

- Node.js (v20+)
- Docker & Docker Compose (oson ishga tushirish uchun)
- [@BotFather](https://t.me/BotFather) dan olingan Telegram Bot Tokeni

## Ishga tushirish (Mahalliy / Local Development)

1. **Repozitoriyni yuklab olish (Clone):**
   ```bash
   git clone https://github.com/USERNAME/post-social-media.git
   cd post-social-media
   ```

2. **Kutubxonalarni o'rnatish:**
   ```bash
   npm install
   ```

3. **Muhit sozlamalari (Environment Setup):**
   Loyiha papkasida `.env` faylini yarating:
   ```env
   NEXTAUTH_SECRET=sizning-maxfiy-kalitingiz
   NEXTAUTH_URL=http://localhost:3000
   AUTH_TRUST_HOST=true
   DATABASE_URL=file:./dev.db
   BOT_TOKEN=SIZNING_TELEGRAM_BOT_TOKENINGIZ
   ```

4. **Ma'lumotlar bazasini ishga tushirish:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Dasturni ishga tushirish:**
   ```bash
   npm run dev
   ```
   Dastur `http://localhost:3000` manzilida ishga tushadi.

## Docker yordamida ishga tushirish (Tavsiya etiladi)

Siz butun loyihani Docker yordamida osongina ishga tushirishingiz mumkin:

1. `.env` faylini o'zingizning ma'lumotlaringiz bilan yangilang.
2. Docker Compose yordamida qurish va ishga tushirish:
   ```bash
   docker compose up -d --build
   ```
Bu dastur imidjini yaratadi, SQLite ma'lumotlar bazasini sozlaydi va rejalashtirilgan xabarlar uchun fon (cron-job) xizmatini avtomatik ravishda ishga tushiradi.

## Qanday qilib Fork qilish va hissa qo'shish (Contribute)

1. GitHub'da repozitoriyni "Fork" qiling.
2. Fork qilingan loyihani kompyuteringizga yuklab oling (`git clone https://github.com/SIZNING_USERNAMINGIZ/post-social-media.git`).
3. Yangi imkoniyat uchun yangi branch yarating (`git checkout -b feature/qandaydir-imkoniyat`).
4. O'zgarishlarni commit qiling (`git commit -m 'Yangi ajoyib imkoniyat qo'shildi'`).
5. Branch'ni GitHub'ga yuboring (`git push origin feature/qandaydir-imkoniyat`).
6. Pull Request (PR) oching.

## Litsenziya

Ushbu loyiha ochiq kodli va barcha uchun foydalanish bepul.
