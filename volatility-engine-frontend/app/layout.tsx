import "./globals.css";
import { Geist } from "next/font/google";
import Topbar from "./components/Topbar";
import LayoutWrapper from "./components/layout/LayoutWrapper";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="bg-black text-white antialiased font-sans">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}