"use client";
import { UserLogin } from "@/service/api/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await UserLogin(email, password);

      if (!response || !response.accessToken) {
        throw new Error("Invalid response from server");
      }

      const { accessToken, username, major_id, is_admin } = response;
      sessionStorage.setItem(
        "user",
        JSON.stringify({ accessToken, username, major_id, is_admin })
      );

      if (response.is_admin) {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error during login:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="mx-auto w-full max-w-lg rounded-md bg-white bg-opacity-40 p-6 shadow-md">
        <div>
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-4 text-[#353535] md:mb-0 md:mr-10">
              <p className="text-base font-normal md:text-lg">
                Hello, PresUniver Staff!
              </p>
              <p className="text-lg font-semibold md:text-2xl">
                Let’s Sign In Folks
              </p>
            </div>
          </div>
          <div className="my-4">
            <div className="border-t border-[#D1D5DB]"></div>
          </div>
        </div>
        <form onSubmit={handleLogin}>
          <div className="mt-8">
            <div className="relative flex items-center">
              <span className="absolute"></span>
              <input
                type="email"
                className="block w-full rounded-lg border bg-white px-6 py-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-blue-300 md:px-10"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4">
            <div className="relative flex items-center">
              <span className="absolute"></span>
              <input
                type="password"
                className="block w-full rounded-lg border bg-white px-6 py-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-blue-300 md:px-10"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {errorMessage && (
            <div className="mt-4 text-center text-red-500">
              <p>{errorMessage}</p>
            </div>
          )}

          <div className="mt-6">
            <button
              type="submit"
              className={`w-full transform rounded-lg border border-[#6B7280] bg-white px-6 py-3 text-sm font-medium capitalize tracking-wide text-[#6B7280] transition-colors duration-300 hover:bg-[#6B7280] hover:text-white ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <h1 className="pt-1 text-center font-[400] text-[#ef5151] text-[0.875] md:pt-3">
              <Link href="/auth/forgot-password">Forgot password?</Link>
            </h1>
          </div>
        </form>
      </div>
    </section>
  );
}
