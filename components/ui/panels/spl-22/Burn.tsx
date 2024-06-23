"use client";
import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Slider } from "@/components/ui/TeaUI";;
import { enqueueSnackbar } from "notistack";
import { burnSPL22, getBalanceFromToken22 } from "@/components/backend/SPL22";

export default function Panel() {
  const [decimals, setDecimals] = useState<number>(0);
  const [supply, setSupply] = useState<number>(0);
  const [maxSupply, setMaxSupply] = useState<number>(0);
  const [token, setToken] = useState<string>();
  const [tokenVerified, setTokenVerified] = useState<boolean>(false);

  const { wallet } = useWallet();
  const { connection } = useConnection();const burn = async () => {
    try {
      const result = await burnSPL22({
        wallet: wallet,
        connection: connection,
        assetId: token,
        amount: supply,
      });
      if (result) {
        enqueueSnackbar(
          "Successfully burnt " +
            (supply / 10 ** decimals).toString() +
            " tokens.",
          {
            variant: "success",
          }
        );
      } else {
        enqueueSnackbar(
          "Couldnt burn " + (supply / 10 ** decimals).toString() + " tokens.",
          {
            variant: "error",
          }
        );
      }
    } catch (e) {
      enqueueSnackbar("Something went wrong.", {
        variant: "error",
      });
    }
  };
  const validate = async () => {
    try {
      const res = await getBalanceFromToken22({
        wallet: wallet,
        connection: connection,
        assetId: token,
      });
      if (res.balance > 1) {
        console.log(res.balance);
        setDecimals(res.decimals);
        setMaxSupply(res.balance);
        setTokenVerified(true);
        enqueueSnackbar("Token found.", { variant: "success" });
      } else {
        enqueueSnackbar("Token balance is 0.", { variant: "warning" });
      }
    } catch (e) {
      enqueueSnackbar("Something went wrong.", { variant: "error" });
      console.log(e);
    }
  };

  return (
    <>
      <div className="panel-container flex-column-center-center">
        <div className="font-h3">Burn SPL22-Tokens</div>

        <div className="address-validator flex-row-start-center">
          <input
            type="text"
            name="title"
            placeholder="Address of your token"
            className="font-text-small"
            onChange={(e) => {
              setTokenVerified(false);
              setToken(e.target.value);
            }}
          />
          <div className="button-base">
            <button
              disabled={!wallet || !connection || !token}
              className="button flex-row-center-center font-text-tiny-bold"
              onClick={async () => {
                await validate();
              }}
            >
              Verify Token
            </button>
          </div>
        </div>
        <div
          id="lab-panel-spl"
          className={
            tokenVerified ? "panel spl-burn" : "panel spl-burn disabled"
          }
        >
          <div className="flex-column-center-center form-container">
            <div className="flex-row-center-start form">
              <div className="royalties flex-column-center-center">
                <div className="legend flex-row-center-center">
                  <div className="font-text-small-bold">
                    {(supply / 10 ** decimals).toString()}
                  </div>
                </div>
                <div className="slider-container">
                  <Slider
                    min={0}
                    max={maxSupply}
                    onChange={(
                      event: Event,
                      value: number | number[],
                      activeThumb: number
                    ) => {
                      if (typeof value == "number") {
                        setSupply(value);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            <button
              className="submit font-text-tiny-bold flex-row-center-center"
              disabled={supply == 0}
              onClick={burn}
            >
              {supply == 0
                ? "Choose the amount to burn."
                : "Burn " + (supply / 10 ** decimals).toString() + " Tokens"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
