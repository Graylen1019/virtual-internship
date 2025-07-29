// app/auth/signin-form.tsx (renamed for clarity, consider renaming the file itself)
'use client';

import React, { useState } from 'react';
// Import only the necessary Firebase functions for SIGNING IN
import { GoogleAuthProvider, signInAnonymously, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// Import your initialized Firebase instances (auth and db)
import { auth, db } from '../../lib/utils/firebase-client'; // Adjust path if needed

import { Separator } from '@radix-ui/react-separator';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { User2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const SignInForm = () => { // Keep the component name as SignInForm
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const provider = new GoogleAuthProvider();
    const router = useRouter()

    const signInWithGooglePopup = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                if (credential && credential.accessToken) {
                    console.log("Google Access Token:", credential.accessToken);
                }
                const user = result.user;
                console.log("User signed in with Google:", user);
                setMessage('Signed in with Google successfully!');
                router.push("/for-you")
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.error(`Error signing in with Google: ${errorMessage}`);
                setMessage(`Error signing in with Google: ${errorMessage}`);
            });
    };

    // Anonymous (Guest) Login
    const handleGuestLogin = () => {
        signInAnonymously(auth)
            .then(() => {
                console.log("Signed in anonymously!");
                setMessage('Signed in as Guest!');
                router.push("/for-you")
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.error(`Error signing in anonymously: ${errorMessage}`);
                setMessage(`Error signing in as Guest: ${errorMessage}`);
            });
    };

    // Email and Password Login
    const handleEmailPasswordLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage('');

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            console.log("User signed in with email/password:", user);

            // Optional: Fetch additional user data from Firestore if you stored it during sign-up
            const userDocRef = doc(db, 'users', user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                console.log("User data from Firestore:", userDocSnap.data());
                setMessage('Logged in successfully!');
                router.push("/for-you")
            } else {
                console.log("No additional user data found in Firestore for this user.");
                setMessage('Logged in successfully, but no additional profile data found.');
            }

        } catch (error: unknown) {
            console.error('Error logging in with email/password:', error);
            if (error instanceof Error) {
                setMessage(`Error: ${error.message}`);
            } else {
                setMessage('An unexpected error occurred during login. Please try again.');
            }
        }
    };

    return (
        <div className='max-w-md mx-auto p-8 bg-gray-200 shadow-lg rounded-lg mt-10'>
            {/* Changed from "Sign Up" to "Sign In" */}
            <h2 className='text-3xl font-bold text-center text-gray-800 mb-8'>Sign In</h2>

            <div className='flex flex-col w-full gap-4 mb-8'>
                <button
                    className='text-center h-full w-full px-4 py-3 bg-blue-600 font-semibold rounded-2xl hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                    onClick={signInWithGooglePopup}
                >
                    <div className='flex items-center gap-4'>
                        <AiFillGoogleCircle color='white' size={36} className='items-start' />
                        <p className='text-xl text-white'>Sign in with Google</p>
                    </div>
                </button>
            </div>

            <Separator className='my-6 w-full h-[3px] bg-gray-300' color='black' />

            <div className='flex flex-col w-full gap-4 mb-8'>
                <button
                    onClick={() => handleGuestLogin()}
                    className='w-full px-4 py-3 bg-gray-600 font-semibold rounded-2xl hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
                >
                    <div className='flex items-center gap-4'>
                        <User2 color='white' className='items-start' size={36} />
                        <p className='text-lg text-white'>Sign in as guest</p>
                    </div>
                </button>
            </div>

            <form onSubmit={handleEmailPasswordLogin} className='flex flex-col gap-5'>
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
                    Sign In {/* Changed from "Sign Up" to "Sign In" */}
                </Button>
                {/* This link should now point to a *Sign Up* page, not back to itself */}
                {/* Only show if no message is displayed (i.e., before login attempt result) */}
                {!message && (
                    <Button
                        variant={"ghost"}
                    >
                        {/* Changed link text and href to reflect signing *up* */}
                        <Link className='underline text-blue-400' href={"/sign-up"}>
                            Don&apos;t have an account? Sign up!
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