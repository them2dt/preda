import { Wallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import bs58 from "bs58";
//umi

import { percentAmount } from "@metaplex-foundation/umi";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { publicKey, generateSigner } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

import {
  burnV1,
  createNft,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { TokenStandard } from "@metaplex-foundation/mpl-token-metadata";
import { BackendResponse } from "@/types";
import base58 from "bs58";

export const createNFT = async ({
  wallet,
  connection,
  title,
  sellerFeeBasisPoints,
  metadata,
  creators,
}: {
  wallet: Wallet;
  connection: Connection;
  title: string;
  sellerFeeBasisPoints: number;
  metadata: string;
  creators: { address: string; share: number }[];
}): Promise<BackendResponse> => {
  try {
    const umi = createUmi(connection.rpcEndpoint);
    umi.use(mplTokenMetadata());
    umi.use(walletAdapterIdentity(wallet.adapter));
    const mint = generateSigner(umi);
    console.log({
      mint,
      name: title,
      uri: metadata,
      sellerFeeBasisPoints: percentAmount(sellerFeeBasisPoints),
      creators: creators.map((item) => {
        return {
          address: publicKey(item.address),
          share: item.share,
          verified: false,
        };
      }),
    });
    const result = await createNft(umi, {
      mint,
      name: title,
      uri: metadata,
      sellerFeeBasisPoints: percentAmount(sellerFeeBasisPoints),
      creators: creators.map((item) => {
        return {
          address: publicKey(item.address),
          share: item.share,
          verified: false,
        };
      }),
    }).sendAndConfirm(umi);
    return {
      assetID: mint.publicKey,
      signature: bs58.encode(result.signature),
      status: 200,
    };
  } catch (e) {
    return { status: 500, errorMessage: String(e) || "" };
  }
};

export const burnNFT = async ({
  wallet,
  connection,
  assetId,
}: {
  wallet: Wallet;
  connection: Connection;
  assetId: string;
}): Promise<BackendResponse> => {
  try {
    const umi = createUmi(connection.rpcEndpoint);
    umi.use(mplTokenMetadata());
    umi.use(walletAdapterIdentity(wallet.adapter));
    const response = await burnV1(umi, {
      mint: publicKey(assetId),
      tokenStandard: TokenStandard.NonFungible,
      tokenOwner: umi.identity.publicKey,
    }).sendAndConfirm(umi, { confirm: { commitment: "confirmed" } });
    return {
      status: 200,
      assetID: assetId,
      signature: base58.encode(response.signature),
    };
  } catch (e) {
    return { status: 500, errorMessage: String(e) || "" };
  }
};