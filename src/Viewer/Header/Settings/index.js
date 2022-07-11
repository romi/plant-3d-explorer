import { useState, useEffect, Children } from "react";
import React from "react";
import cogIcon from "common/assets/ico.settings.21x21.svg";
import PropTypes from "prop-types";
import { useLocalStorage } from "react-use";
import { H2, H3 } from "common/styles/UI/Text/titles";
import { omit } from "lodash";
import { typeReducer } from "./FieldTypes";

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
      gridTemplateColumns: `auto 150px 150px auto`,
      gridTemplateRows: "25px",
      gridGap: '5px'
    }}>
    <button style={{
      gridColumn : '2 / 3'
    }}/>
    <button style={{
      gridColumn : '3 / 4'
    }}/>
      
    </div>
  );
}

// According to ctrl + f, the highest z-index except this one is 2000. As This must be over everything, I'm setting it to this absurde value.
// Please don't go above that.
// A smarter way must existe but I don't know it (appart going through the whole DOM to find the largest value)
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
        if (React.isValidElement(el.type)) {
          const Elem = el.type;
          return (
            <SettingsItem key={i} label={el.name}>
              <Elem onChangeValue={changeSettings} />
            </SettingsItem>
          );
        } else {
          const Elem = typeReducer(el.type);
          if (Elem === null) return null;
          return (
            <SettingsItem key={i} label={el.name}>
              <Elem onChangeValue={changeSettings} />
            </SettingsItem>
          );
        }
      })}
    </div>
  );
};

const SettingsLayer = (props) => {
  const [settings, setSettings] = useState({});

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
        if ("type" in el) {
          if (React.isValidElement(el.type)) {
            const Elem = el.type;
            return (
              <SettingsItem key={i} label={el.name}>
                <Elem onChangeValue={changeSettings} />
              </SettingsItem>
            );
          } else {
            const Elem = typeReducer(el.type);
            return (
              <SettingsItem key={i} label={el.name}>
                <Elem onChangeValue={changeSettings} />
              </SettingsItem>
            );
          }
        } else if ("fields" in el) {
          return (
            <SettingsCategory
              key={i}
              id={el.id}
              title={el.name}
              fields={el.fields}
              onChangeValue={changeSettings}
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
  const [settings, setSettings] = useState({});

  useEffect(() => {
    console.log(settings);
  }, [settings]);

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
            onChangeValue={(val) =>
              setSettings({
                ...settings,
                [el.id]: val,
              })
            }
          />
        );
      })}
      <Actions />
    </Background>
  );

  return panel;
}

function Settings(props) {
  const id = props.menu.id;
  const menuItems = props.menu.settings;

  // This hook defines the current changes made by the user.
  // This hook defines the current condition of the Setting panel (open or closed)
  const [openSettings, setOpenSettings] = useState(false);
  const [localStorage, setLocalStorage] = useLocalStorage(id);

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
          save={(val) => setLocalStorage(Object.assign(localStorage, val))}
          reset={() => localStorage}
        />
      )}
    </div>
  );
}

Settings.propsType = {
  menu: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    settings: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string, // settings id
        name: PropTypes.string, // Human readable
        type: PropTypes.oneOf([
          PropTypes.oneOfType([React.Component]),
          "number",
          "text",
          "color",
        ]),
      })
    ),
  }).isRequired,
};

export { Settings };
