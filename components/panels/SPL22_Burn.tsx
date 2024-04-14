"use client";
import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { CustomSlider } from "../Slider";
import { enqueueSnackbar } from "notistack";
import { burnSPL22, fetchToken22 } from "@/backend/SPL22";
import { backendWrapper } from "../BackendWrapper";
import { BackendResponse } from "@/types";
import ResultPanel from "../ResultPanel";

export default function Panel() {
  const [decimals, setDecimals] = useState<number>(0);
  const [supply, setSupply] = useState<number>(0);
  const [maxSupply, setMaxSupply] = useState<number>(0);
  const [token, setToken] = useState<string>();
  const [tokenVerified, setTokenVerified] = useState<boolean>(false);
  const [result, setResult] = useState<BackendResponse>();

  const { wallet } = useWallet();
  const { connection } = useConnection();

  const validate = async () => {
    const runner = fetchToken22({
      wallet: wallet,
      connection: connection,
      assetId: token,
    });

    const response = await backendWrapper({
      wallet,
      connection,
      backendCall: async () => await runner,
    });

    if (response.status == 200) {
      if (response.tokenBalance.balance > 1) {
        setDecimals(response.tokenBalance.decimals);
        setMaxSupply(response.tokenBalance.balance);
        setTokenVerified(true);
      } else {
        enqueueSnackbar("Token balance is 0.", { variant: "warning" });
        setTokenVerified(false);
      }
    } else {
      enqueueSnackbar("Token not found.", { variant: "error" });
      setTokenVerified(false);
    }
  };
  const burn = async () => {
    const runner = burnSPL22({
      wallet: wallet,
      connection: connection,
      assetId: token,
      amount: supply,
    });
    const response = await backendWrapper({
      initialMessage: "Burning SPL22",
      wallet: wallet,
      connection: connection,
      backendCall: async () => await runner,
    });
    setResult(response);
  };

  return (
    <>
      <div className="panel-container flex-column-start-center">
        <div className="font-h3">Burn SPL22-Tokens</div>

        <div className="panel flex-row-start-center">
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
              onClick={validate}
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
                  <CustomSlider
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
      {result && <ResultPanel result={result} setResult={setResult} />}
    </>
  );
}
