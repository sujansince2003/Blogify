import { AuthQuote, AuthForm } from "../components";

const SignUp = () => {
  return (
    <div className="md:grid grid-cols-2">
      <AuthForm type="signup" />
      <AuthQuote />
    </div>
  );
};

export default SignUp;
