import { runtimeFlags, useFlags } from '../helpers/Flags';

/**
 *
 * Usage:
 *
 * ```
 * <FeatureFlag
 *  name="google_import"
 *  fallback={<Text>Old</Text>}
 *  isRuntimeFlag={false}
 * >
 *   <FeatureUi />
 * </FeatureFlag>
 * ```
 *
 * @param {{
 *   name: string;
 *   fallback?: import('react').ReactNode;
 *   children: import('react').ReactNode;
 *   isRuntimeFlag: boolean
 * }} param0
 */
export const FeatureFlag = ({
  name,
  children,
  fallback,
  isRuntimeFlag = true,
}) => {
  const [flags] = useFlags();
  const fallbackRender = fallback || null;

  if (!isRuntimeFlag && runtimeFlags[name]) {
    delete runtimeFlags[name];
  }

  return flags[name] ? children : fallbackRender;
};
