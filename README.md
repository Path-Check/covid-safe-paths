# COVID Safe Paths <img align="left" src="./assets/ShieldKeyHold512x512.png" data-canonical-src="./assets/ShieldKeyHold512x512.png" width="40" height="40"/> ![Android and iOS build on MacOS](https://github.com/tripleblindmarket/private-kit/workflows/Android%20and%20iOS%20build%20on%20MacOS/badge.svg)

**applying the technology and philosophy of Private Kit to COVID**

Help us stop COVID-19.

We’re building the next generation of secure location logging to preserve privacy and #flattenthecurve

Location logs provide time-stamped records of where users have been, allowing them to share information with health officials accurately and quickly. This helps support contact tracing efforts to slow the spread of the virus.

What’s truly special about Safe Paths, though, is its privacy protection. Data never leaves users’ devices without their password entry and explicit consent. The location log generated by Safe Paths cannot be accessed from outside the user’s device, meaning data transfer occurs only if the user chooses to share it with the researcher.

----

<img align="right" src="./assets/PreviewUI.png" data-canonical-src="./assets/PreviewUI.png"/>

Safe Paths is a ‘privacy-first’ app that allows you to log your GPS trails on your own phone. The information is stored locally and never shared with anyone (not even with us or MIT) until you explicitly decide to manually export the data. The location log generated by Safe Paths cannot be accessed from outside the user’s device. Location information can be imported and exported by the user and used in other projects and applications.

Safe Paths logs your device’s location once every five minutes and stores 28 days of data in under 100KB of space – less space than a single picture.  But what is truly exciting about Safe Paths is its privacy protection.

**Home page:** https://covidsafepaths.org and https://safepaths.mit.edu

**Private Kit WhitePaper:** [Apps Gone Rogue: Maintaining Personal Privacy in an Epidemic](https://drive.google.com/file/d/1nwOR4drE3YdkCkyy_HBd6giQPPhLEkRc/view?usp=sharing)

**Downloads for COVID Safe Paths:** _coming soon!_

**Downloads for Private Kit:** [Google Play](https://play.google.com/store/apps/details?id=edu.mit.privatekit) | [Apple Store](https://apps.apple.com/us/app/private-kit-prototype/id1501903733)

# Development Overview

This is a React Native app version 61.5

## Architecture

Please refer to `docs/Private Kit Diagram.png` for a basic overview on the sequencing of generalized events and services that are utilized by Safe Paths.

## Developer Setup

Refer to and run the dev_setup.sh (Linux/MacOS) or dev_setup.bat (Windows) for needed tools.

### iOS Configuration - First Time Setup

1. Move to `ios` directory and run `pod install`
2. If you have any trouble with packages not round, try `react-native link` from project directory.
3. Look at running commands below.

### Google Maps API Key
You will need to generate a Google API key in order for the mapping features to work correctly. Refer to this guide [guide](https://developers.google.com/maps/documentation/ios-sdk/get-api-key) in order to create the API key.

Once created you will need to add it to two different places in the project. One for Android and one for iOS.

* Android - open `android/app/src/main/AndroidManifest.xml`and search for `com.google.android.geo.API_KEY`. Add your key to the `android:value` property.
* iOS - open `ios/SafePaths/AppDelegate.m` and search for `GMSServices provideAPIKey` and replace line with `[GMSServices provideAPIKey:@"YOUR_API_KEY"];`

## Running

Install modules:
```yarn install``` (note ```yarn``` does a better job at installing dependencies on macOS, and it's mandatory to install `Yarn` on the local machine to run this project)

To run, do:
```
npx react-native run-android
```
or
```
npx react-native run-ios --simulator="iPhone 8 Plus"
```

NOTE: In some cases, the abovementioned procedure leads to the error 'Failed to load bundle - Could not connect to development server'. In these cases, kill all other react-native processes and try it again.

## Contributing

Read the [contribution guidelines](CONTRIBUTING.md).





