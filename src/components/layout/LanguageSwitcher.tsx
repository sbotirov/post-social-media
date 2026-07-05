'use client'

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const nextLocale = locale === 'uz' ? 'en' : 'uz';
    // Use the custom router from next-intl to preserve the current path
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <button
      onClick={toggleLocale}
      className="px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium border"
      style={{ borderColor: 'hsl(224 15% 20% / 0.5)', color: 'hsl(215 15% 55%)' }}
      title="Switch Language"
    >
      {locale === 'uz' ? '🇺🇿 UZ' : '🇬🇧 EN'}
    </button>
  );
}
