/**
 * This file allows for creating a quick menu for p3dexp.
 * You shouldn't have to edit this (and subsequent components) to use it.
 * To add a menu item, see the index.js file above in the hierarchy.
 * To add a field type, see ./FieldTypes. Don't forget to edit the index.js for the typeReducer function.
 */

import { omit, isEmpty, isEqual, rest } from "lodash";
import React, { useState, useEffect, useContext, Children } from "react";
import cogIcon from "common/assets/ico.settings.21x21.svg";
import PropTypes from "prop-types";
import { H2, H3 } from "common/styles/UI/Text/titles";
import { typeReducer } from "./FieldTypes";
import { useLocalStorage } from "react-use";
import {SettingsContext} from "./settingsContext";
import { EqualDepth } from "three";


const Navigation = (props) => {
  const [childrenCount] = useState(Children.count(props.children));

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(max(0, ${childrenCount -
          1}), minmax(150px,1fr)) 25px`,
        gridTemplateRows: "25px",
      }}
      {...omit(props, ["children"])}
    >
      {props.children}
    </div>
  );
};

const Actions = (props) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `auto 150px 150px 150px auto`,
        gridTemplateRows: "25px",
        gridGap: "5px",
      }}
    >
      <input
        type="button"
        style={{
          gridColumn: "2 / 3",
        }}
        value="Restore defaults"
        onClick={() => props.restore(true)}
      />
      <input
        type="button"
        style={{
          gridColumn: "3 / 4",
        }}
        value="Reset"
        onClick={() => props.reset(true)}
      />
      <input
        type="button"
        style={{
          gridColumn: "4 / 5",
        }}
        value="Confirm"
        onClick={() => props.confirm(true)}
      />
    </div>
  );
};

// According to ctrl + f, the highest z-index except this one is 2000. As This must be over everything, I'm setting it to this absurde value.
// Please don't goimport { useSettings } from "flow/user-settings/settings";
const Background = (props) => {
  return (
    <div
      style={{
        position: "fixed",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        margin: 0,

        top: 0,
        left: 0,
        right: 0,
        bottom: 0,

        background: "rgba(32,62,66,0.7)", // Gray Anthracite
        zIndex: 10000,
      }}
    >
      <div
        style={{
          position: "relative",
          backgroundColor: "white",
          width: "min(80vw, 100% - 10px)",
          height: "min(95vh, 100% - 10px)",
        }}
      >
        {props.children}
      </div>
    </div>
  );
};

const NavigationItem = (props) => {
  const action = props.action;
  const name = props.name;
  return <input type="button" value={name} onClick={action} />;
};

const SettingsItem = (props) => {
  return (
    <div
      style={{
        position: "relative",
        display: "block",
        padding: "0 25px",
        height: "max-content",
        alignItems: "center",
      }}
    >
      <div
        style={{
          positon: "absolute",
          top: "50%",
          display: "inline-block",
          width: "75px",
          textOverflow: "ellipsis",
        }}
      >
        {props.label}
      </div>
      <div style={{ positon: "absolute", top: "50%", display: "inline-block" }}>
        {props.children}
      </div>
    </div>
  );
};

const SettingsCategory = (props) => {
  const fields = props.fields;
  const [settings, setSettings] = useState();

  return (
    <div style={{ padding: "25px" }}>
      <H3>{props.title}</H3>
      {fields.map((el, i) => {
        const changeSettings = (val) => {
          setSettings({
            ...settings,
            [el.id]: val,
          });
          props.onChangeValue({
            ...settings,
            [el.id]: val,
          });
        };

        if (el.type) {
          const Element = el.type;
          return (
            <SettingsItem key={i} label={el.name}>
              <Element
                onConfirm={(val) =>
                  props.confirm.setSettings({
                    ...props.lastSettings,
                    [el.id]: val,
                  })
                }
                lastSettings={props.lastSettings[el.id]}
                default={el.default}
                reset={props.reset.setSettingsShouldReset}
                restore={props.restore.settingsShouldRestore}
                confirm={props.confirm.setSettingsShouldConfirm}
              />
            </SettingsItem>
          );
        }
        return null;
      })}
    </div>
  );
};

const SettingsLayer = (props) => {
  return (
    <div
      style={{
        padding: "10px",
        height: "calc(100% - 50px)", // calc the total height of the container - the height of the nav - height of footer
        display: props.isEnabled ? "block" : "none",
      }}
    >
      <H2>{props.name}</H2>
      {props.fields.map((el, i) => {
        // After typeReducer it's either a React Component or null
        if ("type" in el && el.type) {
          const Element = el.type;
          return (
            <SettingsItem key={i} label={el.name}>
              <Element
                onConfirm={(val) =>
                  props.confirm.setSettings({
                    ...props.lastSettings,
                    [el.id]: val,
                  })
                }
                lastSettings={props.lastSettings[el.id]}
                default={el.default}
                reset={props.reset.setSettingsShouldReset}
                restore={props.restore.settingsShouldRestore}
                confirm={props.confirm.setSettingsShouldConfirm}
              />
            </SettingsItem>
          );
        } else if ("fields" in el) {
          return (
            <SettingsCategory
              key={i}
              id={el.id}
              title={el.name}
              fields={el.fields}
              lastSettings={props.lastSettings[el.id]}
              reset={props.reset}
              restore={props.restore}
              confirm={props.confirm}
              onConfirm={(val) =>
              props.confirm.setSettings({
                ...props.lastSettings,
                [el.id]: val,
              })
            }            />
          );
        }
        return null;
      })}
    </div>
  );
};

function Panel(props) {
  const [activated, setActivated] = useState();
  
  const panel = (
    <Background>
      <Navigation>
        {props.items.map((el, i) => {
          return (
            <NavigationItem
              key={i}
              id={el.id}
              name={el.name}
              action={() => setActivated(el.id)}
            />
          );
        })}
        <input
          type="button"
          style={{
            backgroundColor: "black",
          }}
          onClick={props.close}
        />
      </Navigation>
      {props.items.map((el, i) => {
        return (
          <SettingsLayer
            key={i}
            id={el.id}
            name={el.name}
            isEnabled={activated === el.id}
            fields={el.fields}
            lastSettings={props.lastSettings[el.id]}
            reset={props.reset}
            restore={props.restore}
            confirm={props.confirm}
            onConfirm={(val) =>
              props.confirm.setSettings({
                ...props.lastSettings,
                [el.id]: val,
              })
            }
          />
        );
      })}
      {activated && (
        <Actions
          reset={props.reset.setSettingsShouldReset}
          restore={props.restore.setSettingsShouldRestore}
          confirm={props.confirm.setSettingsShouldConfirm}
        />
      )}
    </Background>
  );

  return panel;
}

function Settings(props) {
  // Constant variables 
  const id = props.menu.id;
  const menuItems = props.menu.settings;

  // Context and states
  const context = useContext(SettingsContext);
  // Here we manage 2 parallel state. This is super error prone, but I don't think there is a better solution.
  // Each time settings are confirmed, the Context.Provider is updated with the localStorage
  
  // This line should always be the default values because first context is always default
  const [defaultSettings] = useState(context.settingsValue);
  const [localStorage, setLocalStorage] = useLocalStorage(id, defaultSettings)
  const [settings, setSettings] = useState(context.settingsValue);
  const [openSettings, setOpenSettings] = useState(false);
  const [settingsShouldReset, setSettingsShouldReset] = useState(false);
  const [settingsShouldRestore, setSettingsShouldRestore] = useState(false);
  const [settingsShouldConfirm, setSettingsShouldConfirm] = useState(false);
  
  // Functions for ease of access (and readability)

  const resetObject = { settingsShouldReset, setSettingsShouldReset }
  const confirmObject = { settingsShouldConfirm, setSettingsShouldConfirm, setSettings}
  const restoreObject = { settingsShouldRestore, setSettingsShouldRestore }

  // Prepare effect
  useEffect(() => {
    const fn = (items) => items.forEach((val, id) => {
      if('type' in val)
        val.type = typeReducer(val.type)
      else if ('fields' in val)
        fn(val.fields);
    });
    fn(menuItems)
    console.log(resetObject)

    // Base settings are : the defaults overriden by what's in localStorage already
    setSettings(Object.assign({}, defaultSettings, localStorage === undefined ? {} : localStorage))
  }, []); // Empty brackets means "runs only once". Should be executed first



  return (
    <div>
      <input
        type="image"
        src={cogIcon}
        alt=""
        onClick={() => setOpenSettings(true)}
      ></input>
      {openSettings && (
        <Panel
          close={() => setOpenSettings(false)}
          items={menuItems}
          reset={resetObject}
          restore={restoreObject}
          confirm={confirmObject}
          lastSettings={settings}
        />
      )}
    </div>
  );
}

export { Settings };
