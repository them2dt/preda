import React from "react";
import { motion } from "framer-motion";
import { Tooltip } from "@mui/material";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFireFlameCurved,
  faCopy,
  faPaperPlane,
  faClose,
} from "@fortawesome/free-solid-svg-icons";
export default function SingleItemView({
  theme,
  owner,
  item,
  closePanel,
}: {
  theme: number;
  owner: string;
  item: {
    imageUri: string;
    name: string;
    description: string;
    mint: string;
    updateAuthority: string;
    attributes: { trait_type: string; value: string }[];
  };
  closePanel: () => void;
}) {
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
            <div className="title flex-column-center-start">
              <div className="key font-text-tiny">Description</div>
              <div className="value font-text-bold">{item.description}</div>
            </div>
          </div>
          <div className="column first flex-column-center-start">
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
          </div>
        </div>
      </div>
    </motion.div>
  );
}
