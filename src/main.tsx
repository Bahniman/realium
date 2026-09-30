import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MotionConfig } from "framer-motion";
import "./styles.css";
import LandingPage from "./page";
import { SuiteMotion } from "./components/suite-motion";
import "./riso-motion.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <LandingPage />
      <SuiteMotion />
    </MotionConfig>
  </StrictMode>,
);
