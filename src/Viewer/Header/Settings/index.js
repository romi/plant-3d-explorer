import { useState, useEffect, Children } from "react";
import React from "react";
import cogIcon from "common/assets/ico.settings.21x21.svg";
import PropTypes from "prop-types";
import { useLocalStorage } from "react-use";
import { H2, H3 } from "common/styles/UI/Text/titles";
import { omit } from "lodash";
import { typeReducer } from "./FieldTypes";

function Navigation(props) {
  const [childrenCount] = useState(Children.count(props.children));

  const obj = (
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

  return obj;
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

const SettingsCategory = (props) => {
  const fields = props.fields;

  return (
    <div style={{padding:"10px"}}>
      <H3>{props.title}</H3>
      {fields.map((element, i) => {
        if (React.isValidElement(element.type)) {
          const Elem = element.type;
          return <Elem key={i} />;
        } else {
          const Elem = typeReducer(element.type);
          if (Elem === null)
            return null;
          return <Elem key  ={i} />;
        }
      })}
    </div>
  );
};

const SettingsLayer = (props) => {
  return (
    <div
      style={{
        padding: "10px",
        display: props.isEnabled ? "grid" : "none",
      }}
    >
      <H2>{props.name}</H2>
      {
        props.fields.map((element, i) => {
          if ("type" in element) {
            if (React.isValidElement(element.type)) {
              const Elem = element.type;
              return <Elem key={i} />;
            } else {
              const Elem = typeReducer(element.type);
              return <Elem key={i} />;
            }
          } else if ('fields' in element)
          {
            return <SettingsCategory title={element.name} fields={element.fields} />
          }
          return null;
        })
      }
    </div>
  );
};

function Panel(props) {
  const [activated, setActivated] = useState("");

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
          />
        );
      })}
    </Background>
  );

  return panel;
}

function Settings(props) {
  const id = props.menu.id;
  const menuItems = props.menu.settings;
  // This hook is set when the user validate changes. If true, settings are saved in localStorage
  const [validate, setValidate] = useState(false);
  // This hook defines the current changes made by the user.
  const [currentChanges, setCurrentChanges] = useState({});
  // This hook defines the current condition of the Setting panel (open or closed)
  const [openSettings, setOpenSettings] = useState(false);
  const [localStorage, setLocalStorage] = useLocalStorage(id);

  useEffect(() => {
    if (validate) setLocalStorage(Object.assign(localStorage, currentChanges));
    setValidate(false);
  }, [validate]);
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
          fetch={(val) => setCurrentChanges({ ...currentChanges, ...val })}
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
