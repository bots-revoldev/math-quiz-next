import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "Math Adventure | Play & Learn!",
  description: "A magical math quiz for young learners",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fredoka.variable}`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
