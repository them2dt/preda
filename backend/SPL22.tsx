import { Wallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import bs58 from "bs58";
//umi

import { PublicKey, percentAmount, publicKey } from "@metaplex-foundation/umi";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { generateSigner } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplCandyMachine } from "@metaplex-foundation/mpl-candy-machine";

import {
  createAndMint,
  createNft,
  createV1,
  mintV1,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { TokenStandard } from "@metaplex-foundation/mpl-token-metadata";
import { enqueueSnackbar } from "notistack";

export const createSPL22 = async ({
  wallet,
  connection,
  title,
  symbol,
  metadata,
  decimals,
  supply,
  sellerFeeBasisPoints,
}: {
  wallet: Wallet;
  connection: Connection;
  title: string;
  symbol: string;

  metadata: string;
  decimals: number;
  supply: number;
  sellerFeeBasisPoints: number;
}): Promise<{ pubkey: string; success: boolean }> => {
  const umi = createUmi(connection.rpcEndpoint);
  umi.use(mplTokenMetadata());
  umi.use(walletAdapterIdentity(wallet.adapter));
  umi.use(mplCandyMachine());
  const mint = generateSigner(umi);

  const SPL_TOKEN_2022_PROGRAM_ID = publicKey(
    "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
  );

  try {
    await createV1(umi, {
      mint,
      authority: umi.identity,
      name: title,
      symbol: symbol,
      uri: metadata,
      sellerFeeBasisPoints: percentAmount(sellerFeeBasisPoints),
      decimals: decimals,
      printSupply: { __kind: "Limited", fields: [supply] },
      tokenStandard: TokenStandard.Fungible,
      splTokenProgram: SPL_TOKEN_2022_PROGRAM_ID,
    })
      .sendAndConfirm(umi)
      .then((result) => {
        if (result.signature) {
          console.log("Success! Mint: " + mint.publicKey);
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
    success: false,
  };
};

export const mintSPL22 = async ({
  wallet,
  connection,
  mint,
  amount,
}: {
  wallet: Wallet;
  connection: Connection;
  mint: PublicKey;
  amount: number;
}): Promise<{ pubkey: string; success: boolean }> => {
  const umi = createUmi(connection.rpcEndpoint);

  umi.use(mplTokenMetadata());
  umi.use(walletAdapterIdentity(wallet.adapter));
  umi.use(mplCandyMachine());

  const SPL_TOKEN_2022_PROGRAM_ID = publicKey(
    "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
  );

  try {
    await mintV1(umi, {
      mint,
      authority: umi.identity,
      amount: amount,
      tokenStandard: TokenStandard.Fungible,
      splTokenProgram: SPL_TOKEN_2022_PROGRAM_ID,
    })
      .sendAndConfirm(umi)
      .then((result) => {
        if (result.signature) {
          console.log("Successfully minted" + amount + " SPL-22 token.");
          return {
            pubkey: mint,
            success: true,
          };
        } else {
          console.log("Couldn't find transaction.");
          return {
            pubkey: mint,
            success: false,
          };
        }
      });
  } catch (e) {
    console.log("Error @ CreateSPL20(): " + e);
  }
  return {
    pubkey: mint,
    success: false,
  };
};
