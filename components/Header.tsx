import React from "react";
import { motion as m } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import appIcon from "../media/app-icon.png";

export default function Header({ id, theme }: { id: number; theme: number }) {
  const labels = ["NFT", "PNFT", "Merkle Tree", "CNFT", "SPL22", "Gallery"];
  const pages = ["", "pnft", "merkletree", "cnft", "spl22", "gallery"];
  return (
    <>
      <m.div
        id="header"
        className="header flex-row-between-center"
        data-theme={theme == 0 ? "light" : "dark"}
      >
        <div className="logo flex-row-center-center">
          <Image src={appIcon} alt="app-icon" />
          <m.div className="font-h4" key={"application-title"}>
            <Link href={"/"}>Preda</Link>
          </m.div>
        </div>
        <div className="flex-row-center-center">
          {labels.map((item, index) => (
            <Link href={"/" + pages[index]} key={"headerbutton" + index}>
              <button
                className={
                  id == index
                    ? "operator active font-text-small-bold"
                    : "operator font-text-small"
                }
                onClick={() => {
                  console.log(index);
                }}
              >
                {item}
              </button>
            </Link>
          ))}
        </div>
      </m.div>
    </>
  );
}
