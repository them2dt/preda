"use client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWallet,
  faPalette,
  faQuestion,
  faNetworkWired,
  faPlus,
  faHandSparkles,
  faCubesStacked,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import dynamic from "next/dynamic";
import { Connection } from "@solana/web3.js";
import { enqueueSnackbar } from "notistack";

//local imports
import teacup from "../../media/emptea-labs/teacup-logo.svg";
import Logo from "../../media/emptea-labs/app-icons/emptea preda.png";
//other
import {
  themes,
  sections,
  operations,
  paths,
  emptea_links,
  emptea_app_name,
  emptea_app_icons,
} from "../utils/simples";
import Loader from "./Loader";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export default function MobileNav({
  sectionID,
  operationID,
  theme,
  setTheme,
  rpc,
  setRpc,
}: {
  sectionID: number;
  operationID: number;
  theme: number;
  setTheme: React.Dispatch<React.SetStateAction<number>>;
  rpc: string;
  setRpc: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [modal, setModal] = useState(0);
  const [menu, setMenu] = useState(false);
  const [blend, setBlend] = useState(false);
  const [rpcOption, setRpcOption] = useState(1);
  const [rpcInput, setRpcInput] = useState("");
  const connection = new Connection(rpc, { commitment: "finalized" });

  const verifyConnection = async (option: number, url: string) => {
    try {
      enqueueSnackbar("Connecting to RPC.", { variant: "info" });
      const response = await new Connection(url).getSlot();
      if (response > 1) {
        setRpc(url);
        setRpcOption(option);
        enqueueSnackbar("Connected successfully.", { variant: "success" });
      }
    } catch (e) {
      enqueueSnackbar("RPC is invalid.", { variant: "error" });
    }
  };

  return (
    <>
      <motion.div
        onClick={(event) => {
          if (menu) {
            event.stopPropagation();
          }
        }}
        className={
          menu
            ? "mobile-nav-container active flex-column-start-start"
            : "mobile-nav-container flex-column-start-start"
        }
        data-theme={themes[theme]}
      >
        <motion.div className={"mobile-nav flex-row-between-start"}>
          <motion.div className="naming flex-row-start-center">
            <Image src={Logo} alt="Preda" />
            <motion.div className=" variant font-text-bold">Preda</motion.div>
          </motion.div>
          <motion.div
            className={
              menu
                ? "menu active flex-row-center-center"
                : "menu flex-row-center-center"
            }
            onClick={() => {
              setModal(0);
              setMenu(!menu);
            }}
          >
            <FontAwesomeIcon icon={faPlus} />
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {menu && (
            <motion.div
              className="menu-options flex-column-center-center"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <motion.div
                className="option flex-row-center-center"
                onClick={() => setModal(modal == 1 ? 0 : 1)}
              >
                <FontAwesomeIcon icon={faCubesStacked} />
                <motion.div className="font-text-bold">Tools</motion.div>
              </motion.div>
              <motion.div
                className="option flex-row-center-center"
                onClick={() => setModal(modal == 2 ? 0 : 2)}
              >
                <FontAwesomeIcon icon={faWallet} />
                <motion.div className="font-text-bold">Wallet</motion.div>
              </motion.div>
              <motion.div
                className="option flex-row-center-center"
                onClick={() => setModal(modal == 3 ? 0 : 3)}
              >
                <FontAwesomeIcon icon={faPalette} />
                <motion.div className="font-text-bold">Theme</motion.div>
              </motion.div>
              <motion.div
                className="option flex-row-center-center"
                onClick={() => setModal(modal == 4 ? 0 : 4)}
              >
                <FontAwesomeIcon icon={faNetworkWired} />
                <motion.div className="font-text-bold">RPC</motion.div>
              </motion.div>
              <motion.div
                className="option tea-button flex-row-center-center"
                onClick={() => setModal(modal == 5 ? 0 : 5)}
              >
                <Image src={teacup} alt="teacup" />
              </motion.div>
            </motion.div>
          )}
          {modal == 1 && (
            <motion.div
              className="modal tool-modal flex-column-start-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >{sections.map((item, SECindex) => (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1, delay: 0.1 * SECindex }}
                className="operation-section flex-column-start-center"
                key={"section " + SECindex}
              >
                <motion.div className="operation-section-header flex-row-start-center">
                  <motion.div className="font-text-bold">{item}</motion.div>
                </motion.div>
                {operations[SECindex].map((item, OPindex) => (
                  <motion.div
                    key={"operation" + OPindex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.1, delay: 0.1 * OPindex }}
                    className={
                      SECindex == sectionID && OPindex == operationID
                        ? "operation active flex-row-start-center"
                        : "operation flex-row-start-center"
                    }
                    onClick={() => {
                      setBlend(true);
                      setTimeout(() => {
                        window.location.href = paths[SECindex][OPindex];
                      }, 200);
                    }}
                  >
                    <motion.div className="font-text">{item}</motion.div>
                  </motion.div>
                ))}
              </motion.div>
            ))}
            </motion.div>
          )}
          {modal == 2 && (
            <motion.div
              className="modal wallet-modal flex-column-center-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <WalletMultiButtonDynamic />
            </motion.div>
          )}
          {modal == 3 && (
            <motion.div
              className="modal theme-modal flex-column-start-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div className="modal-name flex-row-start-start font-h4">
                Themes
              </motion.div>
              <motion.div className="modal-content flex-row-start-start">
                {themes.map((item, index) => (
                  <button
                    className="theme-button"
                    style={{ backgroundColor: "var(--" + item + ")" }}
                    onClick={() => {
                      setTheme(index);
                    }}
                    key={"theme-" + index}
                  ></button>
                ))}
              </motion.div>
            </motion.div>
          )}
          {modal == 4 && (
            <motion.div
              className="modal rpc-modal flex-column-start-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div className="modal-name flex-row-start-start font-h4">
                Choose your network
              </motion.div>
              <motion.button
                className={
                  rpcOption == 0
                    ? "rpc-option font-text-small-bold active"
                    : "rpc-option font-text-small-bold"
                }
                onClick={async () =>
                  await verifyConnection(
                    0,
                    "https://mainnet.helius-rpc.com/?api-key=23b1f54f-f281-4c55-b62a-51620f91a050"
                  )
                }
              >
                Mainnet
              </motion.button>
              <motion.button
                className={
                  rpcOption == 1
                    ? "rpc-option font-text-small-bold active"
                    : "rpc-option font-text-small-bold"
                }
                onClick={async () =>
                  await verifyConnection(
                    1,
                    "https://devnet.helius-rpc.com/?api-key=23b1f54f-f281-4c55-b62a-51620f91a050"
                  )
                }
              >
                Devnet
              </motion.button>
              <motion.div className="modal-content flex-column-start-center">
                <input
                  className={
                    rpcOption == 2
                      ? "font-text-small active"
                      : "font-text-small"
                  }
                  type="text"
                  placeholder="Enter your custom RPC URL"
                  onChange={(e) => {
                    setRpcInput(e.target.value);
                  }}
                />
                <button
                  className="submit font-text-small-bold"
                  onClick={async () => await verifyConnection(2, rpcInput)}
                >
                  Set RPC
                </button>
              </motion.div>
            </motion.div>
          )}
          {modal == 5 && (
            <motion.div
              className="modal app-modal flex-column-start-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div className="modal-name flex-row-start-start font-h4">
                More from emptea labs
              </motion.div>
              <motion.div className="modal-content flex-row-start-start">
                {emptea_links.map((link, index) => (
                  <Link
                    href={emptea_links[index]}
                    target="_blank"
                    key={"emptea-app-" + index}
                  >
                    <motion.div
                      className="emptea-app-icon flex-column-center-center"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.2, delay: index / 10 + 0.2 }}
                    >
                      <Image src={emptea_app_icons[index]} alt="emptea preda" />
                      <div className="font-text-tiny">
                        {emptea_app_name[index]}
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <Loader />
    </>
  );
}
