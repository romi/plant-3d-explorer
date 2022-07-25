import { isEmpty } from "lodash";

const prepareSettings = (items) => {
  const val = items.reduce((acc, v) => {
    if ("fields" in v) {
      const r = prepareSettings(v.fields);
      if (!isEmpty(r)) acc[v.id] = r;
    } else if ("type" in v && "default" in v) {
      acc[v.id] = v.default;
    } else {
      acc[v.id] = null;
    }

    return acc;
  }, {});
  return val;
};

export default prepareSettings;
