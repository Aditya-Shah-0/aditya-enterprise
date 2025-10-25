import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { AuthPage } from './components/authPage';
import { BusinessSetupPage } from './components/BusinessSetupPage';
import { AppLayout } from './components/AppLayout';
import SubscriptionPage from './components/SubscriptionPage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app;
// eslint-disable-next-line react-refresh/only-export-components
export let auth, db;
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (e) {
  console.error("Firebase initialization error:", e);
}

export default function AuthHandler() {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [businessProfile, setBusinessProfile] = useState(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      setIsProfileLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const appId = import.meta.env.VITE_APP_ID || "my-unique-app-id";
        const profileRef = doc(db, `artifacts/${appId}/users/${user.uid}/businessProfile/profile`);
        try {
          const profileSnap = await getDoc(profileRef);
          if (profileSnap.exists()) {
            setBusinessProfile(profileSnap.data());
          } else {
            setBusinessProfile(null);
          }
        } catch (error) {
          console.error("Error fetching business profile:", error);
          setBusinessProfile(null);
        }
      } else {
        setBusinessProfile(null);
      }
      setIsProfileLoading(false);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading || isProfileLoading) {
    return <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">Loading Account...</div>;
  }

  // Case 1: User is NOT logged in
  if (!user) {
    return <AuthPage />;
  }

  // Case 2: User IS logged in, but has NOT created a business profile yet
  if (user && !businessProfile) {
    return <BusinessSetupPage user={user} onProfileCreated={setBusinessProfile} />;
  }

  // Case 3: User IS logged in, HAS a profile, BUT "ME" flag is NOT 1 (i.e., 0 or undefined)
  if (user && businessProfile && businessProfile.ME !== 1) {
    return <SubscriptionPage user={user} />;
  }

  // Case 4: User IS logged in, HAS a profile, AND "ME" flag IS 1
  // This is the only case where the main app is shown.
  if (user && businessProfile && businessProfile.ME === 1) {
    return <AppLayout user={user} businessProfile={businessProfile} />;
  }

  // Fallback case (should rarely be reached)
  return <AuthPage />;
}