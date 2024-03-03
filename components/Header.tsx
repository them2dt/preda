import React, { useState } from "react";
import { motion as m } from "framer-motion";

export default function Header({
  panel,
  setPanel,
  theme,
}: {
  panel: number;
  setPanel: Function;
  theme: number;
}) {
  const labels = ["Create NFT", "Duplicate NFT", "Edit NFT", "Burn NFT"];
  const [operator, setOperator] = useState(false);

  return (
    <>
      <m.div
        id="header"
        className="header flex-row-between-center"
        data-theme={theme == 0 ? "light" : "dark"}
      >
        <m.div className="logo font-h4">Preda</m.div>
        <m.div
          className="operator font-text-tiny"
          onClick={() => {
            setOperator(!operator);
          }}
        >
          {labels[panel]}
        </m.div>
      </m.div>
      {operator && (
        <m.div
          id="operator-catalog"
          className="flex-row-between-start"
          data-theme={theme == 0 ? "light" : "dark"}
        >
          <m.div className="header-operations-topic flex-column-center-end">
            <m.div className="header-operations-topic-title font-text-bold">
              NFT
            </m.div>
            <m.div className="header-operation">Create</m.div>
            <m.div className="header-operation">Duplicate</m.div>
            <m.div className="header-operation">Edit</m.div>
            <m.div className="header-operation">Burn</m.div>
          </m.div>
          <m.div className="header-operations-topic flex-column-center-end">
            <m.div className="header-operations-topic-title font-text-bold">
              pNFT
            </m.div>
            <m.div className="header-operation">Create</m.div>
            <m.div className="header-operation">Duplicate</m.div>
            <m.div className="header-operation">Edit</m.div>
            <m.div className="header-operation">Burn</m.div>
          </m.div>
          <m.div className="header-operations-topic flex-column-center-end">
            <m.div className="header-operations-topic-title font-text-bold">
              cNFT
            </m.div>
            <m.div className="header-operation">Create</m.div>
            <m.div className="header-operation">Duplicate</m.div>
            <m.div className="header-operation">Edit</m.div>
            <m.div className="header-operation">Burn</m.div>
          </m.div>
          <m.div className="header-operations-topic flex-column-center-end">
            <m.div className="header-operations-topic-title font-text-bold">
              SPL-20
            </m.div>
            <m.div className="header-operation">Create</m.div>
            <m.div className="header-operation">Duplicate</m.div>
            <m.div className="header-operation">Edit</m.div>
            <m.div className="header-operation">Burn</m.div>
          </m.div>
          <m.div className="header-operations-topic flex-column-center-end">
            <m.div className="header-operations-topic-title font-text-bold">
              Token2022
            </m.div>
            <m.div className="header-operation">Create</m.div>
            <m.div className="header-operation">Duplicate</m.div>
            <m.div className="header-operation">Edit</m.div>
            <m.div className="header-operation">Burn</m.div>
          </m.div>
          <m.div className="header-operations-topic flex-column-center-end">
            <m.div className="header-operations-topic-title font-text-bold">
              Extensions
            </m.div>
            <m.div className="header-operation">Create</m.div>
            <m.div className="header-operation">Duplicate</m.div>
            <m.div className="header-operation">Edit</m.div>
            <m.div className="header-operation">Burn</m.div>
          </m.div>
          <m.div className="header-operations-topic flex-column-center-end">
            <m.div className="header-operations-topic-title font-text-bold">
              General
            </m.div>
            <m.div className="header-operation">Gallery</m.div>
            <m.div className="header-operation">Analytics</m.div>
          </m.div>
        </m.div>
      )}
    </>
  );
}
