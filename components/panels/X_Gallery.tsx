"use client";
import React, { useEffect, useState } from "react";
import { enqueueSnackbar } from "notistack";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { loadAssets } from "@/backend/CNFT";
import { backendWrapper } from "../BackendWrapper";
import { DasApiAsset } from "@metaplex-foundation/digital-asset-standard-api";
import { motion } from "framer-motion";

export default function Panel() {
  const [address, setAddress] = useState<string>();
  const [assets, setAssets] = useState<DasApiAsset[]>();
  const [asset, setAsset] = useState<DasApiAsset>();
  const [sidePanel, setSidePanel] = useState<boolean>(false);
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
    if (response.dasList) {
      setAssets(response.dasList.items);
    } else {
      enqueueSnackbar("Couldn't fetch assets.", { variant: "error" });
    }
  };

  const publicKeyValid = () => {
    return /[1-9A-HJ-NP-Za-km-z]{32,44}/.test(address);
  };

  return (
    <>
      <div className="gallery-container flex-column-center-center">
        <div className="filter-section flex-column-center-center">
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
        </div>
        {assets && (
          <div className="result-items-container flex-row-start-start">
            <div className="result-items flex-row-start-start">
              {assets.map((item, index) => (
                <div
                  key={"asset-" + index}
                  className="result-item flex-column-center-center"
                >
                  <div className="image">
                    <img src={item.content.links["image"]} alt="image" />
                  </div>
                  <div className="info-primary flex-column-start-start">
                    <div className="font-text-bold">
                      {item.content.metadata.name}
                    </div>
                    <div className="font-text">
                      {item.content.metadata.description}
                    </div>
                  </div>
                  <button
                    className="button font-text-bold"
                    onClick={() => {
                      setAsset(item);
                      setSidePanel(true);
                    }}
                  >
                    open
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {sidePanel && (
        <motion.div
          className="side-panel-backdrop flex-column-center-center"
          onClick={(e) => {
            e.stopPropagation();
            setSidePanel(!sidePanel);
          }}
        >
          <motion.div
            className="side-panel flex-column-center-start"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="headline flex-column-start-start">
              {asset.content.metadata.name}
            </div>
            <div className="row flex-row-start-start">
              <div className="column flex-column-start-center">
                <div className="image flex-column-center-center">
                  <img src={asset.content.links["image"]} alt="image" />
                </div>
                <div className="description font-text">
                  {asset.content.metadata.description}
                </div>
              </div>
              <div className="column flex-column-start-start">
                <div className="attribute-header flex-row-start-start font-h4">
                  Attributes
                </div>
                <div className="attributes flex-row-start-start">
                  {asset.content.metadata.attributes &&
                    asset.content.metadata.attributes.map((item, index) => (
                      <div
                        className="attribute flex-column-start-start"
                        key={"attribute-" + index}
                      >
                        <div className="font-text-bold">{item.trait_type}</div>
                        <div className="font-text">{item.value}</div>
                      </div>
                    ))}
                </div>
                <div className="attribute-header flex-row-start-start font-h4">
                  Specs
                </div>
                <div className="attributes specs flex-column-start-start">
                  <div className="attribute spec flex-column-start-start">
                    <div className="font-text-small-bold">Address</div>
                    <div className="font-text-small">
                      {asset.id ? asset.id : "-"}
                    </div>
                  </div>
                  <div className="attribute spec flex-column-start-start">
                    <div className="font-text-small-bold">Token Standard</div>
                    <div className="font-text-small">
                      {asset.interface ? asset.interface : "-"}
                    </div>
                  </div>
                  <div className="attribute spec flex-column-start-start">
                    <div className="font-text-small-bold">Mutable</div>
                    <div className="font-text-small">
                      {asset.mutable ? "True" : "False"}
                    </div>
                  </div>
                  <div className="attribute spec flex-column-start-start">
                    <div className="font-text-small-bold">Burnt</div>
                    <div className="font-text-small">
                      {asset.burnt ? "True" : "False"}
                    </div>
                  </div>
                  <div className="attribute spec flex-column-start-start">
                    <div className="font-text-small-bold">Compressed</div>
                    <div className="font-text-small">
                      {asset.compression.compressed
                        ? "True"
                        : "False" || "False"}
                    </div>
                  </div>
                  <div className="attribute spec flex-column-start-start">
                    <div className="font-text-small-bold">Royalty</div>
                    <div className="font-text-small">
                      {asset.royalty.percent ? asset.royalty.percent : "0"}%
                    </div>
                  </div>
                  {asset.creators &&
                    asset.creators.map((item, index) => (
                      <div
                        className="attribute spec flex-column-start-start"
                        key={"c-" + index}
                      >
                        <div className="font-text-small-bold">
                          Creator {index}
                        </div>
                        <div className="font-text-tiny">
                          {item.address}
                          {" ("}
                          {item.share}
                          {"%)"}
                        </div>
                      </div>
                    ))}
                </div>
                <button className="button font-text-small-bold">Update</button>
                <button
                  className="button font-text-small-bold"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(asset.id);
                  }}
                >
                  Copy address
                </button>
                <button className="button font-text-small-bold burn">
                  Burn
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
