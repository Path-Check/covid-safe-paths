<div align="center">
  <h1>COVID Safe Paths</h1>

  <a href="https://covidsafepaths.org">
    <img
      width="80"
      height="67"
      alt="safe paths logo"
      src="./assets/Safe_Paths_Logo.png"
    />
  </a>
  
  <b>**https://covidsafepaths.org**</b>
</div>

<hr />

# Project Overview

Help us stop COVID-19.

COVID Safe Paths is a mobile app for digital contract tracing (DCT) sponsored by Path Check a nonprofit and developed by a growing global community of engineers, designers, and contributors. Safe Paths is based on research originally conducted at the MIT Media Lab. 

## Privacy Preserving 

What’s truly special about Safe Paths is our strong commitment to preserving the privacy of individual users. We're building an application that can help contain outbreaks of COVID-19 without forcing users to sacrafice their personal privacy. For example, if a user chooses to use Safe Paths to maintain a record of their locations use a time stamped GPS log, which stores 14 days of data in 5 minute increments. The location log is stored on the users phone. The logged data only leave the device if the user chooses to send the information to an authorized public health authority (PHA) as part of the contact tracing prcoess.

## Multiple Capabilities

Safe Paths is designed to support a range of DCT and public health use cases. Currently the main build uses GPS for location tracking. Our roadmap includes adding support for other location and proximity technologis, symptom tracking, and communication with PHAs. 

### Project Aurora and the Google Apple Exposure Notification API (GAEN) 

Project Aurora is the code name for a build from Safe Paths for an app that is fully compliant with GAEN. This build will not include GPS, and it will be compliant with all the rules and requirements for GAEN apps. [Learn more about Project Aurora.](https://covidsafepaths.org/a-new-open-source-solution-for-the-google-apple-exposure-notification-api/) 

## Multiple Implementation Strategies 

Safe Paths is designed to support a variety of implementation strategies. 

### Path Check Release of COVID Safe Paths
Safe Paths is available as an app published by Path Check in the [Apple App Store](https://apps.apple.com/us/app/covid-safe-paths/id1508266966) and the [Google Play App Store](https://play.google.com/store/apps/details?id=org.pathcheck.covidsafepaths). Any authorized pubic health authority can use Safe Paths. 

### Custom Builds 

We welcome public health authorities and other organizations implementing digital contact tracing strategies to create custom builds for their specific needs, incorporate Safe Paths features into their applications, or create downstream projects that stay linked to the Safe Paths project. 

### GAEN Instances

The rules for GAEN require that each public health authority release their own application. The goal with Project Aurora is to suppor this deployment strategy. 

## End-to-End System

Safe Paths is designed to work with Safe Places, a tool for contact tracing teams to work with location data in the course of contact tracing interviews and to publish points of concern. Without having to sharing their own location history, a Safe Paths user can download the points of concern from their PHA to identify if they have had risk of an exposure. 

Project Aurora supports any GAEN compliant Key Server for exposure notification. 

## Broad Non-Developer Community 

One of the important aspects of the Safe Paths open source project is that it's supported by a large community of volutneers in addition to the open source developer community. More than 1,400 Path Check volunteers are working together to support Safe Paths and help drive adoption around the world. 

### Learn More

[COVID Safe Paths Website](https://covidsafepaths.org/)

Original White Paper: [Apps Gone Rogue: Maintaining Personal Privacy in an Epidemic](https://drive.google.com/file/d/1nwOR4drE3YdkCkyy_HBd6giQPPhLEkRc/view?usp=sharing)

[COVID Safe Paths Slack](covidsafepaths.slack.com) - This is where the community lives. 

### Downloads for COVID Safe Paths

[Google Play](https://play.google.com/store/apps/details?id=org.pathcheck.covidsafepaths) | [Apple Store](https://apps.apple.com/us/app/covid-safe-paths/id1508266966)

<br />

# Development Overview

![Android and iOS build on MacOS](https://github.com/Path-Check/covid-safe-paths/workflows/Android%20and%20iOS%20build%20on%20MacOS/badge.svg)

_Safe Paths_ is built on [React Native](https://reactnative.dev/docs/getting-started) v0.61.5

## Contributing

Read the [contribution guidelines](CONTRIBUTING.md).

## Architecture

View the [architecture diagram](docs/Private_Kit_Diagram.png) for a basic overview on the sequencing of generalized events and services that are used by Safe Paths.

## WhiteLabeling

PathCheck is building two versions of the application. One for location based
contact tracing and one for bluetooth based contact tracing. Given that the same
application cannot have both gps and bluetooth enabled for privacy
considerations, we need be able to build two separate version of the app for
distribution.

We are following a white labeling strategy to accomplish this. That is, we have
two build targets for each app which use the same codebase. For development, we
are preferring to keep as much code as possible common between the two targets.

## Developer Setup

First, run the appropriate setup script for your system. This will install relevant packages, walk through Android Studio configuration, etc.

**Note:** You will still need to [configure an Android Virtual Device (AVD)](https://developer.android.com/studio/run/managing-avds#createavd) after running the script.

#### Linux/MacOS

```
dev_setup.sh
```

#### Windows

```
dev_setup.bat
```

## Running

**Note:** In some cases, these procedures can lead to the error `Failed to load bundle - Could not connect to development server`. In these cases, kill all other react-native processes and try it again.

#### Android (Windows, Linux, macOS)

```
yarn run-android-gps ## for the location enabled app

yarn run-android-bte ## for the bluetooth enabled app
```

Device storage can be cleared by long-pressing on the app icon in the simulator, clicking "App info", then "Storage", and lastly, "Clear Storage".

#### iOS (macOS only)

First, install the pod files:

```
yarn install:pod ## only needs to be ran once
```

Then, run the application:

```
yarn run-ios-gps ## for the location enabled app

yarn run-ios-bte ## for the bluetooth enabled app
```

Device storage can be cleared by clicking "Hardware" on the system toolbar, and then "Erase all content and settings".

Privacy settings can be reset by going to Settings > General > Reset > Reset
Location & Privacy

### Release Builds

Generating a release build is an optional step in the development process.

- [Android instructions](https://reactnative.dev/docs/signed-apk-android)

### Debugging

[react-native-debugger](https://github.com/jhen0409/react-native-debugger) is recommended. This tool will provide visibility of the JSX hierarchy, breakpoint usage, monitoring of network calls, and other common debugging tasks.

## Testing

Tests are ran automatically through Github actions - PRs are not able to be merged if there are tests that are failing.

### Unit Test

To run the unit tests:

```
yarn test --watch
```

[Snapshot testing](https://jestjs.io/docs/en/snapshot-testing) is used as a quick way to verify that the UI has not changed. To update the snapshots:

```
yarn update-snapshots
```

### e2e Test

**Note:** Right now, there is only e2e test support for iOS.

e2e tests are written using [_detox_](https://github.com/wix/Detox). Screenshots of each test run are saved to `e2e/artifacts` for review.

To run the e2e tests:

```
yarn detox-setup ## only needs to be run once
yarn build:e2e:ios ## needs to be run after any code change
yarn test:e2e:iphone{11, -se, 8}
```

### Manual Device Testing

Mobile devices come in many different shapes and sizes - it is important to test your code on a variety of simulators to ensure it looks correct on all device types.

Before pushing up code, it is recommended to manually test your code on the following devices:

- Nexus 4 (smaller screen)
- iPhone 8 (smaller screen)
- Pixel 3 XL (larger screen)
- iPhone 11 (screen w/ notch)
