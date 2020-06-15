import { languages } from '../helpers/language';
import { navigateThroughOnboarding } from '../helpers/onboarding';

describe.each(languages)(
  `Permissions test suite in %s`,
  (locale, languageStrings) => {
    beforeAll(async () => {
      await device.launchApp({
        newInstance: true,
        languageAndLocale: {
          language: locale,
          locale,
        },
        permissions: { location: 'always', notifications: 'YES' },
      });
    });

    describe('Permissions: Location `always` and notifications `true` are chosen', () => {
      beforeAll(async () => {
        await navigateThroughOnboarding(languageStrings);
      });

      afterAll(async () => {
        await device.uninstallApp();
        await device.installApp();
      });
    });
  },
);
