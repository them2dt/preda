"use client";
// stylesheets
import "../style/globals.css";
import "../style/skeleton.css";
import "../style/navigation.css";
import "../style/adapter.css";
import "../style/profile.css";
import "../style/leaderboard.css";
import "../style/gallery.css";
//
import "../style/panels/panel.css";
import "../style/panels/nft.css";
import "../style/panels/spl.css";

// imports
import { useMemo } from "react";
import { WalletProvider } from "@solana/wallet-adapter-react";
import { ConnectionProvider } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
//
import { SnackbarProvider } from "notistack";
import { closeSnackbar } from "notistack";
import { MaterialDesignContent } from "notistack";
import { styled } from "@mui/material";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(
    () =>
      "https://devnet.helius-rpc.com/?api-key=5d69c879-36f4-4acf-87b4-e44a64c07acc",
    [network]
  );
  const wallets = useMemo(() => [], [network]);

  //custom snackbar
  const StyledMaterialDesignContent = styled(MaterialDesignContent)(() => ({
    "&.notistack-MuiContent-default": {
      backgroundColor: "#D3B1FF",
      color: "#38254b",
    },
    "&.notistack-MuiContent-success": {
      backgroundColor: "#D3B1FF",
      color: "#38254b",
    },
    "&.notistack-MuiContent-error": {
      backgroundColor: "#D3B1FF",
      color: "#38254b",
    },
    "&.notistack-MuiContent-info": {
      backgroundColor: "#D3B1FF",
      color: "#38254b",
    },
    "&.notistack-MuiContent-warning": {
      backgroundColor: "#D3B1FF",
      color: "#38254b",
    },
  }));

  return (
    <html lang="en">
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets}>
          <WalletModalProvider>
            <body>
              <SnackbarProvider
                maxSnack={3}
                autoHideDuration={3000}
                action={(snackbarId) => (
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onClick={() => closeSnackbar(snackbarId)}
                  >
                    ✖️
                  </button>
                )}
                Components={{
                  default: StyledMaterialDesignContent,
                  info: StyledMaterialDesignContent,
                  warning: StyledMaterialDesignContent,
                  success: StyledMaterialDesignContent,
                  error: StyledMaterialDesignContent,
                }}
              >
                {children}
              </SnackbarProvider>
            </body>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </html>
  );
}
