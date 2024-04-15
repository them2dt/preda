"use client";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { enqueueSnackbar } from "notistack";
import { CustomSlider } from "@/components/Slider";
import { uploadFileToIrys, validateImage } from "@/backend/General";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { findMerkleTree, loadAssets, mintCNFT } from "@/backend/CNFT";
import { divideAmount, publicKey } from "@metaplex-foundation/umi";
import { backendWrapper } from "../BackendWrapper";
import ResultPanel from "../ResultPanel";
import { BackendResponse } from "@/types";
import {
  DasApiAsset,
  DasApiAssetList,
} from "@metaplex-foundation/digital-asset-standard-api";
import Image from "next/image";

export default function Panel() {
  const [address, setAddress] = useState<string>();
  const [assets, setAssets] = useState<DasApiAsset[]>();
  const [walletLoadable, setWalletLoadable] = useState<boolean>(false);

  const walletC = useWallet();
  const { wallet } = useWallet();
  const { connection } = useConnection();

  useEffect(() => {
    if (walletC) {
      if (walletC.connected) {
        setWalletLoadable(true);
      } else {
        setWalletLoadable(false);
      }
    }
  }, [walletC.connected]);

  const run = async (param: string) => {
    const runner = loadAssets({
      wallet: wallet,
      connection: connection,
      address: param,
    });
    const response = await backendWrapper({
      wallet: wallet,
      connection: connection,
      initialMessage: "",
      backendCall: async () => await runner,
    });
    setAssets(response.dasList.items);
  };

  const publicKeyValid = () => {
    return /[1-9A-HJ-NP-Za-km-z]{32,44}/.test(address);
  };

  return (
    <>
      <div className="panel-container flex-column-start-center">
        <div className="font-h3">Load Assets</div>
        <div className="panel flex-row-center-center">
          <input
            type="text"
            name="title"
            placeholder="Wallet address"
            className="font-text-small"
            onChange={(e) => {
              setAddress(e.target.value);
            }}
          />
          <button
            disabled={!wallet || !connection || !address || !publicKeyValid()}
            className="flex-row-center-center font-text"
            onClick={async () => {
              await run(address);
            }}
          >
            Load Assets
          </button>
          <button
            disabled={!walletLoadable}
            className="submit flex-row-center-center font-text"
            onClick={async () => {
              await run(walletC.publicKey.toBase58());
            }}
          >
            {!walletLoadable ? "Connect with wallet" : "Load from wallet"}
          </button>
        </div>
        {assets && (
          <div className="single-items flex-column-center-center">
            {assets.map((item, index) => (
              <div
                key={"asset-" + index}
                className="panel single-item flex-row-start-start"
              >
                <div className="column flex-column-center-start">
                  <div className="row flex-row-center-start">
                    <div className="image">
                      <img src={item.content.links["image"]} alt="Image" />
                    </div>
                    <div className="naming flex-column-center-start">
                      <div className="name font-h4">
                        {item.content.metadata.name}
                      </div>
                      <div className="description font-text-tiny">
                        {item.content.metadata.description}
                      </div>
                    </div>
                  </div>
                  <div className="row flex-row-center-start">
                    <div className="attributes flex-row-start-start">
                      {item.content.metadata.attributes &&
                        item.content.metadata.attributes.map((att, index) => (
                          <div
                            className="attribute flex-column-start-start"
                            key={"attribute-" + index}
                          >
                            <div className="font-text-tiny-bold">
                              {att.trait_type}
                            </div>
                            <div className="font-tiny-text">{att.value}</div>
                          </div>
                        ))}
                    </div>
                    <div className="specs flex-row-start-start">
                      <div
                        className="spec flex-row-center-center"
                        key={"attribute-" + index}
                      >
                        <div className="font-text-tiny-bold">
                          Token Standard
                        </div>
                        {item.interface == "V1_NFT" &&
                        item.compression.compressed ? (
                          <div className="font-text-tiny">cNFT</div>
                        ) : item.interface == "V1_NFT" ? (
                          <div className="font-text-tiny">cNFT</div>
                        ) : item.interface == "ProgrammableNFT" ? (
                          <div className="font-text-tiny">NFT</div>
                        ) : (
                          <div className="font-text-tiny">{item.interface}</div>
                        )}
                      </div>
                      <div
                        className="spec flex-row-center-center"
                        key={"attribute-" + index}
                      >
                        <div className="font-text-tiny-bold">Mutable</div>
                        <div className="font-text-tiny">
                          {item.mutable ? "True" : "False"}
                        </div>
                      </div>
                      <div
                        className="spec flex-row-center-center"
                        key={"attribute-" + index}
                      >
                        <div className="font-text-tiny-bold">Royalties</div>
                        <div className="font-text-tiny">
                          {item.royalty.percent}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
