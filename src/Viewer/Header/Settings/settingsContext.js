import { createContext } from "react";
import { isEmpty } from "lodash";

const fnPrepareMenu = (items) => {
    const val = items.reduce((acc, v) => {
      if ("fields" in v) {
        const r = fnPrepareMenu(v.fields);
        if (!isEmpty(r)) acc[v.id] = r;
      } else if ("type" in v && "default" in v) {
          acc[v.id] = v.default;
      } else {
        acc[v.id] = null
      }

      return acc;
    }, {});
    return val
 };

const SettingsContext = createContext("nv")

export { SettingsContext, fnPrepareMenu }