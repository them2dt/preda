"use client";
import {
  faWallet,
  faPalette,
  faQuestion,
  faLightbulb,
  faMoon,
  faCandyCane,
  faAnchor,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion as m } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import { enqueueSnackbar } from "notistack";
import Image from "next/image";

import empteaWhite from "../media/emptea-transparent-white.png";
import empteaBlack from "../media/emptea-transparent-black.png";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export default function Navigation({
  theme,
  themes,
  toggleTheme,
}: {
  theme: number;
  themes: string[];
  toggleTheme: (themeIdParameter: number) => void;
}) {
  // a hook to manage the modals of the navigation. 0 = none, 1 = wallet, 2 = Profile,
  const [navModal, setNavModal] = useState(0);
  const wallet = useWallet();

  useEffect(() => {
    if (wallet) {
      if (wallet.connected) {
        enqueueSnackbar("Wallet connected.", { variant: "success" });
      } else enqueueSnackbar("Wallet not connected.", { variant: "error" });
    }
  }, [wallet.connected]);

  return (
    <>
      <m.div
        className="navigation-container flex-row-center-center"
        data-theme={themes[theme]}
      >
        <m.div className="navigation flex-row-center-center">
          <m.div className="navigation-button logo">
            {theme == 0 && <Image src={empteaWhite} alt="Emptea-logo" />}
            {theme == 1 && <Image src={empteaBlack} alt="Emptea-logo" />}
            {theme == 2 && <Image src={empteaWhite} alt="Emptea-logo" />}
            {theme == 3 && <Image src={empteaWhite} alt="Emptea-logo" />}

          </m.div>
          <m.div
            className="navigation-button flex-row-center-center"
            onClick={() => {
              setNavModal(navModal == 1 ? 0 : 1);
            }}
          >
            <FontAwesomeIcon
              icon={faWallet}
              color={wallet.connected ? "#12b865" : "inherit"}
            />
          </m.div>
          <m.div
            className="navigation-button flex-row-center-center"
            onClick={() => {
              setNavModal(navModal == 2 ? 0 : 2);
            }}
          >
            <FontAwesomeIcon icon={faPalette} />
          </m.div>
          <m.div
            className="navigation-button flex-row-center-center"
            onClick={() => {
              setNavModal(navModal == 3 ? 0 : 3);
            }}
          >
            <FontAwesomeIcon icon={faQuestion} />
          </m.div>
        </m.div>
      </m.div>
      <AnimatePresence>
        <m.div
          className="nav-modal-container flex-row-center-center"
          data-theme={themes[theme]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {navModal == 1 && (
            <m.div
              className="nav-modal nav-modal-wallet flex-row-center-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <m.div
                className="modal-content"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <WalletMultiButtonDynamic />
              </m.div>
            </m.div>
          )}
          {navModal == 2 && (
            <m.div
              className="nav-modal nav-modal-settings flex-column-center-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <m.div
                className="modal-content flex-column-center-center"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <m.div
                  className="button flex-row-center-center"
                  onClick={() => {
                    toggleTheme(0);
                  }}
                >
                  <FontAwesomeIcon icon={faLightbulb} />
                  Light
                </m.div>
                <m.div
                  className="button flex-row-center-center"
                  onClick={() => {
                    toggleTheme(1);
                  }}
                >
                  <FontAwesomeIcon icon={faMoon} />
                  Dark
                </m.div>
                <m.div
                  className="button flex-row-center-center"
                  onClick={() => {
                    toggleTheme(2);
                  }}
                >
                  <FontAwesomeIcon icon={faCandyCane} />
                  Candy
                </m.div>
                <m.div
                  className="button flex-row-center-center"
                  onClick={() => {
                    toggleTheme(3);
                  }}
                >
                  <FontAwesomeIcon icon={faAnchor} />
                  Navy
                </m.div>
              </m.div>
            </m.div>
          )}
          {navModal == 3 && (
            <m.div
              className="help-window flex-row-center-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => {
                setNavModal(0);
              }}
            >
              <div className="help-container flex-row-center-center">
                <div className="help-panel flex-column-center-center">
                  <div className="font-h4">The Lab</div>
                  <div className="font-text">
                    The lab is an intuitive panel to create tokens on Solana. We
                    currently support Standard NFT&apos;s, compressed
                    NFT&apos;s, programmable NFT&apos;s.
                  </div>
                </div>
                <div className="help-panel flex-column-center-center">
                  <div className="font-h4">The Gallery</div>
                  <div className="font-text">
                    The gallery is a place to get a clean overview of your
                    assets and maintain them.
                  </div>
                </div>
              </div>
            </m.div>
          )}
        </m.div>
      </AnimatePresence>
    </>
  );
}
