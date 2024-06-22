import { Wallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
//umi

import { percentAmount, publicKey } from "@metaplex-foundation/umi";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { generateSigner } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplCandyMachine } from "@metaplex-foundation/mpl-candy-machine";

import {
  burnV1,
  createAndMint,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { TokenStandard } from "@metaplex-foundation/mpl-token-metadata";
import { enqueueSnackbar } from "notistack";
import { getAsset } from "./General";


export const createAndMintSPL20 = async ({
  wallet,
  connection,
  name,
  symbol,
  metadata,
  decimals,
  supply,
  sellerFeeBasisPoints,
}: {
  wallet: Wallet;
  connection: Connection;
  name: string;
  symbol: string;

  metadata: string;
  decimals: number;
  supply: number;
  sellerFeeBasisPoints: number;
}): Promise<{ pubkey: string; success: boolean }> => {
  enqueueSnackbar("initialize umi", { variant: "info" });
  const umi = createUmi(connection.rpcEndpoint);

  umi.use(mplTokenMetadata());
  umi.use(walletAdapterIdentity(wallet.adapter));
  umi.use(mplCandyMachine());

  const mint = generateSigner(umi);

  try {
    await createAndMint(umi, {
      mint,
      authority: umi.identity,
      name: name,
      symbol: symbol,
      uri: metadata,
      sellerFeeBasisPoints: percentAmount(sellerFeeBasisPoints),
      decimals: decimals,
      amount: supply,
      tokenOwner: umi.identity.publicKey,
      tokenStandard: TokenStandard.Fungible,
    })
      .sendAndConfirm(umi)
      .then((result) => {
        if (result.signature) {
          console.log("Successfully created your SPL-20 token.");
          return {
            pubkey: mint.publicKey,
            success: true,
          };
        } else {
          console.log("Couldn't find transaction.");
          return {
            pubkey: mint.publicKey,
            success: false,
          };
        }
      });
  } catch (e) {
    console.log("Error @ CreateSPL20(): " + e);
  }
  return {
    pubkey: mint.publicKey,
    success: true,
  };
};
export const burnSPL20 = async ({
  wallet,
  connection,
  assetId,
  amount,
}: {
  wallet: Wallet;
  connection: Connection;
  assetId: string;
  amount: number;
}): Promise<boolean> => {
  enqueueSnackbar("initialize umi", { variant: "info" });
  const umi = createUmi(connection.rpcEndpoint);

  umi.use(mplTokenMetadata());
  umi.use(walletAdapterIdentity(wallet.adapter));
  umi.use(mplCandyMachine());

  try {
    const response = await burnV1(umi, {
      mint: publicKey(assetId),
      tokenStandard: TokenStandard.Fungible,
      tokenOwner: umi.identity.publicKey,
      amount: amount,
    })
      .sendAndConfirm(umi, { confirm: { commitment: "confirmed" } })
      .then((result) => {
        if (result.signature) {
          return true;
        } else {
          return false;
        }
      });

    return response;
  } catch (e) {
    console.log("Error @ BurnSPL20(): " + e);
    return false;
  }
};
