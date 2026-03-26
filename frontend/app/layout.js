import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans"
});

export const metadata = {
  title: "QRT Studio",
  description: "AI content dashboard with mock image generation"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
