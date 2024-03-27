"use client";

import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import { useState } from "react";
import { motion } from "framer-motion";

//panels
import NFTPanel from "./panels/Nft";
import CNFTPanel from "./panels/Cnft";
import PNFTPanel from "./panels/Pnft";
import SPL22Panel from "./panels/Spl22";

export default function Home() {
  //hooks
  const [theme, setTheme] = useState(0);
  const [type, setType] = useState(0);

  const typeLabels = [
    "NFT",
    "PNFT",
    "CNFT",
    "SPL22",
  ];

  return (
    <motion.div
      id="skeleton"
      className="skeleton"
      data-theme={theme == 0 ? "light" : "dark"}
    >
      <Header id={0} theme={theme} />
      <div id="mainboard" className="flex-row-center-center">
        <div className="panel-box flex-column-center-center">
          <motion.div className="type-selector flex-row-center-center">
            <motion.div className="type-options flex-row-center-center">
              {typeLabels.map((label, index) => {
                return (
                  <motion.div
                    key={"to-" + index}
                    className={
                      type == index ? "type-option active" : "type-option"
                    }
                    onClick={() => {
                      setType(index);
                    }}
                  >
                    {label}
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

          {type == 0 && <NFTPanel />}
          {type == 1 && <PNFTPanel />}
          {type == 2 && <CNFTPanel />}
          {type == 3 && <SPL22Panel />}
        </div>
      </div>
      <Navigation
        theme={theme}
        toggleTheme={() => setTheme(theme == 0 ? 1 : 0)}
      />
    </motion.div>
  );
}
