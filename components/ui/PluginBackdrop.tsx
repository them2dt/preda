"use state";
import React, { useState } from "react";
import { themes } from "../utils/simples";
import { NumberField, TextField } from "./InputFields";
import { Signal, Slider, Switch } from "./TeaUI";
import { enqueueSnackbar } from "notistack";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff, faX } from "@fortawesome/free-solid-svg-icons";
import {
  Creator,
  Plugin,
  PluginAuthorityPairArgs,
  createPlugin,
  ruleSet,
} from "@metaplex-foundation/mpl-core";
import { OptionOrNullable, publicKey } from "@metaplex-foundation/umi";
//TODO: Add delegates plugin-form

export default function PluginBackdrop({
  theme,
  setModal,
}: {
  theme: number;
  setModal: (i: boolean) => void;
}) {
  const pluginTypes = ["Royalties", "Attributes", "Transferrable", "Delegates"];
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

  //Transferrables
  const [frozen, setFrozen] = useState<boolean>(false);
  const [soulbond, setSoulbond] = useState<boolean>(false);

  //General plugin hooks
  const [activePlugins, setActivePlugins] = useState<{ active: boolean }[]>([
    { active: false },
    { active: false },
    { active: false },
    { active: false },
  ]);

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

  const changeActivePlugins = (x: number) => {
    const old = activePlugins;
    const result: { active: boolean }[] = [];

    for (let i = 0; i < old.length; i++) {
      if (i == x) {
        result.push({ active: !old[i].active });
      } else {
        result.push(old[i]);
      }
    }
    setActivePlugins(result);
  };

  //Royalty validators
  const validateCreator = () => {
    if (address && share) {
      var totalShare = 0;
      for (let i = 0; i < creators.length; i++) {
        totalShare += creators[i].percentage;
        if (address == creators[i].address) {
          return true;
        }
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

        for (let j = 0; j < creators.length; j++) {
          if (i != j && creators[i].address == creators[j].address) {
            return true;
          }
        }
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

  const validateAttribute = () => {
    if (attributeKey && attributeValue) {
      for (let i = 0; i < attributes.length; i++) {
        if (attributes[i].trait_type == attributeKey) {
          return true;
        }
      }
      return false;
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
          <div className="plugin-operator flex-column-center-center">
            <div className="plugin-options flex-column-center-center">
              {pluginTypes.map((item, index) => (
                <div
                  className="plugin-option flex-row-center-center"
                  key={"plugin-option-" + index}
                >
                  <button
                    className="plugin-activator flex-row-center-center"
                    onClick={() => {
                      changeActivePlugins(index);
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faPowerOff}
                      color={
                        activePlugins[index].active
                          ? "#1ee67e"
                          : "var(--secondary-faded-4)"
                      }
                    />
                  </button>
                  <button
                    disabled={!activePlugins[index].active}
                    className={
                      pluginForm == index
                        ? "option active font-text-bold flex-row-start-center"
                        : "option font-text-bold flex-row-start-center"
                    }
                    onClick={() => setPluginForm(index)}
                  >
                    {item}
                  </button>
                </div>
              ))}
            </div>

            <div className="plugin-submitters flex-column-center-center">
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
            </div>
          </div>
          {pluginForm == 0 && (
            <div
              className="plugin-form flex-column-start-start"
              key={"Plugin-Form " + renderHook}
            >
              <div className="elements flex-column-start-start">
                {creators.map((item, index) => (
                  <button
                    className="element flex-column-start-start"
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
              <div className="inputs flex-row-center-end">
                <TextField label="Addresss" setValue={setAdress} />
                <NumberField
                  label="Share (%)"
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
                      setAdress(undefined);
                      setShare(0);
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
                  <Slider
                    min={0}
                    max={100}
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
            </div>
          )}
          {pluginForm == 1 && (
            <div
              className="plugin-form flex-column-start-start"
              key={"Plugin-Form " + renderHook}
            >
              <div className="elements flex-column-start-start">
                {attributes.map((item, index) => (
                  <button
                    className="element flex-start-center-center"
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
              <div className="inputs flex-row-center-end">
                <TextField label="Attribute name" setValue={setAttributeKey} />
                <TextField label="Value" setValue={setAttributeValue} />
                <button
                  disabled={validateAttribute()}
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
            </div>
          )}
          {pluginForm == 2 && (
            <div
              className="plugin-form flex-column-start-start"
              key={"Plugin-Form " + renderHook}
            >
              <div className="inputs flex-row-start-center">
                <div className="font-text-bold">
                  An asset can't be frozen and soulbond.
                </div>
              </div>
              <div className="inputs flex-row-start-center">
                <div className="font-text">Freeze</div>
                <Switch
                  hook={() => {
                    if (frozen) {
                      setFrozen(false);
                    } else {
                      setFrozen(true);
                      setSoulbond(false);
                    }
                  }}
                  state={frozen}
                />
              </div>
              <div className="inputs flex-row-start-center">
                <div className="font-text">Soulbond</div>
                <Switch
                  hook={() => {
                    if (soulbond) {
                      setSoulbond(false);
                    } else {
                      setFrozen(false);
                      setSoulbond(true);
                    }
                  }}
                  state={soulbond}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
