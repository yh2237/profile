export const title = 'yh.contact'

export const linkbar = [
  {
    label: 'PAGES',
    href: '/',
    items: [
      { label: 'README', href: '/#readme' },
      { label: 'About Me', href: '/#about-me' },
      { label: 'Links', href: '/#links' },
    ],
  },
  {
    label: 'SERVER',
    href: '/server',
    items: [
      { label: 'ABOUT', href: '/server' },
      { label: 'STATUS', href: '/status' },
    ],
  },
  {
    label: 'PROJECTS',
    href: '/projects',
    items: [
      { label: '足立データベース', href: 'https://adachidb.net/', external: true },
      { label: '足立レイ読み上げBot', href: 'https://bot.adachidb.net/', external: true },
      { label: 'UtauTTS', href: 'https://github.com/yh2237/UtauTTS', external: true },
      { label: '一覧', href: '/projects' },
    ],
  },
  {
    label: 'CONTACT',
    href: '/contact',
    items: [
      { label: 'EMAIL', href: 'mailto:hi@yh.contact' },
      { label: 'TWITTER', href: 'https://twitter.com/2237yh', external: true },
      { label: 'GITHUB', href: 'https://github.com/yh2237', external: true },
      { label: 'BLUESKY', href: 'https://bsky.app/profile/0yh.dev', external: true },
      { label: '一覧', href: '/contact' },
    ],
  },
]

export const footerLinks = [
  { label: 'TOP', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'Server', href: '/server' },
  { label: 'Status', href: '/status' },
  { label: 'Contact', href: '/contact' },
]

export const copyright = '2024 yh'

export default {
  title,
  linkbar,
  footerLinks,
  copyright,
}
