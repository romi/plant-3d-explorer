// From https://stackoverflow.com/questions/54095994/react-useeffect-comparing-objects

import { useEffect, useRef } from "react";
import { isEqual } from "lodash";
function deepCompareEquals(a, b) {
  // TODO: implement deep comparison here
  // something like lodash
  return isEqual(a, b);
}

function useDeepCompareMemoize(value) {
  const ref = useRef();
  // it can be done by using useMemo as well
  // but useRef is rather cleaner and easier

  if (!deepCompareEquals(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

// WARNING : This is a super costly useEffect. I got it to deepCompare on settings which are a 
// small object. I advise *not* using it on big objects for performance reasons.
// Otherwise it is used exactly the same way as useEffect
const useDeepCompareEffect = (callback, dependencies) => {
  useEffect(callback, dependencies.map(useDeepCompareMemoize));
}

export default useDeepCompareEffect;
