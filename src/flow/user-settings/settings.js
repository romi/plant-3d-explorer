import { useLocalStorage } from "react-use";

export const useSettings = () => {
  const [value, setValue] = useLocalStorage("user-settings", {
    background: {
      colors: {},
    },
    mesh: {
      colors: {},
      opacity: 1,
    },
    pointCloud: {
      colors: {},
      resolution: "0.75",
      opacity: 1,
    },
    segmentedPointCloud: {
      colors: {},
      resolution: "0.75",
      opacity: 1,
    },
    boudingBox: {
      colors: {
        main: "#FFFFFF",
      },
    },
    skeleton: {
      colors: {},
      opacity: "0.75",
    },
    groundTruth: {
      colors: {},
      resolution: "0.75",
      opacity: 1,
    },
  });

  function fn(v, integrityCheck = false) {
    if (integrityCheck) {
    } // to ensure data are valid
    setValue(v);
  }

  return [value, fn];
};
