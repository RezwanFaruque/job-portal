"use client";

import React from "react";
import Link from "next/link";
import { useStore, RootState } from "../../store/useStore";

export default function LoginModal() {
  const toggleLogin = useStore((state: RootState) => state.toggleLoginModal);
  const toggleSignup = useStore((state: RootState) => state.toggleSignupModal);

  return (
    <div className="modal-overlay">
      <div className="login-modal-placeholder">
        <div className="header">Login</div>
        <div className="body">
          <div className="main-login-form">
            <form>
              <div className="email">
                <input className="email" type="email" placeholder="Email" name="Email" />
              </div>
              <div className="password">
                <input
                  className="password"
                  type="password"
                  placeholder="Password"
                  name="password"
                />
                <Link className="forget-password" href="/">
                  Forget Password
                </Link>
              </div>
              <div className="login-submit">
                <button type="submit" className="button-submit">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="footer">
          <div className="footer-content">
            <div className="footer-content-text">Don&apos;t have an account?</div>
            <button
              className="create-account-button"
              onClick={() => {
                if (toggleLogin) toggleLogin();
                if (toggleSignup) toggleSignup();
              }}
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

