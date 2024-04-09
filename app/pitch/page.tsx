"use client";
import Image from "next/image";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Page() {
  const [advanced, setAdvanced] = useState<boolean>(false);
  return (
    <div className="homepage flex-column-center-center">
      <div className="section hero flex-column-start-center">
        <div className="board flex-column-center-center">
          <div className="navigation-container flex-row-center-center">
            <motion.div
              className="navigation flex-row-center-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.1, duration: 0.1 }}
            >
              <Link href={"https://youtu.be/8kfDtB8vA4Q?si=mtWz-spvkglCUXgq"} target="_blank">
                <div className="item launch font-h4">Open Pitch</div>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
