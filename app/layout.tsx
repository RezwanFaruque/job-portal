
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header} from "@/components/layout";
import  Footer  from "@/components/features/Footer";
import ModalContainer from "../components/ModalContainer";
import { Providers } from "./providers";

import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/assets/css/style.css";
import "../styles/main.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Job Portal",
  description: "Job Portal - Find your next opportunity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
      >
        <Providers>
          <Header />

          {children}
          <ModalContainer />

          <Footer />
        </Providers>
      </body>
    </html>
  );
}
