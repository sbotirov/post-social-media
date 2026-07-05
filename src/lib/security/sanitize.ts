// Telegram-safe HTML tags that should be preserved
const TELEGRAM_TAGS = ['b', 'i', 'u', 's', 'code', 'pre', 'a', 'spoiler', 'tg-spoiler', 'blockquote']

const TAG_PATTERN = new RegExp(
  `<(\\/?(${TELEGRAM_TAGS.join('|')}))(\\s[^>]*)?>`,
  'gi'
)

/**
 * Sanitize HTML while preserving Telegram-allowed tags.
 * Escapes all non-Telegram HTML entities.
 */
export function sanitizeHtml(input: string): string {
  if (!input) return ''

  // Extract and preserve Telegram tags
  const preserved: { placeholder: string; original: string }[] = []
  let counter = 0

  let cleaned = input.replace(TAG_PATTERN, (match) => {
    const placeholder = `__TG_TAG_${counter++}__`
    preserved.push({ placeholder, original: match })
    return placeholder
  })

  // Escape remaining HTML
  cleaned = cleaned
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

  // Restore Telegram tags
  for (const { placeholder, original } of preserved) {
    cleaned = cleaned.replace(placeholder, original)
  }

  return cleaned
}

/**
 * Strip ALL HTML tags from input.
 */
export function sanitizeInput(input: string): string {
  if (!input) return ''
  return input.replace(/<[^>]*>/g, '').trim()
}

/**
 * Validate Telegram Bot Token format.
 * Format: {number}:{alphanumeric-string}
 */
export function validateBotToken(token: string): boolean {
  return /^\d+:[A-Za-z0-9_-]{35,}$/.test(token)
}
