"use client";

import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import { useState } from "react";

export default function Home() {
  //hooks
  const [theme, setTheme] = useState(0);
  const [connected, setConnected] = useState(false);
  const [panel, setPanel] = useState(0);
  return (
    <div
      id="skeleton"
      className="skeleton"
      data-theme={theme == 0 ? "light" : "dark"}
    >
      <Header panel={panel} setPanel={setPanel} theme={theme} />
      <div id="mainboard"></div>
      <Navigation
        theme={theme}
        toggleTheme={() => setTheme(theme == 0 ? 1 : 0)}
      />
    </div>
  );
}