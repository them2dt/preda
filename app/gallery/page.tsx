"use client";

import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCopy,
  faEllipsis,
  faRotateLeft,
  faFireFlameCurved,
  faClose,
  faPaperPlane,
  faImage,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { loadNFTs } from "@/backend/General";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { enqueueSnackbar } from "notistack";
import { Tooltip } from "@mui/material";
import Link from "next/link";
import SingleItemView from "../../components/SingleItemView";
import { DasApiAssetAuthority, DasApiAssetCreator } from "@metaplex-foundation/digital-asset-standard-api";

export default function Home() {
  const walletParent = useWallet();
  const { wallet } = useWallet();
  const { connection } = useConnection();
  //hooks
  const [theme, setTheme] = useState(0);
  const [type, setType] = useState(true); //true for NFTs, false for SPLs
  const [view, setView] = useState(true); //true for gallery, false for list
  const [itemPanel, setItemPanel] = useState(false);
  const [item, setItem] = useState<{
    mint: string;
    name: string;
    description: string;
    imageUri: string;
    attributes: { trait_type: string; value: string }[];
    authorities: DasApiAssetAuthority[];
    compressed: boolean;
    creators: DasApiAssetCreator[];
    royalty: number;
    tokenStandard: string;
    type: string;
  }>();
  const [nftItems, setnftItems] = useState<
    {
      
      mint: string;
      name: string;
      description: string;
      imageUri: string;
      attributes: { trait_type: string; value: string }[];
      authorities: DasApiAssetAuthority[];
      compressed: boolean;
      creators: DasApiAssetCreator[];
      royalty: number;
      tokenStandard: string;
      type: string;
    }[]
  >([]);

  async function loadNonFungibles() {
    if (wallet) {
      setTimeout(() => {
        console.log("waiting...");
      }, 500);
      if (wallet.adapter.connected) {
        if (wallet.adapter.publicKey) {
          await loadNFTs({
            wallet: wallet,
            endpoint: connection.rpcEndpoint,
            limit: 50,
            page: 1,
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

  //TODO: Implement the burnAsset function
  //note: the asset which should be burned can be a NFT,PNFT,CNFT,SPL. So you probably need to pass the asset type as a parameter.
  async function burnAsset(address: string) {
    console.log("burning asset " + address);
  }
  useEffect(() => {
    loadNonFungibles().catch(console.error);
  }, [walletParent.connected]);

  useEffect(() => {
    if (walletParent.connected) {
      loadNonFungibles();
    } else {
      setnftItems([]);
    }
  }, [walletParent.connected]);
  return (
    <>
      <AnimatePresence>
        <motion.div
          id="skeleton"
          className="skeleton"
          data-theme={theme == 0 ? "light" : "dark"}
        >
          <Header id={5} theme={theme} />
          <div id="gallery" className="flex-column-center-center">
            <motion.div
              className="gallery-header flex-row-between-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="token-types flex-row-center-center">
                <button
                  className={
                    type
                      ? "token-type active flex-row-center-center font-text"
                      : "token-type flex-row-center-center font-text"
                  }
                  onClick={() => {
                    setType(true);
                    loadNonFungibles();
                  }}
                >
                  NFTs
                </button>
                <button
                  className={
                    !type
                      ? "token-type active flex-row-center-center font-text"
                      : "token-type flex-row-center-center font-text"
                  }
                  onClick={async () => {
                    setType(false);
                  }}
                >
                  SPLs
                </button>
              </div>
              <div className="view-types flex-row-center-center">
                <button
                  className={
                    view
                      ? "view-type active flex-row-center-center font-text"
                      : "view-type flex-row-center-center font-text"
                  }
                  onClick={() => {
                    setView(true);
                  }}
                >
                  <FontAwesomeIcon icon={faImage} />
                </button>
                <button
                  className={
                    !view
                      ? "view-type active flex-row-center-center font-text"
                      : "view-type flex-row-center-center font-text"
                  }
                  onClick={() => {
                    setView(false);
                  }}
                >
                  <FontAwesomeIcon icon={faBars} />
                </button>
                <button
                  className="view-type flex-row-center-center font-text"
                  onClick={
                    async () => {
                      if (walletParent.publicKey) {
                      } else
                        console.log(
                          "Wallet not connected. Please connect your wallet."
                        );
                    }
                    /* type ? loadAssets : () => {console.log("Loading SPLs");} */
                  }
                >
                  <FontAwesomeIcon icon={faRotateLeft} />
                </button>
              </div>
            </motion.div>
            {view && type && nftItems.length > 0 && walletParent.connected && (
              <div className="gallery-container flex-row-center-start">
                {nftItems.map((item, index) => (
                  <motion.div
                    className="gallery-item flex-column-center-center"
                    key={index}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.2,
                      delay: index * 0.1 < 1 ? index * 0.1 : 0.4,
                    }}
                  >
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
                        <button className="gallery-operation flex-row-center-center">
                          <FontAwesomeIcon icon={faCopy} />
                        </button>
                      </Tooltip>
                      <button
                        className="gallery-operation flex-row-center-center"
                        onClick={() => {
                          setItem(item);
                          setItemPanel(true);
                        }}
                      >
                        <FontAwesomeIcon icon={faEllipsis} />
                      </button>

                      <Tooltip title="Burn" arrow>
                        <button
                          className="gallery-operation flex-row-center-center"
                          onClick={() => {
                            burnAsset(item.mint);
                          }}
                        >
                          <FontAwesomeIcon icon={faFireFlameCurved} />
                        </button>
                      </Tooltip>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            {!view && type && nftItems.length > 0 && walletParent.connected && (
              <div className="gallery-container list flex-column-start-center">
                {nftItems.map((item, index) => (
                  <motion.div
                    className="list-item flex-row-between-center"
                    key={index}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.2,
                      delay: index * 0.1 < 1 ? index * 0.1 : 0.4,
                    }}
                  >
                    <div className="left flex-row-start-center">
                      <div className="image flex-row-center-center">
                        <img
                          src={item.imageUri}
                          alt="couldn't find the image"
                        />
                      </div>
                      <div className="info flex-column-center-start">
                        <div className="title font-text-small">
                          {"Metaplex Standard NFT"}
                        </div>
                        <div className="title font-h4">{item.name}</div>
                        <div className="additional-details flex-row-center-center">
                          <div className="additional-detail flex-row-center-center">
                            <div className="detail-key font-text-tiny-bold">
                              Frozen
                            </div>
                            <div className="detail-line"></div>
                            <div className="detail-value font-text-tiny">
                              true
                            </div>
                          </div>
                          <div className="additional-detail flex-row-center-center">
                            <div className="detail-key font-text-tiny-bold">
                              Frozen
                            </div>
                            <div className="detail-line"></div>
                            <div className="detail-value font-text-tiny">
                              true
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="operations flex-column-center-center">
                      <Tooltip title="Duplicate" arrow>
                        <button className="operation flex-row-center-center">
                          <FontAwesomeIcon icon={faCopy} />
                        </button>
                      </Tooltip>
                      <Tooltip title="Duplicate" arrow>
                        <button className="operation flex-row-center-center">
                          <FontAwesomeIcon icon={faFireFlameCurved} />
                        </button>
                      </Tooltip>
                      <Tooltip title="Duplicate" arrow>
                        <button className="operation flex-row-center-center">
                          <FontAwesomeIcon icon={faPaperPlane} />
                        </button>
                      </Tooltip>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            {type && nftItems.length == 0 && walletParent.connected && (
              <div className="gallery-container flex-row-center-center">
                <div className="gallery-empty font-text-small">
                  No NFTs found in your wallet.
                </div>
              </div>
            )}
            {type && walletParent.connected == false && (
              <div className="gallery-container flex-row-center-center">
                <div className="gallery-empty font-text-small">
                  Connect your wallet to see your assets.
                </div>
              </div>
            )}
            {!type && (
              <div className="gallery-container flex-row-center-center">
                {nftItems.map((item, index) => (
                  <motion.div
                    className="gallery-item flex-column-center-center"
                    key={index}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.2,
                      delay: index * 0.1 < 1 ? index * 0.1 : 0.4,
                    }}
                  >
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
                        <button className="gallery-operation flex-row-center-center">
                          <FontAwesomeIcon icon={faCopy} />
                        </button>
                      </Tooltip>
                      <button
                        className="gallery-operation flex-row-center-center"
                        onClick={() => {
                          setItem(item);
                          setItemPanel(true);
                        }}
                      >
                        <FontAwesomeIcon icon={faEllipsis} />
                      </button>

                      <Tooltip title="Burn" arrow>
                        <button className="gallery-operation flex-row-center-center">
                          <FontAwesomeIcon icon={faFireFlameCurved} />
                        </button>
                      </Tooltip>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
          <AnimatePresence>
            {itemPanel && item && walletParent.publicKey && (
              <SingleItemView
                theme={theme}
                owner={walletParent.publicKey.toBase58()}
                item={item}
                closePanel={() => {
                  setItemPanel(false);
                }}
              />
            )}
          </AnimatePresence>

          <Navigation
            theme={theme}
            toggleTheme={() => setTheme(theme == 0 ? 1 : 0)}
          />
        </motion.div>
      </AnimatePresence>
    </>
  );
}
