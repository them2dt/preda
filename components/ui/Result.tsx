import { BackendResponse } from "@/types";
import {
  faCheckCircle,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip } from "@mui/material";
import Link from "next/link";
import React from "react";
import { themes } from "../utils/simples";

export default function ResultPanel({
  result,
  setResult,
  theme,
}: {
  result: BackendResponse;
  setResult: (param: BackendResponse) => void;
  theme: number;
}) {
  return (
    <>
      {result.status != 0 && (
        <div
          id="result-backdrop"
          className="backdrop flex-row-center-center"
          data-theme={themes[theme]}
        >
          {result.status == 200 ? (
            <div id="result-panel" className="panel flex-column-center-center">
              <div className="headline flex-column-center-center">
                <FontAwesomeIcon icon={faCheckCircle} color="#0ba34b" />
                <div className="message font-h4">Success!</div>
              </div>
              <div className="column buttons flex-column-center-center">
                {result.signature && (
                  <div className="button-base">
                    <Link
                      href={"https://solana.fm/tx/" + result.signature}
                      target="_blank"
                    >
                      <button className="button font-text-tiny-bold flex-row-center-center">
                        Open Transaction
                      </button>
                    </Link>
                  </div>
                )}
                {result.assetID && (
                  <div className="button-base">
                    <Link
                      href={"https://solana.fm/address/" + result.assetID}
                      target="_blank"
                    >
                      <button className="button font-text-tiny-bold flex-row-center-center">
                        Open Asset
                      </button>
                    </Link>
                  </div>
                )}
                {result.assetID && (
                  <div className="button-base">
                    <Tooltip title={"Copy " + result.assetID}>
                      <button
                        className="button font-text-tiny-bold flex-row-center-center"
                        onClick={() => {
                          navigator.clipboard.writeText(result.assetID || "");
                        }}
                      >
                        Copy Address
                      </button>
                    </Tooltip>
                  </div>
                )}
                <div className="button-base close">
                  <button
                    className="button close font-text-tiny-bold flex-row-center-center"
                    onClick={() => {
                      setResult({ status: 0 });
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div id="result-backdrop" className="flex-row-center-center">
              <div id="result-panel" className="flex-column-center-center">
                <div className="headline flex-column-center-center">
                  <FontAwesomeIcon icon={faXmarkCircle} color="#d40f1c" />
                  <div className="message font-h4">Something went wrong.</div>
                </div>
                <div className="buttons flex-column-center-center">
                  <div className="button-base close">
                    <button
                      className="button close font-text-tiny-bold flex-row-center-center"
                      onClick={() => {
                        setResult({ status: 0 });
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
