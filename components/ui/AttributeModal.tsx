"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

/* 
BACKDROP GUIDE
0 = DEFAULT
1 = WALLET CONNECTOR
2 = NETWORK MANAGER
3 = DESIGN SWITCH
4 = create-single-panel: ATTRIBUTE ADDER
*/

/**
 * A component to show a Modal within a backdrop window.
 * @param {JSX.Element} modal - The ID of the Modal to appear
 */
export default function Backdrop({
  modal,
  resetModal,
  theme,
}: {
  modal: number;
  setModal: Function;
  resetModal: Function;
  theme: number;
}) {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");

  return (
    <>
      {modal != 0 && (
        //backdrop component. Blurs out the background to give a better contrast towards the modal.
        <div
          data-theme={theme == 0 ? "light" : "dark"}
          className="backdrop"
          id="backdrop"
          onClick={() => {
            resetModal();
          }}
          
        >
            
          {/*Modal component. Frames the modal content.*/}
          <div
            className="modal"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="create-attributes font-text">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="input">
                  <input
                    type="text"
                    className="key font-text"
                    placeholder="key"
                    required
                    onChange={(e) => {
                      setKey(e.target.value);
                    }}
                  />
                  <input
                    type="text"
                    className="value font-text"
                    placeholder="value"
                    required
                    onChange={(e) => {
                      setValue(e.target.value);
                    }}
                  />
                </div>
                <button
                  className="submit font-text-bold"
                  type="submit"
                  disabled={!key || !value}
                  onClick={() => {
                    resetModal();
                  }}
                >
                  {!key || !value ? "fill in the fields" : "add"}
                </button>
              </form>
            </div>
          </div>
          {/* Button with x symbol */}
          <button
            onClick={() => {
              resetModal();
            }}
            className="close-button"
          >
            <FontAwesomeIcon icon={faX} />
          </button>
        </div>
      )}
    </>
  );
}
