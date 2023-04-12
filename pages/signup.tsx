import { NextPage } from "next";
import AuthForm from "../components/auth-form";

const Signup: NextPage = () => {
    return (
        <AuthForm type="signup" label="Create your account" />
    )
};

export default Signup;