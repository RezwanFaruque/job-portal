"use client";

import React from "react";
import Link from "next/link";
import { useStore, RootState } from "../../store/modalStore";
import { FormEvent } from "react";
import { userStore } from "@/store/userStore";

export default function LoginModal() {
  const toggleLogin = useStore((state: RootState) => state.toggleLoginModal);
  const toggleSignup = useStore((state: RootState) => state.toggleSignupModal);
  const { user, setUser , authenticate  } = userStore();
  async function submitLogin(event : FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    console.log(formData);
    const data = {
      email:  formData.get('email') as string,
      password: formData.get('password') as string
    }
    authenticate(data);
  } 

  return (
    <div className="modal-overlay">
      <div className="login-modal-placeholder">
        <div className="header">Login</div>
        <button
          type="button"
          className="modal-close"
          aria-label="Close login modal"
          onClick={() => toggleLogin?.()}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M2 2L14 14M14 2L2 14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <div className="body">
          <div className="main-login-form">
            <form onSubmit={submitLogin}>
              <div className="email">
                <input className="email" type="email" placeholder="Email" name="email" />
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

