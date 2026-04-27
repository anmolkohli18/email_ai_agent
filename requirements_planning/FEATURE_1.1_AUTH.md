# Feature 1.1: Firebase Authentication Setup

## Overview
Implement complete authentication system using Firebase with email/password, Google OAuth, and OTP-based email login. Auto-create user profiles in Firestore.

## Technical Stack
- Firebase Authentication (v10+)
- Firebase Firestore (for user profiles)
- Next.js 15 App Router
- React 19
- TypeScript

## Database Schema

### Users Collection (`users`)
```typescript
interface User {
  uid: string;                    // Firebase Auth UID
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'admin' | 'user';        // For permissions
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt: Timestamp;
  authProvider: 'email' | 'google' | 'otp';
}
```

## Components to Build

### 1. Authentication Context
- `lib/firebase/auth-context.tsx`
- Provides auth state globally
- Handles user loading and persistence

### 2. Firebase Configuration
- `lib/firebase/config.ts`
- Initialize Firebase app
- Export auth and firestore instances

### 3. Authentication Utilities
- `lib/firebase/auth.ts`
- Helper functions for auth operations
- User creation/update logic

### 4. UI Components
- `app/(auth)/login/page.tsx` - Login page
- `app/(auth)/signup/page.tsx` - Signup page
- `components/auth/LoginForm.tsx` - Email/password login
- `components/auth/GoogleButton.tsx` - Google OAuth button
- `components/auth/OTPLoginForm.tsx` - OTP email login
- `components/auth/ProtectedRoute.tsx` - Route guard

### 5. Middleware
- `middleware.ts` - Protect routes, redirect logic

## Authentication Flows

### Flow 1: Email/Password Login
1. User enters email and password
2. Firebase validates credentials
3. On success: Check if user exists in Firestore
4. If not exists: Create user profile with default role
5. Redirect to dashboard

### Flow 2: Google OAuth
1. User clicks "Continue with Google"
2. Google OAuth popup/redirect
3. Firebase handles OAuth flow
4. On success: Check if user exists in Firestore
5. If not exists: Create user profile from Google data
6. Redirect to dashboard

### Flow 3: OTP Email Login
1. User enters email
2. Firebase sends OTP to email
3. User enters OTP code
4. Firebase validates OTP
5. On success: Check if user exists in Firestore
6. If not exists: Create user profile
7. Redirect to dashboard

## Security Rules (Firestore)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Admin can read all users
    match /users/{userId} {
      allow read: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## Environment Variables

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

## Implementation Checklist

- [ ] Install Firebase dependencies
- [ ] Setup Firebase project and get config
- [ ] Create Firebase config file
- [ ] Implement authentication context
- [ ] Create auth utility functions
- [ ] Build login page UI
- [ ] Build signup page UI
- [ ] Implement email/password auth
- [ ] Implement Google OAuth
- [ ] Implement OTP email login
- [ ] Auto-create user profile in Firestore
- [ ] Setup protected routes
- [ ] Add middleware for auth checks
- [ ] Test all authentication flows
- [ ] Add error handling and validation

## Testing Scenarios

1. New user signs up with email/password
2. Existing user logs in with email/password
3. New user signs in with Google
4. Existing user signs in with Google
5. User requests OTP and logs in
6. User tries to access protected route without auth
7. User logs out and session is cleared
8. User profile is created in Firestore on first login

## Success Criteria

✅ User can sign up with email/password
✅ User can log in with email/password
✅ User can sign in with Google OAuth
✅ User can log in with OTP via email
✅ User profile automatically created in Firestore
✅ Protected routes redirect to login if not authenticated
✅ User can log out successfully
✅ Auth state persists across page refreshes
✅ Error messages displayed for failed auth attempts
