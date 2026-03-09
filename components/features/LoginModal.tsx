"use client";

import React from "react";

const LoginModal: React.FC = () => (
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
            <a className="forget-password" href="/">
              Forget Password
            </a>
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
        <div className="footer-content-text">Don't have an account?</div>
        <button className="create-account-button">Create Account</button>
      </div>
    </div>
  </div>
);

export default LoginModal;

