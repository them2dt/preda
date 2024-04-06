"use client";
import React, { useMemo } from "react";
import { WalletProvider } from "@solana/wallet-adapter-react";
import { ConnectionProvider } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
//
import { SnackbarProvider } from "notistack";
import { closeSnackbar } from "notistack";
import { MaterialDesignContent } from "notistack";
import { styled } from "@mui/material";

export default function RootComponent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const network = WalletAdapterNetwork.Devnet;
  const endpoint =
    "https://devnet.helius-rpc.com/?api-key=73670a22-627e-4405-b80f-8fe0583892a9";
  const wallets = useMemo(() => [], [network]);

  //custom snackbar
  const StyledMaterialDesignContent = styled(MaterialDesignContent)(() => ({
    "&.notistack-MuiContent-default": {
      backgroundColor: "#D3B1FF",
      color: "#38254b",
    },
    "&.notistack-MuiContent-success": {
      backgroundColor: "#c4ffd6",
      color: "#3eda65",
    },
    "&.notistack-MuiContent-error": {
      backgroundColor: "#ffc4c4",
      color: "#ab3a3a",
    },
    "&.notistack-MuiContent-info": {
      backgroundColor: "#D3B1FF",
      color: "#38254b",
    },
    "&.notistack-MuiContent-warning": {
      backgroundColor: "#fff07a",
      color: "#ab9e3a",
    },
  }));
  return (
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
  );
}