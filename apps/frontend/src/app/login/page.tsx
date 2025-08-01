"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useStore from "@/store";
import axiosInstance from "@/utils/axiosInstance";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SigninSchema } from "@repo/zod-schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AxiosError } from "axios";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const updateUserDetails = useStore((state) => state.updateUserDetails);
  const userId = useStore((state) => state.userId);

  // Redirect if already logged in
  useEffect(() => {
    if (userId) {
      console.log("Already logged in, redirecting to dashboard");
      router.push("/dashboard");
    }
  }, [userId, router]);

  const signinForm = useForm<z.infer<typeof SigninSchema>>({
    resolver: zodResolver(SigninSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof SigninSchema>) {
    try {
      setLoading(true);
      setError("");
      const { email, password } = values;

      console.log("Attempting login...");
      const res = await axiosInstance.post(`/api/v1/user/signin`, {
        email,
        password,
      });

      const { userId, accessToken, verify } = res.data.data;
      console.log("Login successful:", {
        userId,
        hasAccessToken: !!accessToken,
      });

      // Update store first
      updateUserDetails(userId, accessToken);
      signinForm.reset();

      // Then handle navigation
      if (verify === false) {
        console.log("Redirecting to verify page");
        router.push(`/verify/${userId}`);
      } else {
        const redirectTo = searchParams.get("redirect");
        console.log("Redirecting after login:", redirectTo || "/dashboard");
        router.push(redirectTo || "/dashboard");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Login error:", error);
        setError(
          error.response?.data?.message || "An error occurred during login"
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 p-8">
        {/* Left side - Branding */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start mb-6">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-tr from-teal-500 to-emerald-500 flex items-center justify-center">
              <span className="font-semibold text-2xl text-white">A</span>
            </div>
            <span className="ml-3 text-2xl font-medium text-white">
              AutoChain
            </span>
          </div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-emerald-400 mb-4">
            Welcome Back
          </h2>
          <p className="text-gray-400 text-lg mb-6">
            Build powerful automation workflows with AutoChain&apos;s intuitive
            platform. Connect your apps and automate your work in minutes.
          </p>
          <div className="hidden md:block">
            <Link
              href="/signup"
              className="inline-flex items-center text-sm text-white/70 hover:text-white transition-colors"
            >
              Don&apos;t have an account?
              <span className="ml-2 text-teal-400 hover:text-teal-300">
                Sign up
              </span>
            </Link>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full md:w-1/2">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 shadow-2xl">
            <Form {...signinForm}>
              <form
                onSubmit={signinForm.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <h3 className="text-xl font-medium text-white mb-6">
                  Sign in to your account
                </h3>

                {error && (
                  <div className="text-red-400 text-sm mb-4">{error}</div>
                )}

                <FormField
                  control={signinForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/70">Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          className="bg-white/10 border-white/10 text-white placeholder:text-white/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signinForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/70">Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          className="bg-white/10 border-white/10 text-white placeholder:text-white/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full relative inline-flex items-center justify-center h-11 before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r before:from-teal-500 before:to-emerald-500 before:transition-all before:duration-300 hover:before:scale-105 hover:before:opacity-90"
                >
                  <span className="relative z-10 text-sm font-medium text-white">
                    {loading ? "Signing in..." : "Sign in"}
                  </span>
                </Button>

                <div className="flex items-center justify-between pt-4">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-teal-400 hover:text-teal-300 transition-colors"
                  >
                    Forgot your password?
                  </Link>
                  <div className="md:hidden">
                    <Link
                      href="/signup"
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      Create account
                    </Link>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Login />
    </Suspense>
  );
};

export default LoginPage;
