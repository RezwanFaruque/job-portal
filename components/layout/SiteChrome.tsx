"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/features/Footer";
import { Header } from "@/components/layout/Header";
import SmoothScroll, { isPublicPage } from "@/components/layout/SmoothScroll";
import ModalContainer from "@/components/ModalContainer";

export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

  return (
    <>
      {isPublicPage(pathname) && <SmoothScroll />}
      {!isAdminRoute && <Header />}
      {children}
      {!isAdminRoute && <ModalContainer />}
      {!isAdminRoute && <Footer />}
    </>
  );
}
