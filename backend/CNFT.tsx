import { Wallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import bs58 from "bs58";
//umi
import { none } from "@metaplex-foundation/umi";
import { mintV1, createTree } from "@metaplex-foundation/mpl-bubblegum";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { generateSigner } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { enqueueSnackbar } from "notistack";
import { PublicKey } from "@solana/web3.js";
import { SystemProgram } from "@solana/web3.js";





/**
 * Creates a new Metaplex PNFT.
 *
 * @param {Wallet} wallet - The wallet used for the transaction.
 * @param {Connection} connection - The connection to the Solana blockchain.
 * @param {Object} rawData - The raw data for the NFT, which will be transformed into metadata.
 * @returns {Promise<string>} The publickey of the item.
 */
export const createCNFT = async ({
  wallet,
  connection,
  title,
  sellerFeeBasisPoints,
  metadata,
  nftPublicKey,
}: {
  wallet: Wallet;
  connection: Connection;
  title: string;
  sellerFeeBasisPoints: number;
  metadata: string;
  nftPublicKey?: PublicKey;
}): Promise<any> => {
  enqueueSnackbar("initialize umi", { variant: "info" });
  const umi = createUmi(connection.rpcEndpoint);
  umi.use(walletAdapterIdentity(wallet.adapter));
  const merkleTree = generateSigner(umi);

  //create "create tree" transaction
  console.log("Creating Merkle Tree...");
  const treeTX = await createTree(umi, {
    merkleTree,
    maxDepth: 3,
    maxBufferSize: 8,
  });
  //send "create tree" transaction
  const treeTXResult = await treeTX.sendAndConfirm(umi);
  console.log("Tree Signature: " + bs58.encode(treeTXResult.signature));
  //wait
  setTimeout(() => {
    console.log("Timed out.");
  }, 1000);
  // create "mint CNFT" transaction
  console.log("Minting CNFT...");
  const mintTX = mintV1(umi, {
    leafOwner: nftPublicKey || umi.identity.publicKey, // use nftPublicKey if it's provided, otherwise use the identity public key
    merkleTree: merkleTree.publicKey,
    metadata: {
      name: title,
      uri: metadata,
      sellerFeeBasisPoints: sellerFeeBasisPoints * 100, // 5%
      collection: none(),
      creators: [
        { address: umi.identity.publicKey, verified: false, share: 100 },
      ],
    },
  });
  //send "mint CNFT" transaction
  const mintTXResult = await mintTX.sendAndConfirm(umi);
  console.log("Mint Signature: " + bs58.encode(mintTXResult.signature));
  //log the signature
};

//TODO: Add a function to duplicate an NFT, which takes a wallet object and a connection object and the publickey of the NFT to burn.
export const duplicateNFT = async (
  wallet: Wallet,
  connection: Connection,
  nftPublicKey: PublicKey
): Promise<any> => {
  enqueueSnackbar("Initializing umi", { variant: "info" });
  const umi = createUmi(connection.rpcEndpoint);
  umi.use(walletAdapterIdentity(wallet.adapter));

  const nftMetadata = await connection.getAccountInfo(nftPublicKey);

  if (!nftMetadata) {
    throw new Error("NFT metadata not found");
  }

  const metadata = JSON.parse(nftMetadata.data.toString()) as any;

  //create new CNFT with same metadata as original
  return createCNFT({
    wallet,
    connection,
    title: metadata.name,
    sellerFeeBasisPoints: metadata.seller_fee_basis_points,
    metadata: metadata.uri,
    nftPublicKey,
  });
  
};


//TODO: Add a function to burn an NFT, which takes a wallet object and a connection object and the publickey of the NFT to duplicate.
export const burnNFT = async (
  wallet: Wallet,
  connection: Connection,
  nftPublicKey: PublicKey
): Promise<void> => {
  const umi = createUmi(connection.rpcEndpoint);
  umi.use(walletAdapterIdentity(wallet.adapter));

  const nftAccount = await connection.getAccountInfo(nftPublicKey);

  if (!nftAccount) {
    throw new Error("NFT account not found");
  }

  const metadata = JSON.parse(nftAccount.data.toString()) as any;

  const burnInstruction = SystemProgram.transfer({
    fromPubkey: nftPublicKey,
    toPubkey: SystemProgram.programId,
    lamports: nftAccount.lamports,
  });

  const transaction = new Transaction().add(burnInstruction);

  const signature = await connection.sendRawTransaction(transaction, { skipPreflight: true, signers: [umi.identity.payer] });
  await transaction.confirm(connection, "confirmed");
  
 //console.log("Burn Signature: " + bs58.encode(signature));
 console.log("Burn Signature: " + Buffer.from(signature, "base64"));

};