import { Wallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
//umi

import { generateSigner } from "@metaplex-foundation/umi";
import { percentAmount, publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplCandyMachine } from "@metaplex-foundation/mpl-candy-machine";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";

import {
  mintV1,
  createV1,
  TokenStandard,
  mplTokenMetadata,
  burnV1,
} from "@metaplex-foundation/mpl-token-metadata";
import { findAssociatedTokenPda } from "@metaplex-foundation/mpl-toolbox";
import {
  getAssociatedTokenAddressSync,
  getAccount,
  getMint,
} from "@solana/spl-token";

export const createAndMintSPL22 = async ({
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
}): Promise<{ status: number; pubkey: string }> => {
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
    name: name,
    symbol: symbol,
    uri: metadata,
    sellerFeeBasisPoints: percentAmount(sellerFeeBasisPoints),
    decimals: decimals,
    printSupply: { __kind: "Limited", fields: [supply * 10 ** decimals] },
    tokenStandard: TokenStandard.Fungible,
    splTokenProgram: SPL_TOKEN_2022_PROGRAM_ID,
  });
  const token = findAssociatedTokenPda(umi, {
    mint: mint.publicKey,
    owner: umi.identity.publicKey,
    tokenProgramId: SPL_TOKEN_2022_PROGRAM_ID,
  });
  const mintTX = mintV1(umi, {
    mint: mint.publicKey,
    token,
    authority: umi.identity,
    amount: supply * 10 ** decimals,
    tokenOwner: umi.identity.publicKey,
    splTokenProgram: SPL_TOKEN_2022_PROGRAM_ID,
    tokenStandard: TokenStandard.Fungible,
  });
  try {
    await createTX
      .sendAndConfirm(umi, {
        send: { skipPreflight: true },
        confirm: { commitment: "confirmed" },
      })
      .then((result) => {
        console.log(
          "Token has been created!: " + bs58.encode(result.signature)
        );
      });
    setTimeout(async () => {
      await mintTX
        .sendAndConfirm(umi, {
          send: { skipPreflight: true },
          confirm: { commitment: "confirmed" },
        })
        .then((result) => {
          console.log(
            "Token has been minted!: " + bs58.encode(result.signature)
          );
        });
    }, 8000);

    return {
      status: 200,
      pubkey: mint.publicKey,
    };
  } catch (e) {
    console.log("Error @ CreateAndMint(): " + e);
    return {
      status: 400,
      pubkey: mint.publicKey,
    };
  }
};

export const burnSPL22 = async ({
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
  const SPL_TOKEN_2022_PROGRAM_ID = publicKey(
    "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
  );
  const umi = createUmi(connection.rpcEndpoint);

  umi.use(mplTokenMetadata());
  umi.use(walletAdapterIdentity(wallet.adapter));
  umi.use(mplCandyMachine());

  try {
    const token = findAssociatedTokenPda(umi, {
      mint: publicKey(assetId),
      owner: umi.identity.publicKey,
      tokenProgramId: SPL_TOKEN_2022_PROGRAM_ID,
    });
    const response = await burnV1(umi, {
      mint: publicKey(assetId),
      token,
      tokenStandard: TokenStandard.Fungible,
      splTokenProgram: SPL_TOKEN_2022_PROGRAM_ID,
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
    console.log("Error @ BurnSPL22(): " + e);
    return false;
  }
};

export async function getBalanceFromToken22({
  wallet,
  connection,
  assetId,
}: {
  wallet: Wallet;
  connection: Connection;
  assetId: string;
}): Promise<{ balance: number; decimals: number }> {
  try {
    const tokenAccount = getAssociatedTokenAddressSync(
      new PublicKey(assetId),
      wallet.adapter.publicKey,
      true,
      new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb")
    );
    const info = await getAccount(
      connection,
      new PublicKey(tokenAccount.toBase58()),
      "confirmed",
      new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb")
    );
    const amount = Number(info.amount);
    const mint = await getMint(
      connection,
      info.mint,
      "confirmed",
      new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb")
    );
    const balance = amount;
    return { balance: balance, decimals: mint.decimals };
  } catch (e) {
    console.log("Error @ GBT22: " + e);
  }
}
