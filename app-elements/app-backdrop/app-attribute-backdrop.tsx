import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { themes } from "@/app-elements/app-constants/app-constants";

export default function AttributeBackdrop({
  renderHook,
  attributes,
  attributeKey,
  attributeValue,
  setAttributes,
  setRenderHook,
  setAttributeKey,
  setAttributeValue,
  setAttributeModal,
  theme,
}: {
  setAttributeModal: (i: boolean) => void;
  renderHook: number;
  setRenderHook: (i: number) => void;
  attributeKey: string | undefined;
  attributeValue: string | undefined;
  setAttributeKey: (i: string) => void;
  setAttributeValue: (i: string) => void;
  attributes: { trait_type: string; value: string }[];
  setAttributes: (i: { trait_type: string; value: string }[]) => void;
  theme: number;
}) {
  const removeAttribute = (index: number) => {
    const oldArray = attributes;
    if (oldArray) {
      oldArray.splice(index, 1);
      setAttributes(oldArray);
      console.log(oldArray);
    }
  };
  return (
    <div
      className="backdrop flex-column-center-center"
      onClick={() => {
        setAttributeModal(false);
      }}
      data-theme={themes[theme]}
    >
      <div
        className="attributes"
        onClick={(e) => {
          e.stopPropagation();
        }}
        key={renderHook}
      >
        {attributes?.map((attribute, index) => {
          return (
            <div
              className="attribute"
              key={"nft-attribute-" + index}
              onClick={(e) => {
                e.stopPropagation();
                console.log("clicked.");
                removeAttribute(index);
                setRenderHook(renderHook + 1);
              }}
            >
              <div className="key font-text-bold">{attribute.trait_type}</div>

              <div className="line"></div>
              <div className="value font-text-light">{attribute.value}</div>
            </div>
          );
        })}
      </div>
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
                  setAttributeKey(e.target.value);
                }}
              />
              <input
                type="text"
                className="value font-text"
                placeholder="value"
                required
                onChange={(e) => {
                  setAttributeValue(e.target.value);
                }}
              />
            </div>
            <button
              className="submit font-text"
              type="submit"
              disabled={!attributeKey || !attributeValue}
              onClick={() => {
                setAttributes([
                  ...(attributes || []),
                  {
                    trait_type: attributeKey || "",
                    value: attributeValue || "",
                  },
                ]);
              }}
            >
              {!attributeKey || !attributeValue ? "fill in the fields" : "add"}
            </button>
          </form>
        </div>
      </div>
      {/* Button with x symbol */}
      <button onClick={() => setAttributeModal(false)} className="close-button">
        <FontAwesomeIcon icon={faX} />
      </button>
    </div>
  );
}
