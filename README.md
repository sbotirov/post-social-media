# TelePost

**English**

TelePost is a modern Telegram social media posting and scheduling web application. You can write rich-text posts, attach media, generate Text-To-Speech (TTS) audio, create polls, add inline keyboards, and schedule posts to multiple Telegram channels at once.

## Features
- **Multi-channel Posting**: Post to multiple channels simultaneously.
- **Rich Text & Formatting**: Use standard Telegram formatting (HTML / MarkdownV2).
- **Media Uploads**: Attach photos, videos, audio, and documents (Up to 50MB per file).
- **Text-to-Speech (TTS)**: Generate high-quality voice messages from text.
- **Polls & Keyboards**: Add anonymous polls, quiz mode, and interactive inline buttons.
- **Scheduling**: Schedule posts for a specific time and date, managed by a reliable background worker.
- **Multilingual Support**: Supports English and Uzbek seamlessly.

## Getting Started

### Prerequisites
- Node.js (v18+)
- Docker (optional, for Redis and SQLite setup)
- A Telegram Bot Token from [@BotFather](https://t.me/BotFather)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/sbotirov/post-social-media.git
   cd post-social-media
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup Environment Variables:
   Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
   Add your `AUTH_SECRET`, database URL, and Telegram credentials.

4. Initialize the Database (Prisma):
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run the Application:
   ```bash
   npm run dev
   ```

### Docker Setup
You can also run everything using Docker Compose:
```bash
docker-compose up -d --build
```

---

**O'zbekcha**

TelePost - bu Telegram kanallari uchun xabarlarni rejalashtirish va boshqarish platformasi. Siz boy matnli xabarlar yozishingiz, media fayllar yuklashingiz, matndan ovoz (TTS) yaratishingiz, so'rovnomalar tuzishingiz va bitta xabarni bir vaqtning o'zida bir nechta kanallarga yuborishingiz yoki rejalashtirishingiz mumkin.

## Imkoniyatlar
- **Ko'p kanalli xabar yuborish**: Bir vaqtning o'zida bir nechta kanallarga xabar yuborish.
- **Matn formatlash**: Telegram standart formatlaridan (HTML / MarkdownV2) foydalanish.
- **Media yuklash**: Rasm, video, audio va hujjatlarni biriktirish (har biri 50 MB gacha).
- **Matndan ovoz (TTS)**: Matn asosida sifatli ovozli xabarlar yaratish.
- **So'rovnoma va Tugmalar**: Yashirin ovoz berish, viktorina rejimi va interaktiv inline-tugmalar qo'shish.
- **Rejalashtirish**: Xabarlarni aniq vaqt va sanaga rejalashtirish (orqa fonda avtomatik ishlaydi).
- **Ko'p tilli**: Ingliz va O'zbek tillarini mukammal qo'llab-quvvatlash.

## Boshlash

### Talablar
- Node.js (v18+)
- Docker (ixtiyoriy, Redis va SQLite o'rnatish uchun)
- [@BotFather](https://t.me/BotFather) dan Telegram Bot Tokeni

### O'rnatish
1. Repozitoriyni yuklab oling:
   ```bash
   git clone https://github.com/sbotirov/post-social-media.git
   cd post-social-media
   ```

2. Kutubxonalarni o'rnating:
   ```bash
   npm install
   ```

3. Muhit O'zgaruvchilarini sozlang:
   `.env.example` dan `.env` fayl yarating:
   ```bash
   cp .env.example .env
   ```
   `AUTH_SECRET`, ma'lumotlar bazasi URL'i va Telegram ma'lumotlarini kiriting.

4. Ma'lumotlar Bazasini tayyorlash (Prisma):
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Dasturni ishga tushirish:
   ```bash
   npm run dev
   ```

### Docker orqali sozlash
Barcha tizimni Docker Compose orqali ham ishga tushirishingiz mumkin:
```bash
docker-compose up -d --build
```
