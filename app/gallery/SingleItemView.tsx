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
  owner,
  item,
  closePanel,
}: {
  owner: string;
  item: {
    imageUri: string;
    name: string;
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
    >
      <div id="item-panel flex-column-center-center">
        <div className="close-button">
          <FontAwesomeIcon icon={faClose} />
        </div>
        <div className="column flex-column-start-center">
            <div className="image"></div>
            <div className="image"></div>
        </div>
      </div>
    </motion.div>
  );
}
