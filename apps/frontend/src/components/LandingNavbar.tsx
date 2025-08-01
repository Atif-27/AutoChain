"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import useStore from "@/store";
import { LogoutButton } from "@/components/ui/logout-button";

export function LandingNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const userId = useStore((state) => state.userId);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  const AuthButtons = () => {
    if (userId) {
      return (
        <>
          <Link
            href="/dashboard"
            className="relative px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors duration-200 group"
          >
            <span className="relative z-10">Dashboard</span>
            <div className="absolute inset-0 rounded-lg bg-white/0 group-hover:bg-white/5 transition-all duration-200" />
          </Link>
          <LogoutButton 
            variant="ghost" 
            className="relative px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors duration-200 group"
          />
        </>
      );
    }
    return (
      <>
        <Link
          href="/login"
          className="relative px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors duration-200 group"
        >
          <span className="relative z-10">Login</span>
          <div className="absolute inset-0 rounded-lg bg-white/0 group-hover:bg-white/5 transition-all duration-200" />
        </Link>
        <Link
          href="/signup"
          className="relative px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors duration-200 group"
        >
          <span className="relative z-10">Sign Up</span>
          <div className="absolute inset-0 rounded-lg bg-white/0 group-hover:bg-white/5 transition-all duration-200" />
        </Link>
      </>
    );
  };

  const MobileAuthButtons = () => {
    if (userId) {
      return (
        <>
          <Link
            href="/dashboard"
            className="block text-3xl font-light text-white/80 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Dashboard
          </Link>
          <LogoutButton 
            variant="ghost"
            className="block text-3xl font-light text-white/80 hover:text-white transition-colors mt-6"
          />
        </>
      );
    }
    return (
      <>
        <Link
          href="/login"
          className="block text-3xl font-light text-white/80 hover:text-white transition-colors"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="block text-3xl font-light text-white/80 hover:text-white transition-colors"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Sign Up
        </Link>
      </>
    );
  };

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-black/90 backdrop-blur-lg" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="group flex items-center space-x-2">
              <div className="relative">
                <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-teal-500 to-emerald-500 flex items-center justify-center transform transition-transform duration-300 group-hover:scale-105">
                  <span className="font-semibold text-lg text-white">A</span>
                </div>
              </div>
              <span className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                AutoChain
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              <div className="flex items-center">

                <AuthButtons />
              </div>

              {userId && (
                <div className="pl-4">
                  <Link
                    href="/zap/create"
                    className="relative inline-flex items-center justify-center h-9 px-5 before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r before:from-teal-500 before:to-emerald-500 before:transition-all before:duration-300 hover:before:scale-105 hover:before:opacity-90"
                  >
                    <span className="relative z-10 text-sm font-medium text-white">
                      Start Building
                    </span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden relative w-10 h-10 flex items-center justify-center"
            >
              <div
                className={`w-6 flex flex-col items-center space-y-1.5 transition-all duration-300 ${
                  isMobileMenuOpen ? "rotate-180" : ""
                }`}
              >
                <span
                  className={`block h-0.5 bg-white transition-all duration-300 ${
                    isMobileMenuOpen ? "w-6 -rotate-45 translate-y-2" : "w-6"
                  }`}
                />
                <span
                  className={`block h-0.5 bg-white transition-all duration-300 ${
                    isMobileMenuOpen ? "w-6 rotate-45 -translate-y-0" : "w-4"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-500 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/95 backdrop-blur-xl transition-all duration-500 ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          className={`relative h-full flex flex-col justify-center px-8 transition-all duration-500 ${
            isMobileMenuOpen
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0"
          }`}
        >
          <div className="space-y-6">

            <MobileAuthButtons />
            {userId && (
              <Link
                href="/zap/create"
                className="inline-block text-3xl font-normal text-teal-400 hover:text-teal-300 mt-8 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Start Building
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
