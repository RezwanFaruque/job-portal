"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/store/modalStore";

export default function AppliedJobDetailsRedirectPage() {
  const router = useRouter();
  const params = useParams();
  const openAppliedJobDetailsModal = useStore((state) => state.openAppliedJobDetailsModal);

  useEffect(() => {
    const applicationId = params.applicationId as string;
    if (!applicationId) return;

    router.replace("/applied-job");
    openAppliedJobDetailsModal?.(applicationId);
  }, [params.applicationId, router, openAppliedJobDetailsModal]);

  return null;
}
