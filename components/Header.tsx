import React, { useState } from "react";
import { motion as m } from "framer-motion";

export default function Header({
  panel,
  setPanel,
  theme,
}: {
  panel: number;
  setPanel: Function;
  theme: number;
}) {
  const labels = ["Lab", "Gallery"];
  const [page, setPage] = useState(0);

  return (
    <>
      <m.div
        id="header"
        className="header flex-row-between-center"
        data-theme={theme == 0 ? "light" : "dark"}
      >
        <m.div className="logo font-h4">Preda</m.div>
        <m.div
          className="operator font-text-tiny"
          onClick={() => {
            if (page == 0) {
              setPage(1);
            } else {
              setPage(0);
            }
          }}
        >
          {labels[page]}
        </m.div>
      </m.div>
    </>
  );
}
