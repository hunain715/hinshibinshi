import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SignUpForm from "@/components/SignUpForm";
import WhatsAppButton from "@/components/WhatsAppButton";

/** Wraps customer-facing pages with the site Navbar + Footer + signup form. */
export default function CustomerLayout() {
  const location = useLocation();
  const hideSignup =
    ["/contact", "/cart", "/checkout", "/order-confirmation"].includes(location.pathname) ||
    location.pathname.startsWith("/admin");
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {!hideSignup && <SignUpForm variant="dark" />}
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
