/* eslint-disable @next/next/no-img-element */
import React, { FC, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import Input from "../input";
import Button from "../button";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

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
  const [isLoading, setIsLoading] = useState(false);
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  const signInWithEmail = async () => {
    setIsLoading(true);
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: state.email,
      password: state.password,
    });

    if (data.user || error?.message) {
      setIsLoading(false);

      if (error?.message) {
        toast.error(error.message);
      }

      if (data.user) {
        toast.success("Login success");

        router.push("/dashboard");
      }
    }
  };

  const signUpWithEmail = async () => {
    setIsLoading(true);
    const { data, error } = await supabaseClient.auth.signUp({
      email: state.email,
      password: state.password,
      options: {
        emailRedirectTo:
          process.env.NODE_ENV === "development" ||
          process.env.NODE_ENV === "test"
            ? "http://localhost:3000/verify/"
            : "http://localhost:3000/verify/",
      },
    });

    if (data.user || error?.message) {
      setIsLoading(false);

      if (error?.message) {
        toast.error(error.message);
      }

      if (data.user) {
        toast.success("Success! Please check email for verfication link");
        router.push("/go-to-email");
      }
    }
  };

  const onSubmit = async () => {
    switch (type) {
      case "login":
        await signInWithEmail();
        break;
      case "signup":
        await signUpWithEmail();
        break;
      default:
        await signInWithEmail();
    }
  };

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
          <Button
            className=""
            onClick={onSubmit}
            kind="secondary"
            isLoading={isLoading}
          >
            <span className="text-white">Continue</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
