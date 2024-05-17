"use client";
import Image from "next/image";
import Link from "next/link";
import Logo from "../../media/preda-logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWallet,
  faPalette,
  faQuestion,
  faNetworkWired,
} from "@fortawesome/free-solid-svg-icons";
import { themes, sections, operations, links } from "../utils/simples";
import { useState } from "react";
import dynamic from "next/dynamic";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { enqueueSnackbar } from "notistack";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export default function SidePanel({
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
    <div
      className={"sidepanel-container flex-row-end-end"}
      data-theme={themes[theme]}
    >
      <div className="sidepanel flex-column-between-center">
        <div className="flex-column-start-center">
          <div className="logo-box flex-row-center-center">
            <Image src={Logo} alt="Preda" />
            <div className="naming flex-row-center-center">
              <div className="name font-h3">Preda</div>
              <div className=" variant font-h3">Beta 2</div>
            </div>
          </div>
          <div className="operations flex-column-start-center">
            {sections.map((item, SECindex) => (
              <div className="operation-section flex-column-start-center">
                <div
                  className="operation-section-header flex-row-start-center"
                  key={"section " + SECindex}
                >
                  <div className="font-text-bold">{item}</div>
                </div>
                {operations[SECindex].map((item, OPindex) => (
                  <Link href={links[SECindex][OPindex]}>
                    <div
                      className={
                        SECindex == sectionID && OPindex == operationID
                          ? "operation active flex-row-start-center"
                          : "operation flex-row-start-center"
                      }
                    >
                      <div className="font-text">{item}</div>
                    </div>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="more flex-row-center-center">
          <button
            className="flex-row-center-center"
            onClick={() => {
              setModal(modal == 1 ? 0 : 1);
            }}
          >
            <FontAwesomeIcon icon={faWallet} />
          </button>
          <button
            className="flex-row-center-center"
            onClick={() => {
              setModal(modal == 2 ? 0 : 2);
            }}
          >
            <FontAwesomeIcon icon={faNetworkWired} />
          </button>
          <button
            className="flex-row-center-center"
            onClick={() => {
              setModal(modal == 3 ? 0 : 3);
            }}
          >
            <FontAwesomeIcon icon={faPalette} />
          </button>
          <button
            className="flex-row-center-center"
            onClick={() => {
              setModal(modal == 4 ? 0 : 4);
            }}
          >
            <FontAwesomeIcon icon={faQuestion} />
          </button>
        </div>
      </div>
      {modal == 1 && (
        <div className="modal theme-modal flex-column-center-center">
          <WalletMultiButtonDynamic />
        </div>
      )}
      {modal == 2 && (
        <div className="modal rpc-modal flex-column-start-start">
          <div className="modal-name flex-row-start-start font-h4">
            Choose your network
          </div>
          <button
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
          </button>
          <button
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
          </button>
          <div className="modal-content flex-column-center-center">
            <input
              className={
                rpcOption == 2 ? "font-text-small active" : "font-text-small"
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
          </div>
        </div>
      )}
      {modal == 3 && (
        <div className="modal theme-modal flex-column-start-start">
          <div className="modal-name flex-row-start-start font-h4">Themes</div>
          <div className="modal-content flex-row-start-start">
            {themes.map((item, index) => (
              <button
                className="theme-button"
                style={{ backgroundColor: "var(--" + item + ")" }}
                onClick={() => {
                  setTheme(index);
                }}
              ></button>
            ))}
          </div>
        </div>
      )}

      {modal == 4 && (
        <div className="modal theme-modal flex-column-start-start">
          <div className="modal-name flex-row-start-start font-h4">Themes</div>
          <div className="modal-content flex-row-start-start">
            {themes.map((item, index) => (
              <button
                className="theme-button"
                style={{ backgroundColor: "var(--" + item + ")" }}
                onClick={() => {
                  setTheme(index);
                }}
              ></button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
