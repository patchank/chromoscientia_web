# App Links / Universal Links

These files let the OS open the **Chromoscientia mobile app** when the user opens a join URL (e.g. from the QR code). If the app is not installed, the link opens in the browser and the web join page is shown.

## Android: `assetlinks.json`

1. Get your app’s **SHA256 certificate fingerprint**:
   - **Debug:**  
     `keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android`
   - **Release:**  
     `keytool -list -v -keystore your-release-key.keystore -alias your-key-alias`
2. Copy the **SHA256** line (format `AA:BB:CC:...`).
3. Replace `REPLACE_WITH_YOUR_SHA256_FINGERPRINT` in `assetlinks.json` with that value (keep the array and quotes).
4. Deploy so `https://YOUR_DOMAIN/.well-known/assetlinks.json` is publicly accessible.

## iOS: `apple-app-site-association`

1. In [Apple Developer](https://developer.apple.com/account), find your **Team ID** and use your app’s **bundle ID** (`com.patchank.chromoscientia`).
2. Replace `REPLACE_WITH_YOUR_TEAM_ID.com.patchank.chromoscientia` in `apple-app-site-association` with `YOUR_TEAM_ID.com.patchank.chromoscientia`.
3. Deploy so `https://YOUR_DOMAIN/.well-known/apple-app-site-association` is publicly accessible (no `.json` extension).
4. Ensure the app’s **Associated Domains** capability uses `applinks:YOUR_DOMAIN` (already set in `app.config.js` from `EXPO_PUBLIC_WEB_APP_URL`).

## Verification

- **Android:** [Statement List Generator and Tester](https://developers.google.com/digital-asset-links/tools/generator) or open the join URL on a device with the app installed.
- **iOS:** [Apple App Site Association (AASA) Validator](https://branch.io/resources/aasa-validator/) or open the join URL on a device with the app installed.
