import React, { useState } from "react";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Vision from "./components/Vision";
import Goals from "./components/Goals";
import TerminalSection from "./components/TerminalSection";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import AdminDashboard from "./components/AdminDashboard";
import AdminLogin from "./components/AdminLogin";
import Terminal from "./components/Terminal";

import "./App.css";

export default function App() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [terminalOpen, setTerminalOpen] = useState(false);

  // Check if user has access to dashboard (you can add authentication here later)
  const isDashboardAccessible = window.location.hash === "#admin" || localStorage.getItem('adminAccess') === 'true';

  if ((showDashboard || isDashboardAccessible) && adminUser) {
    return (
      <div className="app-root">
        <div className="fixed inset-0 bg-gradient-to-b from-gray-900 via-blue-900 to-purple-900 -z-10" />
        <AdminDashboard />
      </div>
    );
  }

  if (showDashboard || isDashboardAccessible) {
    return (
      <div className="app-root">
        <div className="fixed inset-0 bg-gradient-to-b from-gray-900 via-blue-900 to-purple-900 -z-10" />
        <AdminLogin onLoginSuccess={setAdminUser} />
      </div>
    );
  }

  return (
    <div className="app-root">
      {/* Simple gradient background instead of shader for now */}
      <div className="fixed inset-0 bg-gradient-to-b from-gray-900 via-blue-900 to-purple-900 -z-10" />
      <Navbar onTerminalOpen={() => setTerminalOpen(true)} />
      
      <main>
        <Hero />
        <Vision />
        <Goals />
        <TerminalSection />
        <Contact />
      </main>
      
      <Footer />
      <Terminal isOpen={terminalOpen} onClose={() => setTerminalOpen(false)} />
    </div>
  );
}
