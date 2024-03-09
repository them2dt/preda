import React, { useState } from "react";
import { motion as m } from "framer-motion";
import Link from "next/link";

export default function Header({ id, theme }: { id: number; theme: number }) {
  const labels = ["Laboratory", "Gallery"];
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
        <m.div
          className="operator font-text-tiny"
          onClick={() => {
            if (id == 0) {
              window.location.href = "/gallery";
            } else {
              window.location.href = "/lab";
            }
          }}
        >
          {labels[id]}
        </m.div>
      </m.div>
    </>
  );
}
