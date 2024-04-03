import {
  faWallet,
  faGear,
  faQuestion,
  faUser,
  faSun,
  faLightbulb,
  faPalette,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion as m } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

/**
 * The navbar. Should be self-explanatory.
 * @param {Function} setModal - Function, which changes the ID of the Modal.
 * @param {Number} theme - The current theme.
 * @param {Function} toggleTheme - Function, which toggles the theme.
 */
export default function Navigation({ theme, toggleTheme }: any) {
  // a hook to manage the modals of the navigation. 0 = none, 1 = wallet, 2 = Profile,
  const [navModal, setNavModal] = useState(0);
  const wallet = useWallet();

  return (
    <>
      <m.div
        className="navigation-container flex-row-center-center"
        data-theme={theme == 0 ? "light" : "dark"}
      >
        <m.div className="navigation flex-row-center-center">
          <m.div className="navigation-button logo"></m.div>
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
          data-theme={theme == 0 ? "light" : "dark"}
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
                  onClick={toggleTheme}
                >
                  <FontAwesomeIcon icon={faLightbulb} />
                  {theme == 0 ? "Light" : "Dark"} mode
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
