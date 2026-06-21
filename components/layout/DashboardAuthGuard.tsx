"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { userStore } from "@/store/userStore";

export default function DashboardAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const hydrateAuth = userStore((state) => state.hydrateAuth);

  useEffect(() => {
    hydrateAuth();
    setReady(true);
  }, [hydrateAuth]);

  useEffect(() => {
    if (!ready) return;

    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.replace("/");
    }
  }, [ready, router]);

  if (!ready) {
    return null;
  }

  return <>{children}</>;
}
