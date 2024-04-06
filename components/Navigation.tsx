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
      <div
        className="navigation-container flex-row-center-center"
        data-theme={themes[theme]}
      >
        <div className="navigation flex-row-center-center">
          <div className="navigation-button logo">
            {theme == 0 && <Image src={empteaWhite} alt="Emptea-logo" />}
            {theme == 1 && <Image src={empteaBlack} alt="Emptea-logo" />}
            {theme == 2 && <Image src={empteaWhite} alt="Emptea-logo" />}
            {theme == 3 && <Image src={empteaWhite} alt="Emptea-logo" />}
          </div>
          <div
            className="navigation-button flex-row-center-center"
            onClick={() => {
              setNavModal(navModal == 1 ? 0 : 1);
            }}
          >
            <FontAwesomeIcon
              icon={faWallet}
              color={wallet.connected ? "#12b865" : "inherit"}
            />
          </div>
          <div
            className="navigation-button flex-row-center-center"
            onClick={() => {
              setNavModal(navModal == 2 ? 0 : 2);
            }}
          >
            <FontAwesomeIcon icon={faPalette} />
          </div>
          <div
            className="navigation-button flex-row-center-center"
            onClick={() => {
              setNavModal(navModal == 3 ? 0 : 3);
            }}
          >
            <FontAwesomeIcon icon={faQuestion} />
          </div>
        </div>
      </div>
      <div
        className="nav-modal-container flex-row-center-center"
        data-theme={themes[theme]}
      >
        {navModal == 1 && (
          <div className="nav-modal nav-modal-wallet flex-row-center-center">
            <div
              className="modal-content"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <WalletMultiButtonDynamic />
            </div>
          </div>
        )}
        {navModal == 2 && (
          <div className="nav-modal nav-modal-settings flex-column-center-center">
            <div
              className="modal-content flex-column-center-center"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div
                className="button flex-row-center-center"
                onClick={() => {
                  toggleTheme(0);
                }}
              >
                <FontAwesomeIcon icon={faLightbulb} />
                Light
              </div>
              <div
                className="button flex-row-center-center"
                onClick={() => {
                  toggleTheme(1);
                }}
              >
                <FontAwesomeIcon icon={faMoon} />
                Dark
              </div>
              <div
                className="button flex-row-center-center"
                onClick={() => {
                  toggleTheme(2);
                }}
              >
                <FontAwesomeIcon icon={faCandyCane} />
                Candy
              </div>
              <div
                className="button flex-row-center-center"
                onClick={() => {
                  toggleTheme(3);
                }}
              >
                <FontAwesomeIcon icon={faAnchor} />
                Navy
              </div>
            </div>
          </div>
        )}
        {navModal == 3 && (
          <div
            className="help-window flex-row-center-center"
            onClick={() => {
              setNavModal(0);
            }}
          >
            <div className="help-container flex-row-center-center">
              <div className="help-panel flex-column-center-center">
                <div className="font-h4">The Lab</div>
                <div className="font-text">
                  The lab is an intuitive panel to create tokens on Solana. We
                  currently support Standard NFT&apos;s, compressed NFT&apos;s,
                  programmable NFT&apos;s.
                </div>
              </div>
              <div className="help-panel flex-column-center-center">
                <div className="font-h4">The Gallery</div>
                <div className="font-text">
                  The gallery is a place to get a clean overview of your assets
                  and maintain them.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
