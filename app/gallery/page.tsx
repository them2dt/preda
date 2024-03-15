"use client";

import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCopy,
  faEllipsis,
  faRotateLeft,
  faFireFlameCurved,
} from "@fortawesome/free-solid-svg-icons";
import { loadNFTs } from "@/backend/General";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { enqueueSnackbar } from "notistack";
import { Tooltip } from "@mui/material";

export default function Home() {
  const walletParent = useWallet();
  const { wallet } = useWallet();
  const { connection } = useConnection();
  //hooks
  const [theme, setTheme] = useState(0);

  const [nftItems, setnftItems] = useState<
    {
      name: string;
      mint: string;
      imageUri: string;
      updateAuthority: string;
      attributes: { trait_type: string; value: string }[];
      tokenStandard: string;
    }[]
  >([]);

  async function loadAssets() {
    if (wallet) {
      setTimeout(() => {
        console.log("waiting...");
      }, 500);
      if (wallet.adapter.connected) {
        if (wallet.adapter.publicKey) {
          const result = await loadNFTs({
            wallet: wallet.adapter.publicKey.toBase58(),
            endpoint: connection.rpcEndpoint,
          })
            .then((response) => setnftItems(response))
            .catch((err) => enqueueSnackbar(err, { variant: "error" }));
        } else {
          enqueueSnackbar("Pubkey not found", { variant: "error" });
        }
      } else {
        enqueueSnackbar("Wallet not connected", { variant: "error" });
      }
    } else {
      enqueueSnackbar("Wallet not found", { variant: "error" });
    }
  }
  useEffect(() => {
    async function loadAssets() {
      if (wallet) {
        setTimeout(() => {
          console.log("waiting...");
        }, 500);
        if (wallet.adapter.connected) {
          if (wallet.adapter.publicKey) {
            const result = await loadNFTs({
              wallet: wallet.adapter.publicKey.toBase58(),
              endpoint: connection.rpcEndpoint,
            });
            setnftItems(result);
          } else {
            enqueueSnackbar("Pubkey not found", { variant: "error" });
          }
        } else {
          enqueueSnackbar("Wallet not connected", { variant: "error" });
        }
      } else {
        enqueueSnackbar("Wallet not found", { variant: "error" });
      }
    }

    loadAssets().catch(console.error);
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
            <button
              className="view-type flex-row-center-center font-text"
              onClick={loadAssets}
            >
              <FontAwesomeIcon icon={faRotateLeft} />
            </button>
          </div>
        </div>
        <div className="gallery-container flex-row-start-start">
          {nftItems.map((item, index) => (
            <div className="gallery-item flex-column-center-center" key={index}>
              <div className="gallery-image">
                <img src={item.imageUri} alt="couldn't find the image" />
              </div>
              <div className="gallery-info">
                <div className="gallery-title font-text-small-bold">
                  {item.name}
                </div>
                <div className="gallery-supply font-text-small">
                  {item.mint[0] +
                    item.mint[1] +
                    item.mint[2] +
                    "..." +
                    item.mint[item.mint.length - 3] +
                    item.mint[item.mint.length - 2] +
                    item.mint[item.mint.length - 1]}
                </div>
              </div>
              <div className="gallery-operations first flex-row-between-center">
                <Tooltip title="Duplicate" arrow>
                  <div className="gallery-operation flex-row-center-center">
                    <FontAwesomeIcon icon={faCopy} />
                  </div>
                </Tooltip>
                <div className="gallery-operation flex-row-center-center">
                  <FontAwesomeIcon icon={faEllipsis} />
                </div>

                <Tooltip title="Burn" arrow>
                  <div className="gallery-operation flex-row-center-center">
                    <FontAwesomeIcon icon={faFireFlameCurved} />
                  </div>
                </Tooltip>
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
