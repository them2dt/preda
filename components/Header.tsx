import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import appIcon from "../media/app-icon.png";
import { AnimatePresence, motion } from "framer-motion";
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
  const [tab, setTab] = useState<boolean>(false);
  const [sectionID, setSectionID] = useState<number>(0);
  const [operationID, setOperationID] = useState<number>(0);
  const labels = ["nft", "pnft", "cnft", "spl20", "spl22", "core", "lab"];
  const operationLabels = [
    ["Create NFT", "Burn NFT"],
    ["Create pNFT", "Burn pNFT"],
    ["Create cNFT", "Burn cNFT", "Create Merkle tree"],
    ["Create SPL20", "Burn SPL20"],
    ["Create SPL22", "Burn SPL22"],
    [
      "Create CORE Asset",
      "Burn CORE Asset",
      "Edit CORE Asset",
      "Create CORE collection",
    ],
    ["*"],
  ];
  const pages = [
    ["create", "burn"],
    ["create", "burn"],
    ["create", "burn", "merkle-tree"],
    ["create", "burn"],
    ["create", "burn"],
    ["create", "burn", "edit", "collection"],
    ["*"],
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
        <button
          id="header-opener"
          className={
            tab
              ? "opener open flex-row-center-center"
              : "opener flex-row-center-center"
          }
          onClick={() => {
            setTab(!tab);
          }}
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
      <AnimatePresence>
        {tab && (
          <motion.div
            id="header-backdrop"
            className="flex-row-center-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex-row-center-center">
              <motion.div className="menu flex-row-center-start">
                {labels.map((item, index) => (
                  <div
                    className={
                      index == 6
                        ? "section disabled flex-column-center-start"
                        : "section flex-column-center-start"
                    }
                    key={"header-section-" + index}
                  >
                    <div className="title font-text-bold">
                      {item}
                      {index == 6 && " - coming soon"}
                    </div>
                    {pages[index].map((op, i) => (
                      <Link
                        href={"/" + labels[index] + "/" + pages[index][i]}
                        key={"operation-" + index + "-" + i}
                      >
                        <div className="operation font-text-small">
                          {operationLabels[index][i]}
                        </div>
                      </Link>
                    ))}
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
