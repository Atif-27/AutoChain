"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SignupSchema } from "@repo/zod-schemas";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const Signup = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const signupForm = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof SignupSchema>) {
    try {
      setLoading(true);
      const { email, password, name } = values;

      const res = await axiosInstance.post(`/api/v1/user/signup`, {
        email,
        password,
        name,
      });

      signupForm.reset();
      router.push("/login");
    } catch (error) {
      console.log("Error while creating the user = ", error);
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
            Start Your Automation Journey
          </h2>
          <p className="text-gray-400 text-lg mb-6">
            Join thousands of users who trust AutoChain to streamline their
            workflows. Create powerful automations in minutes.
          </p>
          <div className="hidden md:block">
            <Link
              href="/login"
              className="inline-flex items-center text-sm text-white/70 hover:text-white transition-colors"
            >
              Already have an account?
              <span className="ml-2 text-teal-400 hover:text-teal-300">
                Sign in
              </span>
            </Link>
          </div>
        </div>

        {/* Right side - Signup Form */}
        <div className="w-full md:w-1/2">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 shadow-2xl">
            <Form {...signupForm}>
              <form
                onSubmit={signupForm.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <h3 className="text-xl font-medium text-white mb-6">
                  Create your account
                </h3>

                <FormField
                  control={signupForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/70">Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your full name"
                          className="bg-white/10 border-white/10 text-white placeholder:text-white/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signupForm.control}
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
                  control={signupForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/70">Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Create a strong password"
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
                    {loading ? "Creating account..." : "Create account"}
                  </span>
                </Button>

                <div className="flex items-center justify-between pt-4">
                  <p className="text-sm text-white/50">
                    By signing up, you agree to our Terms and Privacy Policy
                  </p>
                  <div className="md:hidden">
                    <Link
                      href="/login"
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      Sign in
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

export default Signup;
