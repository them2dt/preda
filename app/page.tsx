"use client";

import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import { useState } from "react";
import { motion } from "framer-motion";

//panels
import CreateNFTPanel from "../panels/nft/Create";

export default function Home() {
  //hooks
  const [theme, setTheme] = useState(0);
  const [connected, setConnected] = useState(false);
  const [panel, setPanel] = useState(0);
  const [operation, setOperation] = useState(0);
  const [operationDrop, setOperationDrop] = useState(false);
  const [type, setType] = useState(0);
  const [typeDrop, setTypeDrop] = useState(true);

  const operationLabels = ["create", "edit", "burn"];
  const typeLabels = [
    "NFT",
    "pNFT",
    "cNFT",
    "SPL-20",
    "Token2022",
    "Token extension",
  ];

  return (
    <motion.div
      id="skeleton"
      className="skeleton"
      data-theme={theme == 0 ? "light" : "dark"}
    >
      <Header panel={panel} setPanel={setPanel} theme={theme} />
      <div id="mainboard" className="flex-row-center-center">
        <div className="flex-row-center-start">
          <motion.div className="type-selector flex-column-center-start">
            <motion.div className="type-options flex-column-center-start">
              {typeLabels.map((label, index) => {
                return (
                  <motion.div
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

          <CreateNFTPanel />
        </div>
      </div>
      <Navigation
        theme={theme}
        toggleTheme={() => setTheme(theme == 0 ? 1 : 0)}
      />
    </motion.div>
  );
}
