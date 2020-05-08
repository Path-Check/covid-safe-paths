import { assign, clone } from 'lodash';
import React, { useContext, useEffect, useState } from 'react';

import { buildTimeFlags } from '../constants/flagsEnv';
import { FEATURE_FLAG_VALS } from '../constants/storage';
import { GetStoreData, SetStoreData } from './General';

export const FlagsContext = React.createContext([buildTimeFlags, () => {}]);

/**
 * Overwrites properties of `oldFlags` with properties from `newFlags`,
 * omitting any properties from `newFlags` that don't exist on `oldFlags`
 *
 * Examples:
 *
 * `mergeFlags({feature1: false}, {feature1: true})` becomes `{feature1: true}`
 *
 * `mergeFlags({feature1: false}, {feature1: true, feature2: true})` becomes `{feature1: true}`
 */
export const mergeFlags = (oldFlags, newFlags) => {
  return assign(oldFlags, newFlags, (objectValue, sourceValue) => {
    if (objectValue) {
      return sourceValue;
    }
  });
};

export const FlagsProvider = ({ children }) => {
  const [flags, setFlags] = useState(buildTimeFlags);

  const getInitalFlagVals = async () => {
    const storedFlags = await GetStoreData(FEATURE_FLAG_VALS, false);

    if (storedFlags) {
      // Overwrite existing properties of `buildTimeFlags` with stored values from async storage,
      // omitting any stored value that is not present on `buildTimeFlags`.
      const initialFlags = mergeFlags(buildTimeFlags, storedFlags);
      setFlags(initialFlags);
      await SetStoreData(FEATURE_FLAG_VALS, initialFlags);
    }
  };

  useEffect(() => {
    getInitalFlagVals();
  }, []);

  return (
    <FlagsContext.Provider value={[flags, setFlags]}>
      {children}
    </FlagsContext.Provider>
  );
};

// Allows for `<FeatureFlag />` to exclude a flag from
// the toggleable list in `<FeatureFlagsScreen />`
export const runtimeFlags = clone(buildTimeFlags);

/**
 * Custom hook that can be used to fetch the list of all flags,
 * and to set the value for a particular flag.
 */
export function useFlags() {
  const [flags, setFlags] = useContext(FlagsContext);

  const setFlag = async (flagName, flagVal) => {
    const newFlags = { ...flags, [flagName]: flagVal };
    setFlags(newFlags);
    await SetStoreData(FEATURE_FLAG_VALS, newFlags);
  };

  return [flags, setFlag];
}
