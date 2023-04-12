/* eslint-disable @next/next/no-img-element */
import React, { FC, useState } from "react";
import Link from "next/link";
import Input from "../input";

interface IAuthForm {
  type: "login" | "signup";
  label: string;
}

const AuthForm: FC<IAuthForm> = ({ type, label }) => {
  const [state, setState] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });

  return (
    <div className="form-base">
      <div className="form">
        <img src="/logo-svg-2.svg" alt="gray-suportal-logo" />
        <h3>{label}</h3>
        <h6>
          <span>
            {type === "login"
              ? "Don't have an account? "
              : "Already have an account? "}
          </span>
          <Link href={`/${type === "login" ? "signup" : "login"}`}>
            {type === "login" ? "Sign up" : "Sign in"}
          </Link>
        </h6>
        <div className="form-items">
          <Input
            value={state.email}
            theme="dark"
            name="email"
            onChange={(name, value) => {
              setState((prev) => ({
                ...prev,
                [name]: value,
              }));
            }}
            placeholder="Email"
            label="Email"
            type="email"
          />
          <Input
            value={state.password}
            name="password"
            theme="dark"
            onChange={(name, value) => {
              setState((prev) => ({
                ...prev,
                [name]: value,
              }));
            }}
            placeholder="Password"
            label="Password"
            type="password"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
