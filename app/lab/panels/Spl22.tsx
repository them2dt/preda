import React, { useState } from "react";
import { AnimatePresence, motion as m } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { CustomSlider } from "@/components/ui/Slider";
import { uploadFileToIrys, validateImage } from "@/backend/General";
import { enqueueSnackbar } from "notistack";
import { createToken22, burnToken22 } from "@/backend/SPL22";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { string } from "@metaplex-foundation/umi/serializers";

export default function Panel() {
  const { wallet } = useWallet();
  const { connection } = useConnection();

  const [attributeModal, setAttributeModal] = useState(false);
  const [renderHook, setRenderHook] = useState<number>(0);
  const [name, setName] = useState<string>();
  const [symbol, setSymbol] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [image, setImage] = useState<File>();
  const [imagePreview, setImagePreview] = useState<string>();
  const [sliderValue, setSliderValue] = useState<number>(0);
  const [key, setKey] = useState<string>();
  const [value, setValue] = useState<string>();
  const [attributes, setAttributes] = useState<{ trait_type: string; value: string }[]>();
  const [frozen, setFrozen] = useState<boolean>(false);
  const [transferTax, setTransferTax] = useState<number>(0);
  const [interest, setInterest] = useState<number>(0);
  const [authority, setAuthority] = useState<string>();
  const [amount, setAmount] = useState<number>(0);

  const removeAttribute = (index: number) => {
    const oldArray = attributes;
    if (oldArray) {
      oldArray.splice(index, 1);
      console.log(oldArray);
    }
  };

  const run = async () => {
    if (!wallet || !connection || !name || !symbol || !description || !image) {
      enqueueSnackbar("Füllen Sie die leeren Felder aus.", {
        variant: "error",
      });
    } else {
      enqueueSnackbar("Bild wird hochgeladen...", { variant: "info" });
      const imageUri = await uploadFileToIrys({
        wallet: wallet,
        connection: connection,
        file: image,
      });

      if (imageUri) {
        const metadata = {
          name: name,
          symbol: symbol,
          description: description,
          seller_fee_basis_points: sliderValue,
          image: imageUri,
          external_url: "emptea.xyz",
          properties: {
            files: [{ uri: imageUri, type: "image/png" }],
            category: "image",
            creators: [
              {
                address:
                  wallet.adapter.publicKey?.toBase58() ||
                  "DFoRBzY3odkJ53FgCeSj26Ps6Bk7tuZ5kaV47QsyrqnV",
                share: 100,
              },
            ],
            supply: 1,
            decimals: 9,
          },
          collection: {},
        };
        const metadataFile = new File(
          [JSON.stringify(metadata)],
          "metadata.json",
          { type: "application/json" }
        );
        const metadataUri = await uploadFileToIrys({
          wallet: wallet,
          connection: connection,
          file: metadataFile,
        });

        if (metadataUri) {
          const mint = await createToken22({
            wallet: wallet,
            connection: connection,
            name: name,
            symbol: symbol,
            decimals: 9,
            metadata: metadataUri,
            sellerFeeBasisPoints: sliderValue,
            amount: amount,
          });

          if (mint) {
            enqueueSnackbar("Token erstellt!", { variant: "success" });
          } else {
            enqueueSnackbar("Fehler beim Erstellen des Tokens.", { variant: "error" });
          }
        } else {
          enqueueSnackbar("Fehler beim Hochladen des Bildes.", { variant: "error" });
        }
      }
    }
  };

  return (
    <div>
      <h1>Create NFT Panel</h1>
      <input
        type="text"
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Symbol"
        onChange={(e) => setSymbol(e.target.value)}
      />
      <textarea
        placeholder="Description"
        onChange={(e) => setDescription(e.target.value)}
      />
      <CustomSlider value={sliderValue} setValue={setSliderValue} />
      <input
        type="number"
        placeholder="Amount"
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <div style={{ width: '200px', height: '200px', overflow: 'hidden' }}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              const file = e.target.files[0]
              setImage(file);
              setImagePreview(URL.createObjectURL(file));
            }
          }}
        />
        {imagePreview && <img src={imagePreview} alt="preview" style={{ maxWidth: '100%', maxHeight: '100%' }} />}
      </div>
      <button onClick={run}>Create NFT</button>
    </div>
  );
}