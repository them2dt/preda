import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import appIcon from "../media/app-icon.png";
import { motion as m } from "framer-motion";

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
        <div className="flex-row-center-start">
          {labels.map((item, index) => (
            <div
              key={"operator-" + index}
              className="flex-column-center-center"
              onClick={() => {
                setSectionId(index);
                if (index == sectionId) {
                  setTab({ id: index, open: !tab.open });
                } else setTab({ id: index, open: true });
              }}
            >
              <div
                className={
                  tab.open == true && sectionId == index
                    ? "operator flex-row-end-center font-text-small-bold " +
                      (id == index && "active")
                    : "operator flex-row-end-center font-text-small " +
                      (id == index && "active")
                }
              >
                {item}
              </div>
              {tab.open == true && (
                <m.div
                  className={
                    sectionId == index
                      ? "tabs active flex-column-end-end section-" +
                        sectionId.toString()
                      : "tabs flex-column-end-end section-" +
                        sectionId.toString()
                  }
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.1, duration: 0.2 }}
                >
                  {operations[sectionId].map((item, index) => (
                    <Link
                      href={"/" + pages[sectionId][index]}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      key={
                        "operation-" +
                        sectionId.toString() +
                        "-" +
                        index.toString()
                      }
                    >
                      <div className="tab font-text-tiny flex-row-end-center">
                        {item}
                      </div>
                    </Link>
                  ))}
                </m.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
