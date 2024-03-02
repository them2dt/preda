import {
  faWallet,
  faGear,
  faQuestion,
  faUser,
  faSun,
  faLightbulb,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { motion as m } from "framer-motion";
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
              setNavModal(navModal == 0 ? 1 : 0);
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
              setNavModal(navModal == 0 ? 2 : 0);
            }}
          >
            <FontAwesomeIcon icon={faGear} />
          </m.div>
          <m.div
            className="navigation-button flex-row-center-center"
            onClick={() => {
              setNavModal(navModal == 0 ? 3 : 0);
            }}
          >
            <FontAwesomeIcon icon={faQuestion} />
          </m.div>
          <m.div
            className="navigation-button flex-row-center-center"
            onClick={() => {
              //navigate to profile page
            }}
          >
            <FontAwesomeIcon icon={faUser} />
          </m.div>
        </m.div>
      </m.div>

      <div
        className="nav-modal-container flex-row-center-center"
        data-theme={theme == 0 ? "light" : "dark"}
      >
        {navModal == 1 && (
          <m.div className="nav-modal nav-modal-wallet flex-row-center-center">
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
          <m.div className="nav-modal nav-modal-settings flex-column-center-center">
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
          <m.div className="nav-modal nav-modal-help flex-row-center-center">
            <m.div
              className="modal-content"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <h1>Help</h1>
              <p>Coming soon</p>
            </m.div>
          </m.div>
        )}
      </div>
    </>
  );
}
