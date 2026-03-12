"use client";

import React from "react";
import { useStore } from "../store/useStore";
import LoginModal from "./features/LoginModal";
import SingupModal from "./features/SingupModal";

// simple client component that watches the zustand store and renders
// whichever modals are active.  Keeping it separate lets layout remain a
// server component and still export metadata.
export default function ModalContainer() {
  const showLogin = useStore((s) => s.showLoginModal);
  const showSignup = useStore((s) => s.showSignupModal);

  return (
    <>
      {showLogin && <LoginModal />}
      {showSignup && <SingupModal />}
    </>
  );
}
