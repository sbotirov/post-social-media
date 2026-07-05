import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['uz', 'en'],
  defaultLocale: 'uz',
  localePrefix: 'as-needed' // Only add /en/ when it's English, leave default / for Uzbek
});

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
