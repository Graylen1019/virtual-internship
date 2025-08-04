'use client';

import React, { useState } from 'react';
// Import only the necessary Firebase functions for SIGNING UP
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

// Import your initialized Firebase instances (auth and db) from your client setup
import { auth, db } from '../../../lib/utils/firebase-client'; // Assuming firebase-client.ts exports 'auth' and 'db'

import { Separator } from '@radix-ui/react-separator';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { X } from 'lucide-react'; // Import X icon for closing the modal
import { useRouter } from 'next/navigation'; // Correct import for useRouter in Next.js 13+ app directory

// Define props for the SignUpForm component
interface SignUpFormProps {
  onClose: () => void;
  onSignInClick: () => void;
}

export const SignUpForm = ({ onClose, onSignInClick }: SignUpFormProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const provider = new GoogleAuthProvider();
    const router = useRouter(); // Initialize Next.js router

    /**
     * Handles Google sign-up/sign-in using a popup.
     * On success, stores user data in Firestore and redirects to "/for-you".
     * Displays error messages if sign-up fails.
     */
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

    /**
     * Handles email and password sign-up.
     * Creates a new user with email and password, then stores basic user data in Firestore.
     * On success, redirects to the "/sign-in" page (or calls onSignInClick).
     * Displays error messages for invalid credentials or other issues.
     * @param e The form submission event.
     */
    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage(''); // Clear previous messages

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password); // Use the imported 'auth' instance
            const user = userCredential.user;

            const userDocRef = doc(db, 'users', user.uid); // Use the imported 'db' instance
            await setDoc(userDocRef, {
                email: user.email,
                createdAt: new Date(),
            });

            setMessage('Sign-up successful! Please sign in.');
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
        // Modal overlay: fixed, full screen, semi-transparent background, centered content
        <div className='fixed inset-0 bg-[#000000be] backdrop-blur-[2px] flex justify-center items-center z-50'>
            <div className='w-full max-w-[400px] p-8 bg-white rounded-lg shadow-xl relative'>
                {/* Close button */}
                <button
                onClick={onClose}
                    className='absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors duration-200'
                    aria-label="Close"
                >
                    <X size={24} />
                </button>

                <h2 className='text-2xl font-bold text-center text-gray-800 mb-6'>Sign Up to Summarist</h2>

                {/* Google Sign-up Button */}
                <button
                    className='flex items-center justify-center w-full py-2.5 px-4 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mb-4'
                    onClick={signInWithGooglePopup}
                >
                    <AiFillGoogleCircle size={26} className='mr-3' />
                    Sign up with Google
                </button>

                {/* Separator */}
                <Separator className='my-4 w-full h-[1px] bg-gray-300' />

                {/* Email and Password Sign-up Form */}
                <form onSubmit={handleSignUp} className='flex flex-col gap-4'>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className='px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500'
                        placeholder='your.email@example.com'
                    />
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className='px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500'
                        placeholder='********'
                    />

                    <button
                        type="submit"
                        className='w-full py-2.5 mt-2 bg-green-500 text-white rounded-md font-bold hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
                    >
                        Sign Up
                    </button>

                    {/* "Already have an account? Sign in!" link, now calling onSignInClick */}
                    <button
                    onClick={onSignInClick}
                        type="button" // Important: set type="button" to prevent form submission
                        className='text-center text-blue-600 hover:underline mt-3 text-sm'
                    >
                        Already have an account? Sign in!
                    </button>

                    {/* Message display */}
                    {message && (
                        <p className={`mt-4 text-center text-sm ${message.startsWith('Error') ? 'text-red-500' : 'text-green-600'}`}>
                            {message}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
};
