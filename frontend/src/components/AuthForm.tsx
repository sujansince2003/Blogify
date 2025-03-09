import { Link, useNavigate } from "react-router-dom";
import { signupType } from "@sujansince2003/blogifycommon";
import type { ChangeEvent } from "react";
import { useState } from "react";
import API from "../axiosInstance";

const AuthForm = ({ type }: { type: "login" | "signup" }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<signupType>({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  async function handleAuthRequest() {
    if (loading) return;
    try {
      setLoading(true);
      const res = await API.post(
        `/user/${type === "login" ? "signin" : "signup"}`,
        formData
      );
      const apiData = await res.data;
      const token = apiData.token;
      localStorage.setItem("token", token);
      setLoading(false);
      navigate("/blogs");
    } catch (error) {
      console.log(error);
      alert("something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className=" h-screen flex justify-center items-center flex-col">
      <div className=" flex flex-col gap-3">
        <div className=" flex flex-col justify-center items-center gap-2">
          <h1 className="text-3xl font-bold">
            {type === "login" ? "Login to Account" : "Create an Account"}
          </h1>
          <p className="text-slate-500">
            {type === "login"
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            {type === "login" ? (
              <Link to={"/signup"} className="text-red-500">
                Signup
              </Link>
            ) : (
              <Link to={"/login"} className="text-red-500">
                Login
              </Link>
            )}
          </p>
        </div>
        <form className="flex flex-col gap-2 mt-8 md:w-[400px]  ">
          <InputComp
            label="Username"
            type="text"
            placeholder="Enter username"
            handleChange={(e) =>
              setFormData((prev) => {
                return {
                  ...prev,
                  username: e.target.value,
                };
              })
            }
          />
          <InputComp
            label="Email"
            type="email"
            placeholder="Enter Email"
            handleChange={(e) =>
              setFormData((prev) => {
                return {
                  ...prev,
                  email: e.target.value,
                };
              })
            }
          />

          <InputComp
            label="Password"
            type="password"
            placeholder="Enter Password"
            handleChange={(e) =>
              setFormData((prev) => {
                return {
                  ...prev,
                  password: e.target.value,
                };
              })
            }
          />

          <button
            disabled={loading}
            onClick={handleAuthRequest}
            type="button"
            className=" text-white rounded-md bg-black p-2 my-2"
          >
            {loading ? "Processing..." : type === "login" ? "Login" : "Signup"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;

interface InputCompProps {
  label: string;
  type: string;
  placeholder: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function InputComp({ label, type, placeholder, handleChange }: InputCompProps) {
  return (
    <>
      <label className="font-medium" htmlFor="username">
        {" "}
        {label}
      </label>
      <input
        className=" p-1.5 rounded-md  border-2 border-gray-100"
        type={type}
        placeholder={placeholder}
        onChange={handleChange}
      />
    </>
  );
}
