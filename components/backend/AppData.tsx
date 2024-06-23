import {
  faAtom,
  faBolt,
  faCoins,
  faFire,
  faImage,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";

//Simple exports

//Menu objects
export const sections = ["NFT", "CORE", "CNFT", "SPL-20"];
export const icons = [faImage, faBolt, faAtom, faCoins, faWandMagicSparkles];
export const opIcons = [faWandMagicSparkles, faFire];
export const operations = [
  ["Create an asset", "Burn an asset"],
  ["Create an asset", "Burn an asset", "Create a collection"],
  ["Create an asset", "Burn an asset", "Create a collection"],
  ["Create an asset", "Burn an asset"],
];
export const paths = [
  ["/create", "/burn"],
  ["/core/create", "/core/burn", "/core/create-collection"],
  ["/cnft/create", "/cnft/burn", "/cnft/create-collection"],
  ["/spl-20/create", "/spl-20/burn"],
  ["/more/image-uploader"],
];

// the themes of the platform
export const themes = ["light", "dark", "candy", "navy"];

export const emptea_links = [
  "https://emptea.xyz",
  "https://preda.emptea.xyz",
  "https://galaxy.emptea.xyz",
];
export const emptea_app_name = ["Home", "Preda", "Galaxy"];

export const RPC_MAINNET = process.env.NEXT_PUBLIC_RPC_MAINNET || "double fuck";
export const RPC_DEVNET = process.env.NEXT_PUBLIC_RPC_DEVNET || "fuck";
