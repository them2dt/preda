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
import MerkleTreePanel from "./panels/MerkleTree";

export default function Home() {
  //hooks
  const [theme, setTheme] = useState(0);
  const [type, setType] = useState(0);
  const [id, setId] = useState(0); //id for the header

  return (
    <motion.div
      id="skeleton"
      className="skeleton"
      data-theme={theme == 0 ? "light" : "dark"}
    >
      <Header id={id} theme={theme} setId={setId} />
      <div id="mainboard" className="flex-row-center-start">
        {type == 0 && <NFTPanel />}
        {type == 1 && <PNFTPanel />}
        {type == 2 && <MerkleTreePanel />}
        {type == 3 && <CNFTPanel />}
        {type == 4 && <SPL22Panel />}
      </div>
      <Navigation
        theme={theme}
        toggleTheme={() => setTheme(theme == 0 ? 1 : 0)}
      />
    </motion.div>
  );
}
