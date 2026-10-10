import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UI-03 // Quantum Passkey Keypad",
  description: "Tactile Quantum Security Keypad with Dynamic Scramble Physics, Auto-Advance Biometrics & Web Audio Haptics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
        {children}
      </body>
    </html>
  );
}
