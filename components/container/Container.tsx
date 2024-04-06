"use client";
import Header from "../Header";
import Navigation from "../Navigation";
import React, { useState } from "react";
//Container to wrap all elements of a page into a container.

export default function Container({
  id,
  panel,
}: {
  id: number;
  panel: React.JSX.Element;
}) {
  const themes = ["light", "dark", "candy", "navy"];
  const [theme, setTheme] = useState(0);
  return (
    <div>
      <div id="skeleton" className="skeleton" data-theme={themes[theme]}>
        <Header id={id} theme={theme} themes={themes} />
        <div id="mainboard" className="flex-row-center-start">
          {panel}
        </div>
        <Navigation
          theme={theme}
          themes={themes}
          toggleTheme={(themeIdParameter: number) => setTheme(themeIdParameter)}
        />
      </div>
      <div className="skeleton-mobile flex-row-center-center">
        <div className="font-text">
          Have patience, while we work on the mobile version.
        </div>
      </div>
    </div>
  );
}
