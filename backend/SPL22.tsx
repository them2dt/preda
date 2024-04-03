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
  fetchDigitalAsset,
  fetchDigitalAssetByMetadata,
  mintV1,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { TokenStandard } from "@metaplex-foundation/mpl-token-metadata";
import { enqueueSnackbar } from "notistack";
import { findAssociatedTokenPda } from "@metaplex-foundation/mpl-toolbox";

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
    const result = await createV1(umi, {
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
    return result;
  } catch (e) {
    console.log("Error @ CreateSPL22(): " + e);
  }
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
      mint: mint,
      authority: umi.identity,
      amount: 1,
      tokenOwner: umi.identity.publicKey,
      splTokenProgram: SPL_TOKEN_2022_PROGRAM_ID,
      tokenStandard: TokenStandard.NonFungible,
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
export const createAndMintSPL22 = async ({
  wallet,
  connection,
}: {
  wallet: Wallet;
  connection: Connection;
}): Promise<any> => {
  const umi = createUmi(connection.rpcEndpoint);
  umi.use(mplTokenMetadata());
  umi.use(walletAdapterIdentity(wallet.adapter));
  umi.use(mplCandyMachine());
  const mint = generateSigner(umi);

  const SPL_TOKEN_2022_PROGRAM_ID = publicKey(
    "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
  );
  const createTX = createV1(umi, {
    mint: mint,
    authority: umi.identity,
    name: "Create & Mint",
    symbol: "CAM",
    uri: "https://f42abbnzgpfcythaneahoculqsl3si34lgkwdsnrwrw44b6j3kda.arweave.net/LzQAhbkzyixM4GkAdwqLhJe5I3xZlWHJsbRtzgfJ2oY",
    sellerFeeBasisPoints: percentAmount(0),
    decimals: 2,
    printSupply: { __kind: "Limited", fields: [1000] },
    tokenStandard: TokenStandard.Fungible,
    splTokenProgram: SPL_TOKEN_2022_PROGRAM_ID,
  });
  try {
    console.log("Sent TX1.");
    const TX1 = await createTX.sendAndConfirm(umi, {
      confirm: { commitment: "confirmed" },
    });
    setTimeout(async () => {
      console.log("Waiting...");
      const token = findAssociatedTokenPda(umi, {
        mint: mint.publicKey,
        owner: umi.identity.publicKey,
        tokenProgramId: SPL_TOKEN_2022_PROGRAM_ID,
      });
      console.log("Token Result: " + token[0]);

      const mintTX = mintV1(umi, {
        mint: mint.publicKey,
        token,
        authority: umi.identity,
        amount: 1000,
        tokenOwner: umi.identity.publicKey,
        splTokenProgram: SPL_TOKEN_2022_PROGRAM_ID,
        tokenStandard: TokenStandard.Fungible,
      });

      const mintResult = await mintTX.sendAndConfirm(umi, {
        send: { skipPreflight: true },
      });

      /**
       * PRINT OUT
       */
      console.log("Sent TX2");
      console.log("Signature: " + bs58.encode(mintResult.signature));
    }, 10000);
  } catch (e) {
    console.log("Error @ CreateAndMint(): " + e);
  }
};

export const findSPL22 = async ({
  wallet,
  connection,
  metadata,
}: {
  wallet: Wallet;
  connection: Connection;
  metadata: string;
}): Promise<{ status: number }> => {
  const umi = createUmi(connection.rpcEndpoint);
  umi.use(mplTokenMetadata());
  umi.use(walletAdapterIdentity(wallet.adapter));
  try {
    const asset = await fetchDigitalAsset(umi, publicKey(metadata));
    if (asset.metadata.tokenStandard["value"] && asset.mint.decimals) {
      console.log("Asset Found!");
      return { status: 200 };
    } else {
      console.log("Asset not found.");
      return { status: 400 };
    }
  } catch (e) {
    console.log("Couldn't find shit.");
    return { status: 404 };
  }
};
