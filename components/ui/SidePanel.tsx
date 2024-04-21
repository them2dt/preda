"use client";
import Image from "next/image";
import Link from "next/link";
import Logo from "../../media/preda-logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWallet,
  faPalette,
  faQuestion,
  faLightbulb,
  faMoon,
  faCandyCane,
  faAnchor,
  faNetworkWired,
} from "@fortawesome/free-solid-svg-icons";
import { themes } from "../utils/simples";
import { useState } from "react";

export default function SidePanel({
  sectionID,
  operationID,
  setTheme,
}: {
  sectionID: number;
  operationID: number;
  setTheme: (id: number) => void;
}) {
  const [modal, setModal] = useState(0);
  const sections = ["Create", "Manage"];
  const operations = [
    ["NFT", "Compressed", "SPL Token"],
    [
      "Update Token Metadata",
      "Create a Collection (CORE)",
      "Mint SPL-Tokens",
      "Burn Assets",
    ],
  ];
  const links = [
    ["create-nft", "create-cnft", "create"],
    ["update", "core-collection", "mint-spl", "burn"],
  ];
  return (
    <div className="sidepanel-container flex-column-start-center">
      <div className="sidepanel flex-column-start-start">
        <div className="logo-box flex-row-center-center">
          <Image src={Logo} alt="Preda" />
          <div className="naming flex-row-center-center">
            <div className="name font-h3">Preda</div>
            <div className=" variant font-h3">Lite</div>
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
            <FontAwesomeIcon icon={faPalette} />
          </button>
          <button
            className="flex-row-center-center"
            onClick={() => {
              setModal(modal == 3 ? 0 : 3);
            }}
          >
            <FontAwesomeIcon icon={faNetworkWired} />
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
        <div className="modal theme-modal flex-column-start-start">
          <div className="modal-name flex-row-start-start font-h4">Wallet</div>
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
      {modal == 2 && (
        <div className="modal theme-modal flex-column-start-start">
          <div className="modal-name flex-row-start-start font-h4">Network</div>
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
