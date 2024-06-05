import labs from "../../media/emptea-labs/app-icons/emptea labs.png";
import preda from "../../media/emptea-labs/app-icons/emptea preda.png";
import galaxy from "../../media/emptea-labs/app-icons/emptea galaxy.png";
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
export const sections = ["NFT", "CORE", "CNFT", "SPL-20", "More"];
export const icons = [faImage, faBolt, faAtom, faCoins, faWandMagicSparkles];
export const opIcons = [faWandMagicSparkles, faFire];
export const operations = [
  ["Create", "Burn"],
  ["Create", "Burn"],
  ["Create", "Burn"],
  ["Create", "Burn"],
  ["Image uploader"],
];
export const paths = [
  ["/", "/burn"],
  ["/core/create", "/core/burn"],
  ["/cnft/create", "/cnft/burn"],
  ["/spl-20/create", "/spl-20/burn"],
  ["/more/image-uploader"],
];

// the themes of the platform
export const themes = ["white", "black", "pink", "navy"];
/**
 * 1-Primary
 * 2-Secondary
 * 3-Accent
 */
export const palette = [
  [
    ["#000000", "#0a0a0a", "#141414", "#1e1e1e", "#282828"],
    ["#FFFFFF", "#F2F2F2", "#E5E5E5", "#D9D9D9", "#CCCCCC"],
    ["#B763FF", "#C17DFF", "#CA97FF", "#D3B1FF", "#DCCBFF"],
  ],
  [
    ["#FFFFFF", "#F2F2F2", "#E5E5E5", "#D9D9D9", "#CCCCCC"],
    ["#000000", "#0a0a0a", "#141414", "#1e1e1e", "#282828"],
    ["#B763FF", "#C17DFF", "#CA97FF", "#D3B1FF", "#DCCBFF"],
  ],
  ,
  [
    ["#ff55cc", "#ff77cc", "#ff99cc", "#ffbbdd", "#ffddee"],
    ["#550022", "#50172d", "#5c283d", "#5e3948", "#614952"],
    ["#ff55cc", "#ff77cc", "#ff99cc", "#ffbbdd", "#ffddee"],
  ],
  ,
  [
    ["#62b8ff", "#7cc4ff", "#8fd2ff", "#b0e6ff", "#c1e8ff"],
    ["#083347", "#133849", "#163847", "#1d343f", "#36505c"],
    ["#62b8ff", "#7cc4ff", "#8fd2ff", "#b0e6ff", "#c1e8ff"],
  ],
];

export const emptea_links = [
  "https://emptea.xyz",
  "https://preda.emptea.xyz",
  "https://galaxy.emptea.xyz",
];
export const emptea_app_name = ["Home", "Preda", "Galaxy"];
export const emptea_app_icons = [labs, preda, galaxy];

export const RPC_MAINNET ="https://mainnet.helius-rpc.com/?api-key=73670a22-627e-4405-b80f-8fe0583892a9"
export const RPC_DEVNET ="https://devnet.helius-rpc.com/?api-key=73670a22-627e-4405-b80f-8fe0583892a9"
