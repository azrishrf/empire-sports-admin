"use client";

import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

export default function AOSProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    AOS.init({
      duration: 400,
      easing: "ease-out-cubic",
      once: true,
      offset: 100,
    });
  }, []);

  return <>{children}</>;
}
