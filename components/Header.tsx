import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import appIcon from "../media/app-icon.png";
import { motion as m } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export default function Header({
  id,
  theme,
  themes,
}: {
  id: number;
  theme: number;
  themes: string[];
}) {
  const [tab, setTab] = useState({ id: 0, open: false });
  const [sectionId, setSectionId] = useState(0);
  const labels = ["NFT", "PNFT", "CNFT", "SPL20", "SPL22", "CORE"];
  const operations = [
    ["Create a NFT", "burn a NFT"],
    ["Create a pNFT", "burn a pNFT"],
    ["Create Merkle Tree", "Create a cNFT", "Burn a cNFT"],
    ["Create a SPL20-Token", "Burn SPL20-Tokens"],
    ["Create a SPL22-Token", "Burn SPL22-Tokens"],
    [
      "Create a CORE-Asset",
      "Create a CORE Collection",
      "Edit a CORE Asset",
      "Burn a CORE-Asset",
    ],
  ];
  const pages = [
    ["nft-create", "nft-burn"],
    ["pnft-create", "pnft-burn"],
    ["cnft-merkletree", "cnft-create", "cnft-burn"],
    ["spl20-create", "spl20-burn"],
    ["spl22-create", "spl22-burn"],
    ["core-create", "core-collection", "core-edit", "core-burn"],
  ];
  return (
    <>
      <div
        id="header"
        className="header flex-row-between-center"
        data-theme={themes[theme]}
      >
        <div className="logo flex-row-center-center">
          <Image src={appIcon} alt="app-icon" />
          <div className="font-h4" key={"application-title"}>
            <Link href={"/"}>Preda</Link>
          </div>
        </div>
        <button className="opener flex-row-center-center">
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
      <div id="header-backdrop" className="flex-row-center-center">
        <div className="flex-row-center-center">
          <div className="menu flex-row-center-start">
            {labels.map((item, index) => (
              <div
                className="section flex-column-center-start"
                key={"header-section-" + index}
              >
                <div className="title font-text-bold">{item}</div>
                {operations.map((op, i) => (
                  <div
                    className="font-text-small"
                    key={"operation-" + index + "-" + i}
                  >
                    {operations[index][i]}
                  </div>
                ))}
                <div className="font-text-small">Burn an asset</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
