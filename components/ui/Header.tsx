import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import appIcon from "../../media/app-icon.png";
import { motion as m } from "framer-motion";
import { operations, paths, sections } from "../backend/AppData";

export default function Header({
  id,
  theme,
  themes,
}: {
  id: number;
  theme: number;
  themes: string[];
}) {
  const [tab, setTab] = useState({ id: 0, open: false });
  const [sectionId, setSectionId] = useState(0);
  return (
    <>
      <div
        id="header"
        className="header flex-row-between-start"
        data-theme={themes[theme]}
      >
        <div className="logo flex-row-center-center">
          <Image src={appIcon} alt="app-icon" />
          <div className="font-h4" key={"application-title"}>
            <Link href={"/"}>Preda</Link>
          </div>
        </div>
        <div className="operator-container flex-column-start-end">
          <div className="operators flex-row-center-start">
            {sections.map((item, index) => (
              <div
                key={"operator-" + index}
                className="flex-column-center-center"
                onClick={() => {
                  setSectionId(index);
                  if (index == sectionId) {
                    setTab({ id: index, open: !tab.open });
                  } else setTab({ id: index, open: true });
                }}
              >
                <div
                  className={
                    tab.open == true && sectionId == index
                      ? "operator flex-row-end-center font-text-small-bold " +
                        (id == index && "active")
                      : "operator flex-row-end-center font-text-small " +
                        (id == index && "active")
                  }
                >
                  {item}
                </div>
              </div>
            ))}
          </div>

          {tab.open == true && (
            <m.div
              className={"tabs active flex-column-end-end section"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.1, duration: 0.2 }}
            >
              {operations[sectionId].map((item, index) => (
                <Link
                  href={paths[sectionId][index]}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  key={
                    "operation-" + sectionId.toString() + "-" + index.toString()
                  }
                >
                  <div className="tab font-text-tiny flex-row-end-center">
                    {item}
                  </div>
                </Link>
              ))}
            </m.div>
          )}
        </div>
      </div>
    </>
  );
}
