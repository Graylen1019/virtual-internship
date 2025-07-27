// app/auth/signup-form.tsx (recommended extension if it contains JSX)
'use client';

import React from 'react';
import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/utils/firebase-client';

export const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [message, setMessage] = useState('');

  const auth = getAuth();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        firstName: firstName,
        lastName: lastName,
        email: user.email,
        createdAt: new Date(),
      });

      setMessage('Sign-up successful! User data added to Firestore.');
    } catch (error: unknown) { // Explicitly mark as 'unknown' for clarity, though it's the default
      console.error('Error signing up or adding user data:', error);

      // --- START OF CHANGE ---
      // Type Guard: Check if the caught error is an instance of the Error class
      if (error instanceof Error) {
        setMessage(`Error: ${error.message}`);
      } else {
        // Fallback for unexpected error types (e.g., if a string or number was thrown)
        setMessage('An unexpected error occurred during sign-up. Please try again.');
        // Optionally log the raw error to understand its structure if this path is hit
        // console.error('Caught a non-Error type:', error);
      }
      // --- END OF CHANGE ---
    }
  };

  return (
    <form onSubmit={handleSignUp}>
      <h2>Sign Up</h2>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <div>
        <label>First Name:</label>
        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
      </div>
      <div>
        <label>Last Name:</label>
        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
      </div>
      <button type="submit">Sign Up</button>
      {message && <p>{message}</p>}
    </form>
  );
};
