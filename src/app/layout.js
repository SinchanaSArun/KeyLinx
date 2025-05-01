import './globals.css'

export const metadata = {
  title: 'KeyLinx',
  description: 'Welcome to KeyLinx',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}

