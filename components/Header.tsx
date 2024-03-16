import React, { useState } from "react";
import { motion as m } from "framer-motion";
import Link from "next/link";
import { Tooltip } from "@mui/material";

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
        {id == 0 && (
          <Tooltip title={"Click to go to the " + labels[1]} placement="bottom">
            <m.div
              className="operator font-text-tiny"
              onClick={() => {
                window.location.href = "/gallery";
              }}
            >
              {labels[id]}
            </m.div>
          </Tooltip>
        )}
        {id == 1 && (
          <Tooltip title={"Click to go to the " + labels[0]} placement="bottom">
            <m.div
              className="operator font-text-tiny"
              onClick={() => {
                window.location.href = "/lab";
              }}
            >
              {labels[id]}
            </m.div>
          </Tooltip>
        )}
      </m.div>
    </>
  );
}
