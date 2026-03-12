import "./globals.css";
import { Geist } from "next/font/google";
import ConditionalLayout from "./components/ConditionalLayout";
import { AuthProvider } from "./context/authContext";

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
      <body className="h-screen w-full overflow-hidden">
        <AuthProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
