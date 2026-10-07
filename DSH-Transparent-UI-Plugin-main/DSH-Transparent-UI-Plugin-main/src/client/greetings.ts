/**
 * Hero greeting pool: time-of-day buckets, random pick per new-session
 * mount, no immediate repeat. Disabling the Aqua layer resets the hero back
 * to the stock greeting for the active locale.
 */

/** Stable hero texts the stock UI shows without the Aqua layer. */
const BASE_GREETING = {
  zh: '你好，John Wu，今天有什么任务？',
  en: 'Into the Unknown',
}

/** Composer placeholder texts: stock, and the Aqua variant answering the greeting. */
const BASE_PLACEHOLDER = {
  zh: '描述你想要构建的内容',
  en: 'Describe what you want to build',
}

const AQUA_PLACEHOLDER = {
  zh: '说说今天的任务…',
  en: 'Tell me what to do today…',
}

/** Chinese greeting pool by time-of-day bucket (morning / day / evening / night). */
const ZH_GREETINGS: readonly (readonly string[])[] = [
  // morning (5–11)
  [
    '早，John Wu。今天从哪里开始？',
    '早上好，John Wu。先把最难的任务交给我。',
    '新的一天，John Wu。今天有什么任务？',
  ],
  // day (11–17)
  [
    '你好，John Wu，今天有什么任务？',
    'John Wu，欢迎回来。今天想做什么？',
    '嗨，John Wu。今天要探索哪里？',
  ],
  // evening (17–23)
  [
    '晚上好，John Wu。收尾还是继续？',
    'John Wu，晚上好。还有什么没做完？',
    '傍晚好，John Wu。今天进展如何？',
  ],
  // night (23–5)
  [
    '夜深了，John Wu。还在忙什么？',
    'John Wu，夜里灵感来了吗？',
    '这么晚还在，John Wu。要我做点什么？',
  ],
]

/** English greeting pool (same bucket shape; smaller, all-day flavored). */
const EN_GREETINGS: readonly (readonly string[])[] = [
  ['Morning, John Wu. Where do we start today?'],
  ['Hey John Wu, what are we working on today?', 'Welcome back, John Wu. What shall we build?'],
  ['Good evening, John Wu. Wrapping up or pressing on?'],
  ['Late night, John Wu. What are we still chasing?'],
]

/** Last picked index per locale so consecutive mounts avoid an immediate repeat. */
const lastPick = new Map<string, number>()

/** Hour bucket: morning 5–11, day 11–17, evening 17–23, night otherwise. */
function bucketOf(date: Date): number {
  const hour = date.getHours()
  if (hour >= 5 && hour < 11) return 0
  if (hour >= 11 && hour < 17) return 1
  if (hour >= 17 && hour < 23) return 2
  return 3
}

/**
 * Pick the greeting for the next hero mount.
 * @param locale - active locale id (`zh` pools by time of day; anything else
 * uses the English pool).
 * @returns the greeting string.
 */
export function pickGreeting(locale: string): string {
  const buckets = locale === 'zh' ? ZH_GREETINGS : EN_GREETINGS
  const bucket = buckets[bucketOf(new Date())] ?? []
  const pool = bucket.length > 0 ? bucket : buckets.flat()
  const previous = lastPick.get(locale)
  let index = Math.floor(Math.random() * pool.length)
  if (pool.length > 1 && index === previous) index = (index + 1) % pool.length
  lastPick.set(locale, index)
  return pool[index] ?? pool[0] ?? BASE_GREETING.zh
}

/**
 * Restore the stock hero copy for the active locale (called when the Aqua
 * layer is switched off, so the UI returns to its original wording).
 * @param locale - active locale id.
 */
export function resetHeroCopy(locale: string): void {
  const greeting = BASE_GREETING[locale === 'zh' ? 'zh' : 'en']
  for (const headline of document.querySelectorAll('[data-hero-headline]')) {
    headline.textContent = greeting
  }
  const textarea = document.querySelector<HTMLTextAreaElement>('[data-phase="hero"] textarea')
  if (textarea !== null) textarea.setAttribute('placeholder', BASE_PLACEHOLDER[locale === 'zh' ? 'zh' : 'en'])
}

/**
 * Aqua placeholder for the hero composer, matched to the active locale.
 * @param locale - active locale id.
 * @returns the placeholder string.
 */
export function aquaPlaceholder(locale: string): string {
  return AQUA_PLACEHOLDER[locale === 'zh' ? 'zh' : 'en']
}
