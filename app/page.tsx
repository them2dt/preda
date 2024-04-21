"use client";
import SidePanel from "@/components/ui/SidePanel";
import { themes } from "@/components/utils/simples";
import { useState } from "react";
export default function Home() {
  const [theme, setTheme] = useState(0);
  return (
    <div
      className="full-page-container flex-row-start-start"
      data-theme={themes[theme]}
    >
      <SidePanel sectionID={0} operationID={0} setTheme={setTheme} />
    </div>
  );
}
