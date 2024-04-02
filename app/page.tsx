"use client";

import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import { useState } from "react";

//panels
import Panel from "../components/panels/NFT_Create";
export default function Home() {
  //hooks
  const [theme, setTheme] = useState(0);
  const id = 0;

  return (
    <div
      id="skeleton"
      className="skeleton"
      data-theme={theme == 0 ? "light" : "dark"}
    >
      <Header id={id} theme={theme} />
      <div id="mainboard" className="flex-row-center-start">
        <Panel />
      </div>
      <Navigation
        theme={theme}
        toggleTheme={() => setTheme(theme == 0 ? 1 : 0)}
      />
    </div>
  );
}
