import React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft, PawPrint } from "lucide-react";

import Nav from "../components/Nav";

const NotFound = () => {
  return (
    <div
      className="min-h-screen w-full bg-[#FAF6F2] text-[#2B2730]"
      style={{
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* NAVBAR */}
      <Nav />

      {/* CONTENT */}
      <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-5 py-16">
        <div className="mx-auto w-full max-w-2xl text-center">

          {/* ICON */}
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#DC8E90]/15">
            <PawPrint
              size={42}
              strokeWidth={1.8}
              className="text-[#DC8E90]"
            />
          </div>

          {/* 404 */}
          <p className="mt-8 text-7xl font-black tracking-tight text-[#DC8E90] sm:text-8xl">
            404
          </p>

          {/* TITLE */}
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#2B2730] sm:text-4xl">
            Oops! This page wandered off.
          </h1>

          {/* DESCRIPTION */}
          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#58545F] sm:text-base font-medium">
            Looks like the page you're looking for doesn't exist or may have
            been moved. Let's get you back to FurEver.
          </p>

          {/* BUTTONS */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">

            <Link
              to="/"
              className="
                inline-flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-2xl
                bg-[#58545F]
                hover:bg-[#2B2730]
                px-6
                py-3.5
                text-sm
                font-bold
                text-white
                transition-all
                duration-200
                hover:-translate-y-0.5
                shadow-xs
                sm:w-auto
              "
            >
              <Home size={17} />
              Back to Home
            </Link>

            <button
              type="button"
              onClick={() => window.history.back()}
              className="
                inline-flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-2xl
                border
                border-[#EDE4DD]
                bg-white
                px-6
                py-3.5
                text-sm
                font-bold
                text-[#58545F]
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:border-[#DC8E90]
                hover:bg-[#FAF6F2]
                hover:text-[#DC8E90]
                sm:w-auto
              "
            >
              <ArrowLeft size={17} />
              Go Back
            </button>

          </div>

          {/* BRAND MESSAGE */}
          <p className="mt-10 text-xs font-medium text-[#7E7785]">
            FurEver · Made with love for every paw
          </p>

        </div>
      </main>
    </div>
  );
};

export default NotFound;