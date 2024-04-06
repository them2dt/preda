"use client";
import Image from "next/image";
import React, { useState } from "react";
import logo from "../media/app-icon.png";
import { motion } from "framer-motion";
import Link from "next/link";
import arweave from "../media/arweave.svg";
import metaplex from "../media/metaplex.svg";
import irys from "../media/irys.svg";

export default function Page() {
  const [advanced, setAdvanced] = useState<boolean>(false);
  return (
    <div className="homepage flex-column-center-center">
      <div className="section hero flex-column-start-center">
        <div className="board flex-column-center-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.1, duration: 0.1 }}
          >
            <Image src={logo} alt="logo" />
          </motion.div>
          <div className="flex-column-center-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.2, duration: 0.1 }}
              className="title font-h1"
            >
              Preda
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.3, duration: 0.1 }}
              className="description font-text"
            >
              The powerhouse for Solana tokens.
            </motion.div>
          </div>
        </div>
      </div>
      <div id="tools" className="section tools flex-column-center-center">
        <div className="font-h3">The right tools for your needs.</div>
        <div className="switch-container flex-row-center-center">
          <div className="font-text-small">Essential</div>
          <motion.div
            className={advanced ? "switch active" : "switch"}
            onClick={() => {
              setAdvanced(!advanced);
            }}
          >
            <div className="switch-button"></div>
          </motion.div>
          <div className="font-text-small">Advanced</div>
        </div>
        <div className="cards flex-row-center-center">
          {!advanced && (
            <motion.div
              className="card legacy  nft flex-column-center-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.2, duration: 0.1 }}
            >
              <div className="card-base flex-column-center-center">
                <div className="info flex-column-center-start">
                  <div className="standard font-h4">NFTs</div>
                  <div className="description font-text">The standard NFT.</div>
                </div>
                <div className="actions flex-column-center-center">
                  <Link href={"/nft-create"}>
                    <motion.div className="action flex-column-center-center font-text-tiny-bold">
                      Create an NFT
                    </motion.div>
                  </Link>
                  <Link href={"/nft-burn"}>
                    <motion.div className="action flex-column-center-center font-text-tiny-bold">
                      Burn an NFT
                    </motion.div>
                  </Link>
                  <Link href={"/nft-mint-cm"}>
                    <motion.div className="action flex-column-center-center font-text-tiny-bold">
                      Mint from a Candy machine
                    </motion.div>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
          {!advanced && (
            <motion.div
              className="card legacy spl20 flex-column-center-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.1, duration: 0.1 }}
            >
              <div className="card-base flex-column-center-center">
                <div className="info flex-column-center-start">
                  <div className="standard font-h4">SPL20</div>
                  <div className="description font-text">
                    The coin standard.
                  </div>
                </div>
                <div className="actions flex-column-center-center">
                  <Link href={"/spl20-create"}>
                    <motion.div className="action flex-column-center-center font-text-tiny-bold">
                      Create a SPL20
                    </motion.div>
                  </Link>
                  <Link href={"/spl20-mint"}>
                    <motion.div className="action flex-column-center-center font-text-tiny-bold">
                      Mint SPL20
                    </motion.div>
                  </Link>
                  <Link href={"/spl20-burn"}>
                    <motion.div className="action flex-column-center-center font-text-tiny-bold">
                      Burn SPL20
                    </motion.div>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
          {advanced && (
            <motion.div
              className="card pnft flex-column-center-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
            >
              <div className="card-base flex-column-center-center">
                <div className="info flex-column-center-start">
                  <div className="standard font-h4">pNFTs</div>
                  <div className="description font-text">
                    Programmable NFT to integrate rules like enforced royalties.
                  </div>
                </div>
                <div className="actions flex-column-center-center">
                  <Link href={"/pnft-create"}>
                    <motion.div className="action flex-column-center-center font-text-tiny-bold">
                      Create an pNFT
                    </motion.div>
                  </Link>
                  <Link href={"/pnft-burn"}>
                    <motion.div className="action flex-column-center-center font-text-tiny-bold">
                      Burn an pNFT
                    </motion.div>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
          {advanced && (
            <motion.div
              className="card cnft flex-column-center-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.1, duration: 0.1 }}
            >
              <div className="card-base flex-column-center-center">
                <div className="info flex-column-center-start">
                  <div className="standard font-h4">cNFTs</div>
                  <div className="description font-text">
                    Compression allows you to mint more than a million NFTs for
                    100$.
                  </div>
                </div>
                <div className="actions flex-column-center-center">
                  <Link href={"/cnft-merkletree"}>
                    <motion.div className="action flex-column-center-center font-text-tiny-bold">
                      Create a Merkle Tree
                    </motion.div>
                  </Link>
                  <Link href={"/cnft-create"}>
                    <motion.div className="action flex-column-center-center font-text-tiny-bold">
                      Create a cNFT
                    </motion.div>
                  </Link>
                  <Link href={"/cnft-burn"}>
                    <motion.div className="action flex-column-center-center font-text-tiny-bold">
                      Burn a cNFT
                    </motion.div>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
          {advanced && (
            <motion.div
              className="card spl22 flex-column-center-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.2, duration: 0.1 }}
            >
              <div className="card-base flex-column-center-center">
                <div className="info flex-column-center-start">
                  <div className="standard font-h4">SPL22</div>
                  <div className="description font-text">
                    The standard for advanced operations, like token extensions.
                  </div>
                </div>
                <div className="actions flex-column-center-center">
                  <Link href={"/spl22-create"}>
                    <motion.div className="action flex-column-center-center font-text-tiny-bold">
                      Create a SPL22
                    </motion.div>
                  </Link>
                  <Link href={"/spl22-mint"}>
                    <motion.div className="action flex-column-center-center font-text-tiny-bold">
                      Mint SPL22
                    </motion.div>
                  </Link>
                  <Link href={"/spl22-burn"}>
                    <motion.div className="action flex-column-center-center font-text-tiny-bold">
                      Burn SPL22
                    </motion.div>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      <div id="powered" className="section flex-column-center-center">
        <div className="font-h4">Powered by</div>
        <div className="components flex-row-center-center">
          <Image src={arweave} alt="components" height={50} />
          <Image src={metaplex} alt="components" height={50} />
          <Image src={irys} alt="components" height={50} />
        </div>
      </div>
      <div id="footer" className="section flex-row-center-center">
        <Link href={"https://twitter.com/PredaApp"} target="_blank">
          <div className="font-text">Twitter</div>
        </Link>
        <Link href={"https://twitter.com/EmpteaStudios"} target="_blank">
          <div className="font-text">Built by Emptea Studios</div>
        </Link>
      </div>
      <div className="navigation-container flex-row-center-center">
        <motion.div
          className="navigation flex-row-center-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.1, duration: 0.1 }}
        >
          <Link href={"/nft-create"} target="_blank">
            <div className="item launch font-h4">launch</div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
