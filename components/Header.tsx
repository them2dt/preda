import React, { useState } from "react";
import { motion as m } from "framer-motion";
import Link from "next/link";
import { Tooltip } from "@mui/material";

export default function Header({
  id,
  theme,
  setId,
}: {
  id: number;
  theme: number;
  setId: Function;
}) {
  const labels = ["NFT", "PNFT", "Merkle Tree", "CNFT", "SPL22", "Gallery"];
  return (
    <>
      <m.div
        id="header"
        className="header flex-row-between-center"
        data-theme={theme == 0 ? "light" : "dark"}
      >
        <m.div className="logo font-h4">
          <Link href={"/"}>Preda</Link>
        </m.div>
        <div className="flex-row-center-center">
          {labels.map((item, index) => (
            <button
              className={id == index ? "operator active" : "operator"}
              onClick={() => {
                
                setId(id);
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </m.div>
    </>
  );
}
