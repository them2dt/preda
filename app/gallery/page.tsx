"use client";

import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCubes,
  faEllipsis,
  faListDots,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { loadNFTs } from "@/backend/General";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

export default function Home() {
  const walletParent = useWallet();
  const { wallet } = useWallet();
  const { connection } = useConnection();
  //hooks
  const [theme, setTheme] = useState(0);

  const [nftItems, setnftItems] = useState<
    { imageUri: String; name: string; supply: number; pubkey: string }[]
  >([]);

  useEffect(() => {
    if (wallet) {
      loadNFTs({ wallet: wallet, endpoint: "https://api.devnet.solana.com" });
    }
  }, [walletParent.connected]);
  return (
    <motion.div
      id="skeleton"
      className="skeleton"
      data-theme={theme == 0 ? "light" : "dark"}
    >
      <Header id={1} theme={theme} />
      <div id="gallery" className="flex-column-center-center">
        <div className="gallery-header flex-row-between-center">
          <div className="token-types flex-row-center-center">
            <div className="token-type flex-row-center-center font-text">
              NFT's
            </div>
            <div className="token-type flex-row-center-center font-text">
              SPL's
            </div>
          </div>
          <div className="view-types flex-row-center-center">
            <div className="view-type flex-row-center-center font-text">
              Gallery
            </div>
            <div className="view-type flex-row-center-center font-text">
              List
            </div>
          </div>
        </div>
        <div className="gallery-container flex-row-center-start">
          {nftItems.map((item, index) => (
            <div className="gallery-item flex-column-center-center" key={index}>
              <div className="gallery-image"></div>
              <div className="gallery-info">
                <div className="gallery-title font-text-small-bold">
                  {item.name}
                </div>
                <div className="gallery-supply font-text-small">
                  {item.supply}
                </div>
              </div>
              <div className="gallery-operations first flex-row-between-center">
                <div className="gallery-operation flex-row-center-center">
                  <FontAwesomeIcon icon={faPlus} />
                </div>
                <div className="gallery-operation flex-row-center-center">
                  <FontAwesomeIcon icon={faEllipsis} />
                </div>

                <div className="gallery-operation first flex-row-center-center">
                  <FontAwesomeIcon icon={faMinus} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Navigation
        theme={theme}
        toggleTheme={() => setTheme(theme == 0 ? 1 : 0)}
      />
    </motion.div>
  );
}
