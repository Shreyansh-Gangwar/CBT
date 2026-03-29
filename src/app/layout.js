export const metadata = {
  title: 'JEE CBT — Lakshya JEE 2026',
  description: 'Computer Based Test platform for JEE Main preparation',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}
