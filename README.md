# Post2SocialMedia (Telepost)

A powerful, open-source dashboard designed for managing, scheduling, and formatting Telegram channel posts. Post2SocialMedia enables you to easily compose rich messages, attach media, add inline keyboards (including quiz options), and schedule posts seamlessly using Telegram bots.

## Features

- **Rich Text Composer:** Send messages with bold, italics, code blocks, links, and more.
- **Media Support:** Upload and attach images, videos, audio, and documents.
- **Inline Keyboards:** Build custom interactive inline keyboards or quizzes effortlessly.
- **Text-to-Speech (TTS):** Generate voice messages via Google TTS and attach them to your posts (supports Uzbek, English, Russian, etc.).
- **Scheduling System:** Schedule messages to be sent at specific times in the future.
- **History & Drafts:** View past posts, save messages as drafts, and edit them later.
- **Multi-channel Management:** Add and manage multiple Telegram channels easily.
- **Multilingual UI:** Available in both **English** and **Uzbek**.
- **Dark Mode / Glassmorphism Design:** A premium, fully responsive, glassmorphism-styled modern interface.

## Prerequisites

- Node.js (v20+)
- Docker & Docker Compose (for easy deployment)
- A Telegram Bot Token from [@BotFather](https://t.me/BotFather)

## Getting Started (Local Development)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/USERNAME/post-social-media.git
   cd post-social-media
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory:
   ```env
   NEXTAUTH_SECRET=your-super-secret-key
   NEXTAUTH_URL=http://localhost:3000
   AUTH_TRUST_HOST=true
   DATABASE_URL=file:./dev.db
   BOT_TOKEN=YOUR_TELEGRAM_BOT_TOKEN
   ```

4. **Initialize Database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Access the application at `http://localhost:3000`.

## Docker Deployment (Recommended)

You can easily deploy the entire stack using Docker:

1. Update your `.env` file with your details.
2. Build and run using Docker Compose:
   ```bash
   docker compose up -d --build
   ```
This will build the application image, set up the SQLite volume, and run the background cron-job service for scheduled posts automatically.

## How to Fork & Contribute

1. Fork the repository on GitHub.
2. Clone your fork locally (`git clone https://github.com/YOUR_USERNAME/post-social-media.git`).
3. Create a new branch for your feature (`git checkout -b feature/amazing-feature`).
4. Commit your changes (`git commit -m 'Add amazing feature'`).
5. Push to the branch (`git push origin feature/amazing-feature`).
6. Open a Pull Request.

## License

This project is open-source and free to use for everyone.
