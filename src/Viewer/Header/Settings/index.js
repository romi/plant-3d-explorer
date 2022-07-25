/**
 * This file allows for creating a quick menu for p3dexp.
 * You shouldn't have to edit this (and subsequent components) to use it.
 * To add a menu item, see the index.js file above in the hierarchy.
 * To add a field type, see ./FieldTypes. Don't forget to edit the index.js for the typeReducer function.
 */

import { isEqual, omit, set } from "lodash";
import React, { useState, useEffect, Children } from "react";
import cogIcon from "common/assets/ico.settings.21x21.svg";
import { H2, H3 } from "common/styles/UI/Text/titles";
import { typeReducer } from "./FieldTypes";
import { useLocalStorage } from "react-use";
import { useUserPrefs } from "flow/settings/accessors";

const Navigation = (props) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "25px",
        gridTemplateRows: ` 25px repeat(max(0, ${Children.count(props.children) -
          1}), minmax(100px,1fr))`,
        width: "25px"
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
        gridTemplateColumns: `auto 100px 100px 100px auto`,
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
        padding: 0,
        margin: 0,

        top: 0,
        left: 0,
        right: 0,
        bottom: 0,

        zIndex: 10000,
        backfaceVisibility:false,
        backgroundColor:'rgba(192,192,192,0.2)',
        pointerEvents:"none"
      }}
    >
      <div
        style={{
          position: "relative",
          backgroundColor: "white",
          top:"100px",
          bottom:"100px",
          right: "10px",
          left:"66%",
          pointerEvents:"auto"
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
  return <input style={{overflow:"hidden", textOverflow:"ellipsis", textOrientation: "upright",
  textCombineUpright: "all",}} type="button" value={name} onClick={action} />;
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

  return (
    <div style={{ padding: "25px" }}>
      <H3>{props.title}</H3>
      {fields.map((el, i) => {

        if (el.type) {
          const Element = el.type;
          return (
            <SettingsItem key={i} label={el.name}>
              <Element
                lastSettings={props.lastSettings[el.id]}
                default={el.default}
                reset={props.reset.settingsShouldReset}
                restore={props.restore.settingsShouldRestore}
                confirm={props.confirm}
                onChangeSettings={props.onChangeSettings}
                path={[...props.path, el.id]}
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
        height: "content", // calc the total height of the container - the height of the nav - height of footer,
        width: "calc(100% - 25px)",
        display: props.isEnabled ? "block" : "none",
        margin: 0,
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
                default={el.default}
                lastSettings={props.lastSettings[el.id]}
                reset={props.reset.settingsShouldReset}
                restore={props.restore.settingsShouldRestore}
                confirm={props.confirm}
                onChangeSettings={props.onChangeSettings}
                path={[...props.path, el.id]}
                {...el.props}
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
              onChangeSettings={props.onChangeSettings}
              path={[...props.path, el.id]}
            />
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
      <div style={{display:"inline-block", width:"25px"}}>
        <Navigation>
            <input
            type="button"
            style={{
              backgroundColor: "black",
            }}
            onClick={props.close}
          />
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
        </Navigation>
      </div>
      <div style={{display:"inline-block"}}>
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
              onChangeSettings={props.onChangeSettings}
              path={[...props.path, el.id]}
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
      </div>
    </Background>
  );

  return panel;
}

function Settings(props) {
  // Constant variables 
  const id = props.menu.id;
  const menuItems = props.menu.settings;

  // Context and states
  // Here we manage 2 parallel state. This is super error prone, but I don't think there is a better solution.
  // Each time settings are confirmed, the Context.Provider is updated with the localStorage
  
  // This line should always be the default values because first context is always default
  const [localStorage, setLocalStorage] = useLocalStorage(id)
  const [openSettings, setOpenSettings] = useState(false);
  const [settingsShouldReset, setSettingsShouldReset] = useState(false);
  const [settingsShouldRestore, setSettingsShouldRestore] = useState(false);
  const [settingsShouldConfirm, setSettingsShouldConfirm] = useState(false);
  const [acc, setAcc] = useState([])

  const [settings, setSettings] = useUserPrefs()
  // Functions for ease of access (and readability)
  const onChangeSettings = (settingUpdate) => {
    setAcc(last => {
      let index = -1;
      const exist = last.some((element, i) => {
        if(isEqual(element.path, settingUpdate.path))
        {
          index = i;
          return true
        }
        return false;
      })

      if(exist)
      {
        last.splice(index, 1)
        return [...last, settingUpdate]
      }
      
      return [...last, settingUpdate]
    })
  }

  const resetObject = { settingsShouldReset, setSettingsShouldReset }
  const confirmObject = { settingsShouldConfirm, setSettingsShouldConfirm }
  const restoreObject = { settingsShouldRestore, setSettingsShouldRestore }

  // Prepare effect
  useEffect(() => {
    const fn = (items) => items.forEach((val, id) => {
      if('type' in val)
        val.type = typeReducer(val.type)
      else if ('fields' in val)
        fn(val.fields);
    });
    fn(menuItems);

    if(localStorage)
      setSettings(Object.assign({}, settings, localStorage));

  }, []); // Empty brackets means "runs only once". Should be executed first

  useEffect(() => {
    if(settingsShouldConfirm)
    {
      let object = {}
      acc.forEach((val) => {
          set(object, val.path, val.value)
      })
      setSettings(object);
      return () => {
        setSettingsShouldConfirm(false);
      }
    }
  }, [acc])

  useEffect(() => {
    return () => {
      if (settingsShouldReset)
        setSettingsShouldReset(false)
    }
  })

  useEffect(() => {
    return () => {
      if (settingsShouldRestore)
        setSettingsShouldRestore(false)
    }
  })

  useEffect(() => {
    setLocalStorage(settings)
  }, [settings])

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
          onChangeSettings={onChangeSettings}
          path={[]}
        />
      )}
    </div>
  );
}

export default Settings;
