"use client";

import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import { useState } from "react";
import { motion } from "framer-motion";

//panels
import NFTPanel from "./panels/Nft";
import CNFTPanel from "./panels/Cnft";
import PNFTPanel from "./panels/Pnft";
import SPL20Panel from "./panels/Spl20";
import Token2022Panel from "./panels/Token2022";

export default function Home() {
  //hooks
  const [theme, setTheme] = useState(0);
  const [type, setType] = useState(0);

  const typeLabels = ["NFT", "pNFT", "cNFT", "SPL-20", "Token2022"];

  return (
    <motion.div
      id="skeleton"
      className="skeleton"
      data-theme={theme == 0 ? "light" : "dark"}
    >
      <Header id={0} theme={theme} />
      <div id="mainboard" className="flex-row-center-center">
        <div className="flex-row-center-start">
          <motion.div
            className="type-selector flex-column-center-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <motion.div className="type-options flex-column-center-start">
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
          {type == 1 && <CNFTPanel />}
          {type == 2 && <PNFTPanel />}
          {type == 3 && <SPL20Panel />}
          {type == 4 && <Token2022Panel />}
        </div>
      </div>
      <Navigation
        theme={theme}
        toggleTheme={() => setTheme(theme == 0 ? 1 : 0)}
      />
    </motion.div>
  );
}
