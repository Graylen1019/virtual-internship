// app/auth/signup-form.tsx
'use client';

import React, { useState } from 'react';
// Import only the necessary Firebase functions for SIGNING UP
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

// Import your initialized Firebase instances (auth and db) from your client setup
import { auth, db } from '../../lib/utils/firebase-client'; // Assuming firebase-client.ts exports 'auth' and 'db'

import { Separator } from '@radix-ui/react-separator';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Correct import for useRouter in Next.js 13+ app directory

export const SignUpForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // Removed firstName and lastName states
    const [message, setMessage] = useState('');

    const provider = new GoogleAuthProvider();
    const router = useRouter(); // Initialize Next.js router

    const signInWithGooglePopup = () => {
        signInWithPopup(auth, provider) // Use the imported 'auth' instance
            .then(async (result) => { // Mark as async to await Firestore operations if needed
                const user = result.user;
                // Optional: Store Google user's initial data if they are new or update existing
                const userDocRef = doc(db, 'users', user.uid);
                await setDoc(userDocRef, {
                    email: user.email,
                    displayName: user.displayName || 'Google User',
                    photoURL: user.photoURL || null,
                    createdAt: new Date(),
                }, { merge: true }); // Use merge:true to avoid overwriting existing data

                setMessage('Signed up with Google successfully!');
                router.push("/for-you"); // Redirect after successful Google sign-up
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.error(`Error signing up with Google: ${errorMessage}`);
                setMessage(`Error signing up with Google: ${errorMessage}`);
            });
    };

    // Removed handleGuestLogin function and related imports (User2)

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage('');

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password); // Use the imported 'auth' instance
            const user = userCredential.user;

            const userDocRef = doc(db, 'users', user.uid); // Use the imported 'db' instance
            await setDoc(userDocRef, {
                // Removed firstName and lastName from setDoc
                email: user.email,
                createdAt: new Date(),
            });

            setMessage('Sign-up successful! User data added to Firestore.');
            router.push("/sign-in"); // Redirect to login page after successful sign-up
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

            <div className='flex flex-col w-full gap-4 mb-8'>
                <button
                    className='text-center h-full w-full px-4 py-3 bg-blue-600 font-semibold rounded-2xl hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-white'
                    onClick={signInWithGooglePopup}
                >
                    <div className='flex items-center gap-4 justify-center'>
                        <AiFillGoogleCircle color='white' size={36} />
                        <p className='text-xl'>Sign up With Google</p>
                    </div>
                </button>
            </div>

            <Separator className='my-6 w-full h-[3px] bg-gray-300' />

            {/* Removed the "Sign in as guest" section entirely */}

            <form onSubmit={handleSignUp} className='flex flex-col gap-5'>
                {/* Removed First Name Input */}
                {/* Removed Last Name Input */}

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
                            Already have an account? Sign in!
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
