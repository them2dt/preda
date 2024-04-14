import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import appIcon from "../media/app-icon.png";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { enqueueSnackbar } from "notistack";

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
  const labels = ["NFT", "PNFT", "CNFT", "SPL-20", "SPL-22", "CORE"];
  const labelDirectories = ["nft", "pnft", "cnft", "spl20", "spl22", "core"];
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
  ];
  const pages = [
    ["create", "burn"],
    ["create", "burn"],
    ["create", "burn", "merkletree"],
    ["create", "burn"],
    ["create", "burn"],
    ["create", "burn", "edit", "collection"],
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
            data-theme={themes[theme]}
            id="header-backdrop"
            className="flex-row-center-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              setTab(!tab);
            }}
          >
            <motion.div
              className="menu flex-row-center-start"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
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
                        href={
                          "/" + labelDirectories[index] + "-" + pages[index][i]
                        }
                        key={"operation-" + index + "-" + i}
                        onClick={(e) => {
                          e.stopPropagation();
                          enqueueSnackbar("Loading panel...", {
                            variant: "info",
                          });
                        }}
                      >
                        <div className="operation font-text-small">
                          {operationLabels[index][i]}
                        </div>
                      </Link>
                    ))}
                  </div>
                ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
