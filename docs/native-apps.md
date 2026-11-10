# Native iOS and Android apps

The PWA and native apps use the same React source in `src/`. Capacitor packages
the production web build in `dist/` into the native projects; native code should
be limited to platform integrations and project configuration.

## Requirements

- Node.js supported by Capacitor 8 and npm.
- Android Studio with its Android SDK and a compatible JDK to build Android.
- macOS with Xcode to build and sign iOS.

Capacitor 8 targets current platform toolchains. Check the Capacitor platform
requirements before upgrading Xcode, Android Gradle Plugin, or the SDK.
The generated Android project currently uses minimum SDK 24 and compile/target
SDK 36; the iOS deployment target is 15.0.

## Build and sync

After changing shared React code, run:

```sh
npm run build:native
```

This builds the shared source using relative asset paths and runs `cap sync` for
both native projects. To sync only one platform, use `npm run sync:android` or
`npm run sync:ios`. Open the generated projects with `npm run open:android` or
`npm run open:ios`, then build, sign, and distribute them using the respective
platform tooling.

The shared artwork in `assets/logo.png` is used to generate native app icons
and splash screens. Regenerate those assets after changing the artwork with
`npm run assets:native`.

The PWA continues to use `npm run build` and its deployment workflow. A native
store release is a separate signed binary, so changes do not appear in already
installed store apps until the updated iOS/Android builds are released and users
install those updates. This is required by the app stores; there is no silent
web-code update mechanism for the native binaries.

## Release checklist

1. Update `version` in `package.json` (and let npm update the lockfile).
2. Add the user-facing summary for that version to `APP_RELEASES` in
   `src/App.jsx`.
3. Build and sync with `npm run build:native`. This maps the package version to
   the Android version name and both stores' build numbers.
4. Build and test both native projects, sign, and upload the release binaries.
5. Deploy the PWA from the same commit.

Set `VITE_IOS_APP_STORE_URL` and `VITE_ANDROID_PLAY_STORE_URL` to the published
store listing URLs before building store binaries. Until then, the update action
uses store search links. Replace `com.voltguardpro.batterytimer` in
`capacitor.config.json` with the publisher-owned application ID before the first
store submission; changing it after publication creates a different app. Set
the iOS team/signing and Android release signing configuration in their native
IDE projects before distribution.

## Contact, payment, and external links

Client-visible URLs and contact details are centralized in `src/config/links.js`.
Copy `.env.example` to `.env.local` and set the `VITE_*` values for a deployment;
Vite embeds these values at build time, so rebuild and sync native apps after
changing them. Do not put secret keys or private credentials in these variables.
PayPal is hidden until `VITE_PAYPAL_PAYMENT_URL` is configured. Replace example
contact details, payment destinations, and wallet addresses with publisher-owned
values before release.

## Platform limitations

The native project folders can be generated and synced on Windows, but Android
builds require Android Studio/SDK and Java. iOS builds, signing, simulators, and
device testing require macOS and Xcode. These tools were not available in the
Windows environment used to create the project scaffolds.
