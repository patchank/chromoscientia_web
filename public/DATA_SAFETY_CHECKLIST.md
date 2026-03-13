# Data Safety Checklist – Chromoscientia (Google Play Console)

Use this checklist when filling the **Data safety** section in Google Play Console (Policy > App content > Data safety).

---

## Before you start

- Have your **privacy policy URL** ready (e.g. where you host `PRIVACY_POLICY.md`).
- In Data safety, you will answer: **Does your app collect or share user data?** → **Yes**.

---

## 1. Data types to declare

Google groups data into categories. For Chromoscientia, declare the following.

### 1.1 Name or other identifiers (nickname)

| Question | Answer |
|----------|--------|
| **Data type** | Personal info → Name or other identifiers |
| **Is this data collected, shared, or both?** | Collected (and “shared” only in the sense that other players in the same room see it—see “Sharing” below). |
| **Is collection required or optional?** | Required (needed to show who is in the room and who described/guessed). |
| **Why is this data collected?** | App functionality (running the multiplayer game). |
| **Is this data processed ephemerally?** | You can indicate that data is **not** stored long-term. Data (including nicknames) is **deleted after the game ends** / when the room is closed or within a short time. |
| **Is this data shared with third parties?** | No (only visible to other players in the same in-app session; not sent to advertisers or other third parties). |

**Optional disclosure in “Additional information” (if the form allows):**  
“Nicknames and other game data are deleted when the game or room ends, or shortly thereafter. We do not retain this data long-term.”

---

### 1.2 Gameplay data (scores, room/game state)

| Question | Answer |
|----------|--------|
| **Data type** | App activity → Gameplay data (or similar; e.g. scores, game state). |
| **Is this data collected, shared, or both?** | Collected. |
| **Is collection required or optional?** | Required (needed for the game to work). |
| **Why is this data collected?** | App functionality. |
| **Is this data processed ephemerally?** | Yes / Not stored long-term. Data is **deleted after the game ends** (or when the room is closed / within a short time). |
| **Is this data shared with third parties?** | No. |

---

### 1.3 User-generated content (descriptions and guesses)

| Question | Answer |
|----------|--------|
| **Data type** | App activity → User-generated content (e.g. in-app messages, other content users create). |
| **Is this data collected, shared, or both?** | Collected. |
| **Is collection required or optional?** | Required (part of the game). |
| **Why is this data collected?** | App functionality. |
| **Is this data processed ephemerally?** | Yes / Not stored long-term. Data is **deleted after the game ends**. |
| **Is this data shared with third parties?** | No (only visible to other players in the same room during the session). |

---

### 1.4 Device or other IDs (anonymous player ID)

| Question | Answer |
|----------|--------|
| **Data type** | Device or other IDs (e.g. app-generated anonymous ID). |
| **Is this data collected, shared, or both?** | Collected (and sent to our servers only to associate you with a room/game). |
| **Is collection required or optional?** | Required. |
| **Why is this data collected?** | App functionality. |
| **Is this data processed ephemerally?** | Can be described as not retained on servers after the room/game is deleted. Stored on device until app data is cleared. |
| **Is this data shared with third parties?** | No. |

---

## 2. Security practices

When Play asks about security:

- **Is data encrypted in transit?** Yes (HTTPS / Firebase uses TLS).
- **Do users have a way to request data deletion?** You can state: “Data, including nicknames and game content, is automatically deleted after the game or room ends; we do not retain it. Users can clear the app’s data or uninstall to remove the local player ID.”

---

## 3. Short summary to paste (if the form has a free-text summary)

You can use something like this in the Data safety form or in “Additional information”:

> Chromoscientia collects only what is needed to run the multiplayer game: the nickname you choose, game state (scores, descriptions, guesses), and an anonymous app-generated player ID. This data is visible only to other players in the same room during the game. **Data, including nicknames, is deleted after the game ends** (or when the room closes / within a short time). We do not sell data or share it with third parties for advertising. Data is encrypted in transit. See our privacy policy for full details.

---

## 4. Checklist before submitting

- [ ] Privacy policy URL is set in **Store presence > Main store listing > Privacy policy**.
- [ ] **Data safety**: “Does your app collect or share user data?” set to **Yes**.
- [ ] All four data types above are declared (identifiers/nickname, gameplay data, user-generated content, device/other IDs) with correct purpose and ephemeral/deletion disclosure.
- [ ] “Data deleted after the game ends” (including nicknames) is clearly stated where the form allows.
- [ ] No selling of data; no sharing with third parties for ads.
- [ ] Security: data encrypted in transit; deletion behavior described.

---

*After publishing, you can point users to your privacy policy from the app or store listing.*
