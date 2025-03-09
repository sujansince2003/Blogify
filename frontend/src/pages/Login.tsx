import { AuthQuote, AuthForm } from "../components";

const Login = () => {
  return (
    <div className="md:grid grid-cols-2">
      <AuthForm type="login" />
      <AuthQuote />
    </div>
  );
};

export default Login;
