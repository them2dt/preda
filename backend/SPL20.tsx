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
import { BackendResponse } from "@/types";
import base58 from "bs58";

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
}): Promise<BackendResponse> => {
  try {
    const umi = createUmi(connection.rpcEndpoint);
    umi.use(mplTokenMetadata());
    umi.use(walletAdapterIdentity(wallet.adapter));
    umi.use(mplCandyMachine());

    const mint = generateSigner(umi);

    const response = await createAndMint(umi, {
      mint,
      authority: umi.identity,
      name: name,
      symbol: symbol,
      uri: metadata,
      sellerFeeBasisPoints: percentAmount(sellerFeeBasisPoints),
      decimals: decimals,
      amount: supply * 10 ** decimals,
      tokenOwner: umi.identity.publicKey,
      tokenStandard: TokenStandard.Fungible,
    })
      .sendAndConfirm(umi)
      .then((result) => {
        return {
          assetID: mint.publicKey,
          signature: base58.encode(result.signature),
          status: 200,
        };
      });

    return response;
  } catch (e) {
    return { status: 500, errorMessage: e || "" };
  }
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
}): Promise<BackendResponse> => {
  try {
    const umi = createUmi(connection.rpcEndpoint);
    umi.use(mplTokenMetadata());
    umi.use(walletAdapterIdentity(wallet.adapter));
    umi.use(mplCandyMachine());

    const response = await burnV1(umi, {
      mint: publicKey(assetId),
      tokenStandard: TokenStandard.Fungible,
      tokenOwner: umi.identity.publicKey,
      amount: amount,
    })
      .sendAndConfirm(umi, { confirm: { commitment: "confirmed" } })
      .then((result) => {
        return {
          assetID: assetId,
          signature: base58.encode(result.signature),
          status: 200,
        };
      });

    return response;
  } catch (e) {
    return { status: 500, errorMessage: e || "" };
  }
};
