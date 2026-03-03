import "./globals.css";
import { Geist } from 'next/font/google'
import LayoutShell from "./components/LayoutShell";

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-inter',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="h-screen w-full overflow-hidden">
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}