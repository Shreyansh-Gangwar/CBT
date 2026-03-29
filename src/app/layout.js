import './globals.css'

export const metadata = {
  title: 'Lakshya JEE 2026 — Practice Test 01',
  description: 'Physics, Chemistry, Mathematics — 75 Questions, 180 Minutes',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
