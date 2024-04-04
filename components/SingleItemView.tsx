import React from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import {
  DasApiAssetAuthority,
  DasApiAssetCreator,
} from "@metaplex-foundation/digital-asset-standard-api";
export default function SingleItemView({
  theme,
  owner,
  item,
  closePanel,
}: {
  theme: number;
  owner: string;
  item: {
    mint: string;
    name: string;
    description: string;
    imageUri: string;
    attributes: { trait_type: string; value: string }[];
    authorities: DasApiAssetAuthority[];
    compressed: boolean;
    creators: DasApiAssetCreator[];
    royalty: number;
    tokenStandard: string;
    type: string;
  };
  closePanel: () => void;
}) {
  const tokenStandards = {
    V1_NFT: "Standard NFT",
    ProgrammableNFT: "Programmable NFT",
    compressed: "Compressed NFT",
  };
  return (
    <motion.div
      className="item-backdrop flex-column-center-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      data-theme={theme == 0 ? "light" : "dark"}
    >
      <div id="item-panel" className="flex-column-center-end">
        <button className="close-button" onClick={closePanel}>
          <FontAwesomeIcon icon={faClose} />
        </button>
        <div className="columns flex-row-center-start">
          <div className="column first flex-column-center-start">
            <div className="image">
              <img src={item.imageUri} />
            </div>
            <div className="title flex-column-center-start">
              <div className="key font-text-tiny">Name</div>
              <div className="value font-h4">{item.name}</div>
            </div>
            <div className="description flex-column-center-start">
              <div className="key font-text-tiny">Description</div>
              <div className="value font-text-bold">{item.description}</div>
            </div>
          </div>
          <div className="column flex-column-center-start">
            <div className="attributes flex-row-end-start">
              {item.attributes.map((attribute, index) => (
                <div key={index} className="attribute flex-column-center-start">
                  <div className="key font-text-tiny">
                    {attribute.trait_type}
                  </div>
                  <div className="value font-text-bold">{attribute.value}</div>
                </div>
              ))}
            </div>
            <div className="specs flex-column-start-end">
              <div className="spec flex-column-center-end">
                <div className="key font-text-tiny-bold">Adress</div>
                <div className="value font-text-tiny">{item.mint}</div>
              </div>
              <div className="spec flex-column-center-end">
                <div className="key font-text-tiny-bold">Owner</div>
                <div className="value font-text-tiny">{owner}</div>
              </div>
              <div className="spec flex-column-center-end">
                <div className="key font-text-tiny-bold">Update Authority</div>
                <div className="value font-text-tiny">
                  {item.authorities[0].address}
                </div>
              </div>
              <div className="spec flex-column-center-end">
                <div className="key font-text-tiny-bold">Token Standard</div>
                <div className="value font-text-tiny">
                  {tokenStandards[item.type]}
                </div>
              </div>
              <div className="spec flex-column-center-end">
                <div className="key font-text-tiny-bold">Compressed</div>
                <div className="value font-text-tiny">
                  {item.compressed ? "Yes" : "No"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
