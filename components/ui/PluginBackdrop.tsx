"use state";
import React, { useState } from "react";
import { themes } from "../utils/simples";
import { NumberField, TextField } from "./InputFields";
import { CustomSlider } from "./Slider";
import { enqueueSnackbar } from "notistack";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import {
  Creator,
  Plugin,
  PluginAuthorityPairArgs,
  createPlugin,
  ruleSet,
} from "@metaplex-foundation/mpl-core";
import { OptionOrNullable, publicKey } from "@metaplex-foundation/umi";

export default function PluginBackdrop({
  theme,
  setModal,
}: {
  theme: number;
  setModal: (i: boolean) => void;
}) {
  const pluginTypes = ["Royalties", "Attributes", "Freeze", "Transfer"];
  const [renderHook, setRenderHook] = useState<number>(0);
  //Royalties
  const [royalty, setRoyalty] = useState<number>(0);
  const [address, setAdress] = useState<string>();
  const [share, setShare] = useState<number>(0);
  const [creators, setCreators] = useState<Creator[]>([]);

  //Attributes
  const [attributeKey, setAttributeKey] = useState<string>();
  const [attributeValue, setAttributeValue] = useState<string>();
  const [attributes, setAttributes] = useState<
    { trait_type: string; value: string }[]
  >([]);

  //General plugin hooks
  const [pluginForm, setPluginForm] = useState<number>(0);
  const [royaltyPlugin, setRoyaltyPlugin] = useState<Plugin>();
  const [plugins, setPlugins] = useState<
    OptionOrNullable<PluginAuthorityPairArgs[]>
  >([]);

  const removeCreator = (index: number) => {
    const oldArray = creators;
    if (oldArray) {
      oldArray.splice(index, 1);
      setCreators(oldArray);
      console.log(oldArray);
    }
  };
  const removeAttribute = (index: number) => {
    const oldArray = attributes;
    if (oldArray) {
      oldArray.splice(index, 1);
      setAttributes(oldArray);
      console.log(oldArray);
    }
  };

  const validateCreator = () => {
    if (address && share) {
      var totalShare = 0;
      for (let i = 0; i < creators.length; i++) {
        totalShare += creators[i].percentage;
      }
      totalShare += share;

      if (/[1-9A-HJ-NP-Za-km-z]{32,44}/.test(address) && totalShare <= 100) {
        return false;
      } else return true;
    } else {
      return true;
    }
  };
  const validateRoyaltyPlugin = () => {
    if (creators) {
      var totalShare = 0;
      for (let i = 0; i < creators.length; i++) {
        totalShare += creators[i].percentage;
      }
      if (totalShare == 100) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  };
  return (
    <div
      className="backdrop flex-column-center-center"
      onClick={() => {
        setModal(false);
      }}
      data-theme={themes[theme]}
    >
      <div
        className="plugin-container modal flex-column-start-start"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="font-h4">Plugin configurator</div>
        <div className="plugin-modal flex-row-start-start">
          <div className="plugin-options flex-column-center-center">
            {pluginTypes.map((item, index) => (
              <button
                key={"plugin-option-" + index}
                className={"option font-text-bold flex-row-start-center"}
                onClick={() => setPluginForm(index)}
              >
                {item}
              </button>
            ))}
          </div>
          {pluginForm == 0 && (
            <div
              className="plugin-form flex-column-start-center"
              key={"Plugin-Form " + renderHook}
            >
              <div className="attributes flex-row-start-start">
                {creators.map((item, index) => (
                  <button
                    className="attribute flex-start-center-center"
                    onClick={() => {
                      removeCreator(index);
                      setRenderHook(renderHook + 1);
                    }}
                  >
                    <div className="font-text-tiny">{item.address}</div>
                    <div className="font-text-tiny-bold">
                      {item.percentage.toString() + "%"}
                    </div>
                  </button>
                ))}
              </div>

              <div className="input row flex-row-center-end">
                <TextField label="Addresss" setValue={setAdress} />
                <NumberField
                  label="Share"
                  setValue={setShare}
                  min={0}
                  max={100}
                />
                <button
                  disabled={validateCreator()}
                  className="submit font-text"
                  onClick={() => {
                    if (address && share) {
                      creators.push({
                        address: publicKey(address),
                        percentage: share,
                      });
                      setRenderHook(renderHook + 1);
                    }
                  }}
                >
                  add
                </button>
              </div>
              <div
                className="royalties flex-column-center-center"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <div className="legend flex-row-between-center">
                  <div className="font-text-small">royalties</div>
                  <div className="font-text-small-bold">
                    {royalty.toString()}%
                  </div>
                </div>
                <div className="slider-container">
                  <CustomSlider
                    min={0}
                    max={20}
                    step={1}
                    value={royalty} // Fix: Change the type of sliderValue to number
                    onChange={(
                      event: Event,
                      value: number | number[],
                      activeThumb: number
                    ) => {
                      if (typeof value == "number") {
                        setRoyalty(value);
                      }
                    }}
                  />
                </div>
              </div>
              <div className="plugin-submitters flex-row-center-center">
                <button
                  disabled={validateRoyaltyPlugin()}
                  className="update font-text-bold"
                  onClick={() => {
                    if (creators) {
                      var totalShare = 0;
                      for (let i = 0; i < creators.length; i++) {
                        totalShare += creators[i].percentage;
                      }
                      if (totalShare == 100) {
                        setRoyaltyPlugin(
                          createPlugin({
                            type: "Royalties",
                            data: {
                              basisPoints: royalty,
                              creators: creators,
                              ruleSet: ruleSet("None"),
                            },
                          })
                        );
                      }
                    }
                  }}
                >
                  update
                </button>
                <button
                  className="clear font-text-bold"
                  onClick={() => {
                    if (address && share) {
                      setPlugins;
                    }
                  }}
                >
                  clear
                </button>
              </div>
            </div>
          )}
          {pluginForm == 1 && (
            <div
              className="plugin-form flex-column-start-center"
              key={"Plugin-Form " + renderHook}
            >
              <div className="attributes flex-row-start-start">
                {attributes.map((item, index) => (
                  <button
                    className="attribute flex-row-center-center"
                    onClick={() => {
                      removeAttribute(index);
                      setRenderHook(renderHook + 1);
                    }}
                  >
                    <div className="font-text-tiny">{item.trait_type}</div>
                    <div className="font-text-tiny-bold">{item.value}</div>
                  </button>
                ))}
              </div>
              <div className="input row flex-row-center-end">
                <TextField label="Name" setValue={setAttributeKey} />
                <TextField label="Value" setValue={setAttributeValue} />
                <button
                  disabled={!attributeKey || !attributeValue}
                  className="submit font-text"
                  onClick={() => {
                    if (attributeKey && attributeValue) {
                      attributes.push({
                        trait_type: attributeKey,
                        value: attributeValue,
                      });
                      setAttributeKey(undefined);
                      setAttributeValue(undefined);
                      setRenderHook(renderHook + 1);
                    }
                  }}
                >
                  add
                </button>
              </div>
              <div className="plugin-submitters flex-row-center-center">
                <button className="clear font-text-bold" onClick={() => {}}>
                  cancel
                </button>
                <button
                  disabled={validateRoyaltyPlugin()}
                  className="update font-text-bold"
                  onClick={() => {}}
                >
                  update
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
