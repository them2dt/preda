"use client";
import Image from "next/image";
import React, { useState } from "react";
import logo from "../media/app-icon.png";
import { motion } from "framer-motion";
import Link from "next/link";
import arweave from "../media/arweave.svg";
import metaplex from "../media/metaplex.svg";
import irys from "../media/irys.svg";
import Header from "@/components/Header";

export default function Page() {
  const [advanced, setAdvanced] = useState<boolean>(false);
  return (
    <>
      <Header id={0} theme={0} themes={["light"]} />
    </>
  );
}
