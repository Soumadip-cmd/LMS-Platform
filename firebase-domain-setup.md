# Firebase Authentication Domain Setup

## Current Issue
Firebase authentication is failing with the error:
```
Google login error: FirebaseError: Firebase: Error (auth/unauthorized-domain).
```

This error occurs because `www.preplings.com` is not listed as an authorized domain in your Firebase project.

## Solution

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `preplings`
3. Navigate to **Authentication** in the left sidebar
4. Click on the **Settings** tab
5. Scroll down to the **Authorized domains** section
6. Click **Add domain**
7. Add `www.preplings.com` to the list of authorized domains
8. Click **Add**

## Verification
After adding the domain, test the Google sign-in functionality on `https://www.preplings.com` to ensure it works correctly.

## Additional Domains
If you plan to use other subdomains or domains in the future, add them to the authorized domains list as well.

## Note
This change only affects Firebase Authentication. The CORS issues with your API are handled separately by the changes made to the server configuration.
