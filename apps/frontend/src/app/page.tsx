"use client";

import Link from "next/link";
import { LandingNavbar } from "@/components/LandingNavbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#030014] text-white selection:bg-teal-500/30 selection:text-white overflow-hidden">
      <LandingNavbar />

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 md:pt-40 md:pb-24">
        {/* Background Effects */}
        <div className="absolute inset-0">
          {/* Main gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(2,0,36,0)_0,#030014_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,211,182,0.15)_0,rgba(0,0,0,0)_65%)]" />

          {/* Animated gradient spots */}
          <div
            className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/30 rounded-full blur-[120px] animate-pulse"
            style={{ animationDuration: "5s" }}
          />
          <div
            className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/30 rounded-full blur-[120px] animate-pulse"
            style={{ animationDuration: "7s" }}
          />

          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        </div>

        {/* Content */}
        <div className="relative">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="relative inline-block group">
                <h1 className="text-4xl font-medium tracking-tight sm:text-6xl bg-gradient-to-b from-white to-white/80 bg-clip-text text-transparent pb-4 ">
                  Automate Your Workflow with Powerful Chains
                </h1>
              </div>
              <p className="mt-6 text-lg leading-8 text-white/60">
                Connect your tools and automate your workflow with webhooks and
                Gmail integration. Build powerful automation chains that work
                while you sleep.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href="/zap/create"
                  className="group relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-black hover:scale-105 transition-transform duration-300"
                >
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#14D3B6_0%,#059669_50%,#14D3B6_100%)] group-hover:bg-[conic-gradient(from_90deg_at_50%_50%,#14D3B6_0%,#10B981_50%,#14D3B6_100%)]" />
                  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-black px-8 py-1 text-sm font-medium text-white backdrop-blur-3xl transition-colors duration-300 group-hover:bg-black/80">
                    Start Building
                  </span>
                </Link>
                <Link
                  href="#features"
                  className="group text-sm font-semibold leading-6 text-white/80 hover:text-white relative"
                >
                  Learn more{" "}
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-300 group-hover:w-full" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div
          className="absolute top-1/4 left-0 w-4 h-4 bg-teal-500 rounded-full animate-float"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-2 h-2 bg-emerald-500 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-teal-400 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Add animation keyframes to global styles */}
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      {/* Bento Grid Features */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[240px]">
          {/* Webhook Feature */}
          <div className="relative col-span-1 row-span-1 rounded-3xl bg-gradient-to-b from-white/[0.07] to-transparent p-8 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            <div className="relative h-full flex flex-col">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-2xl bg-teal-500/10 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-teal-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white">
                  Webhook Triggers
                </h3>
              </div>
              <p className="mt-4 text-sm text-white/60 leading-relaxed">
                Receive real-time data from any service that can make HTTP
                requests. Perfect for event-driven automation.
              </p>
              <div className="mt-auto">
                <span className="inline-flex items-center text-sm text-teal-500">
                  Available Now
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          {/* Gmail Feature */}
          <div className="relative col-span-1 row-span-1 rounded-3xl bg-gradient-to-b from-white/[0.07] to-transparent p-8 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            <div className="relative h-full flex flex-col">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-emerald-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white">
                  Gmail Actions
                </h3>
              </div>
              <p className="mt-4 text-sm text-white/60 leading-relaxed">
                Send and manage emails through Gmail integration. Create
                powerful email automation workflows.
              </p>
              <div className="mt-auto">
                <span className="inline-flex items-center text-sm text-emerald-500">
                  Available Now
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          {/* Coming Soon - Large Feature */}
          <div className="relative col-span-1 lg:col-span-1 row-span-2 rounded-3xl bg-gradient-to-b from-white/[0.07] to-transparent p-8 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            <div className="relative h-full flex flex-col">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-purple-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white">
                  More Integrations
                </h3>
              </div>
              <p className="mt-4 text-sm text-white/60 leading-relaxed">
                We&#39; re working on bringing more powerful integrations to
                AutoChain. Soon you&#39; ll be able to connect with:
              </p>
              <ul className="mt-6 space-y-4 text-sm text-white/60">
                <li className="flex items-center space-x-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                  <span>Slack & Discord Integration</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                  <span>Scheduled Triggers & Cron Jobs</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                  <span>GitHub & GitLab Workflows</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                  <span>Custom API Integration</span>
                </li>
              </ul>
              <div className="mt-auto">
                <span className="inline-flex items-center text-sm text-purple-500">
                  Coming Soon
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          {/* Example Workflow */}
          <div className="relative col-span-1 md:col-span-2 row-span-1 rounded-3xl bg-gradient-to-b from-white/[0.07] to-transparent p-8 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            <div className="relative h-full">
              <h3 className="text-lg font-medium text-white mb-4">
                Example Workflow
              </h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="h-10 w-10 rounded-xl bg-teal-500/10 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-teal-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm text-white/60">Webhook</span>
                </div>
                <svg
                  className="w-5 h-5 text-white/40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                <div className="flex items-center space-x-2">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-emerald-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm text-white/60">Gmail</span>
                </div>
              </div>
              <p className="mt-4 text-sm text-white/60">
                Automatically send email notifications when your webhook
                endpoint receives data. Perfect for notifications, alerts, and
                automated responses.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-20">
          <div className="relative isolate overflow-hidden bg-gradient-to-b from-white/[0.07] to-transparent rounded-3xl px-6 py-24 text-center sm:px-12 xl:px-24">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-3xl font-medium tracking-tight text-white sm:text-4xl">
                Ready to Automate Your Workflow?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/60">
                Start building your automation chains today. No credit card
                required.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href="/zap/create"
                  className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-black"
                >
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#14D3B6_0%,#059669_50%,#14D3B6_100%)]" />
                  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-black px-8 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                    Start Building for Free
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
