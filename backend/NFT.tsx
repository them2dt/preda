import { useState } from "react";
import { Connection, PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import mplTokenMetadata from "@metaplex-foundation/mpl-token-metadata";
import { clusterApiUrl } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter";
import { ShdwDrive } from "@shadow-drive/sdk";

/**
 * Creates a new Metaplex Standard NFT (Non-Fungible Token).
 * @returns {Promise<string>} The signature of the transaction.
 */
const createStandardNFT = async (file, connection, wallet) => {
  if (!connection || !wallet) {
    throw new Error("Connection or wallet not provided.");
  }

  const drive = new ShdwDrive(connection, wallet);
  try {
    await drive.init();
  } catch (e) {
    throw new Error("Failed to initialize ShdwDrive: " + e.message);
  }

  try {
    const newAcct = await drive.createStorageAccount("myDemoBucket", "10MB", "v2");
    console.log("Shadow account created.");
    console.log("Shdw Bucket: " + newAcct.shdw_bucket);

    const accounts = await drive.getStorageAccounts();
    const account = accounts[0].publicKey;
    console.log("Retrieved storage account ", account.toBase58());

    const upload = await drive.uploadFile(account, file);
    console.log("Uploaded file successfully at ", upload.finalized_locations[0]);

    const umi = createUmi({ connection, wallet });
    await umi.configure({}); // Add configuration options here

    // Implement NFT creation logic
    const metadata = new MetaplexNftMetadata({
      name: "My NFT",
      symbol: "NFT",
      description: "This is my NFT.",
      sellerFeeBasisPoints: 500, // 5%
      image: upload.finalized_locations[0],
    });

    const nft = await umi.nfts().create({
      metadata,
      uri: metadata.uri,
      file,
    });

    console.log("NFT created:", nft);

    return nft.transactionSignature; // Return the transaction signature
  } catch (e) {
    throw new Error("Error in NFT creation: " + e.message);
  }
};

const MyComponent = () => {
  // Initialize the file state variable with a default file
  const [file, setFile] = useState(
    new File(["Max Mustermann"], "muster.png", { type: "image/png" })
  );

  // Get the Solana connection and wallet
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const wallet = useWallet();

  // Create the NFT
  createStandardNFT(file, connection, wallet)
    .then((transactionSignature) => {
      console.log("NFT created:", transactionSignature);
    })
    .catch((error) => {
      console.error("Error creating NFT:", error);
    });
    return (
      <div>
        <h1>Create NFT</h1>
        <form>
          <label htmlFor="file">File:</label>
          <input
            type="file"
            id="file"
            accept=".jpg,.jpeg,.png,.gif"
            onChange={(event) => {
              setFile(event.target.files[0]);
            }}
          />
          <button type="button" onClick={() => createStandardNFT(file, connection, wallet)}>
            Create NFT
          </button>
        </form>
      </div>
    );
};