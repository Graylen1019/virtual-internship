// app/auth/signup-form.tsx
'use client';

import React from 'react';
import { useState } from 'react';
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, signInAnonymously, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/utils/firebase-client';
import { Separator } from '@radix-ui/react-separator'; // Assuming Radix Separator is correctly configured with Tailwind
import { AiFillGoogleCircle } from 'react-icons/ai';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Router } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [message, setMessage] = useState('');

  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const router = useRouter()

  const signInWithGooglePopup = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential && credential.accessToken) {
          console.log("Google Access Token:", credential.accessToken);
        } else if (credential) {
          console.error("Error: Credential found, but no access token was attached.");
        } else {
          console.error("No specific credential object was returned with this error.");
        }
        const user = result.user;
        console.log("User signed in with Google (Popup):", user);
        setMessage('Signed in with Google successfully!');
        router.push("/for-you")
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(`Error signing in with Google (Popup): ${errorCode} - ${errorMessage}`);
        setMessage(`Error signing in with Google: ${errorMessage}`);
      });
  };

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
      router.push("/sign-in")
    } catch (error: unknown) {
      console.error('Error signing up or adding user data:', error);
      if (error instanceof Error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage('An unexpected error occurred during sign-up. Please try again.');
      }
    }
  };

  return (
    <div className='max-w-md mx-auto p-8 bg-gray-200 shadow-lg rounded-lg mt-10'>
      <h2 className='text-3xl font-bold text-center text-gray-800 mb-8'>Sign Up</h2>

      <div className='flex flex-col w-full gap-4 mb-8'> {/* Adjusted margin-bottom */}

        <button
          className='text-center h-full w-full px-4 py-3 bg-blue-600 font-semibold rounded-2xl hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          onClick={signInWithGooglePopup}
        >
          <div className='flex items-center gap-4'>
            <AiFillGoogleCircle color='white' size={36} className='items-start' />
            <p className='text-xl text-white'>Sign up With Google</p>
          </div>
        </button>
      </div>

      <Separator className='my-6 w-full h-px bg-gray-300' color='black' /> {/* Added Tailwind classes for visibility */}

      <form onSubmit={handleSignUp} className='flex flex-col gap-5'>
        <div className='flex flex-col'>
          <label htmlFor='email' className='text-gray-700 font-semibold text-xl mb-2'>Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            placeholder='your.email@example.com'
          />
        </div>
        <div className='flex flex-col'>
          <label htmlFor='password' className='text-gray-700 font-semibold text-lg mb-2'>Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className='px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            placeholder='********'
          />
        </div>


        <Button
          variant={"ghost"}
          type="submit"
          className='w-full px-4 py-3 mt-4 bg-green-400 text-black font-bold rounded-md hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
        >
          Sign Up
        </Button>
        {!message && (
          <Button
            variant={"ghost"}
          >
            <Link className='underline text-blue-400' href={"/sign-in"}>
              Already have an acoount?
            </Link>
          </Button>
        )}
        {message && (
          <p className={`mt-4 text-center text-sm ${message.startsWith('Error') ? 'text-red-500' : 'text-green-600'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};