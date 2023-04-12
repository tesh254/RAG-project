import { NextPage } from "next";
import AuthForm from "../components/auth-form";

const Login: NextPage = () => {
    return (
        <AuthForm type="login" label="Login to your account" />
    )
};

export default Login;