import { Wallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import bs58 from "bs58";
//umi

import { keypairIdentity, percentAmount } from "@metaplex-foundation/umi";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { publicKey, generateSigner } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

import {
  burnV1,
  createProgrammableNft,
  createV1,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { TokenStandard } from "@metaplex-foundation/mpl-token-metadata";
import { enqueueSnackbar } from "notistack";

/**
 * Creates a new Metaplex PNFT (Non-Fungible Token).
 *
 * @param {Wallet} wallet - The wallet used for the transaction.
 * @param {Connection} connection - The connection to the Solana blockchain.
 * @param {Object} rawData - The raw data for the NFT, which will be transformed into metadata.
 * @returns {Promise<string>} The publickey of the item.
 */
export const createPNFT = async ({
  wallet,
  connection,
  title,
  sellerFeeBasisPoints,
  metadata,
}: {
  wallet: Wallet;
  connection: Connection;
  title: string;
  sellerFeeBasisPoints: number;
  metadata: string;
}): Promise<string> => {
  enqueueSnackbar("initialize umi", { variant: "info" });
  const umi = createUmi(connection.rpcEndpoint);
  umi.use(mplTokenMetadata());
  umi.use(walletAdapterIdentity(wallet.adapter));
  const mint = generateSigner(umi);
  try {
    const result = await createProgrammableNft(umi, {
      mint,
      name: title,
      uri: metadata,
      sellerFeeBasisPoints: percentAmount(sellerFeeBasisPoints),
    }).sendAndConfirm(umi);

    console.log("Mint: " + mint.publicKey);
    console.log("Signature: " + bs58.encode(result.signature));
    if (result.signature) {
      enqueueSnackbar("NFT created", { variant: "success" });
    }
    return mint.publicKey;
  } catch (error) {
    enqueueSnackbar("Error creating NFT: " + error, { variant: "error" });
    console.log(error);
    return "Error creating NFT: " + error;
  }
};

/**
 * Burns Metaplex PNFT.
 * @param {Wallet} wallet - The wallet used for the transaction.
 * @param {Connection} connection - The connection to the Solana blockchain.
 * @param {Object} mintAddress - The address of the NFT to be burned.
 */
export const burnPNFT = async ({
  wallet,
  connection,
  mintAdress,
}: {
  wallet: Wallet;
  connection: Connection;
  mintAdress: string;
}): Promise<string> => {
  enqueueSnackbar("initialize umi", { variant: "info" });
  const umi = createUmi(connection.rpcEndpoint);
  umi.use(mplTokenMetadata());
  umi.use(walletAdapterIdentity(wallet.adapter));
  const mint = generateSigner(umi);
  try {
    const signature = await burnV1(umi, {
      mint: publicKey(mintAdress),
      tokenStandard: TokenStandard.ProgrammableNonFungible,
      tokenOwner: umi.identity.publicKey,
    }).sendAndConfirm(umi);
    console.log("Mint: " + mint.publicKey);
    console.log("Signature: " + bs58.encode(signature.signature));
    return mint.publicKey;
  } catch (error) {
    enqueueSnackbar("Error creating PNFT: " + error, { variant: "error" });
    return "Error creating PNFT: " + error;
  }
};
