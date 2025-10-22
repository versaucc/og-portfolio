import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Using Inter as a close substitute for Franklin Gothic since Franklin Gothic isn't available in Google Fonts
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Economic Data Dashboard",
  description: "Real-time FRED economic indicators with Bloomberg terminal styling",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} antialiased`}
      >
        {children}
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
        ></script>
      </body>
    </html>
  );
}
