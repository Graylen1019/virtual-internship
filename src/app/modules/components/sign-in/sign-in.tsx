'use client';

import React, { useState } from 'react';
import { GoogleAuthProvider, signInAnonymously, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../lib/utils/firebase-client'; 

import { Separator } from '@radix-ui/react-separator';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { User2, X } from 'lucide-react'; 
import { useRouter } from 'next/navigation';

interface SignInFormProps {
  onClose: () => void;
  onSignUpClick: () => void;
}


export const SignInForm = ({ onClose, onSignUpClick }: SignInFormProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const provider = new GoogleAuthProvider();
    const router = useRouter();

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
                router.push("/for-you");
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.error(`Error signing in with Google: ${errorMessage}`);
                setMessage(`Error signing in with Google: ${errorMessage}`);
            });
    };

    const handleGuestLogin = () => {
        signInAnonymously(auth)
            .then(() => {
                console.log("Signed in anonymously!");
                setMessage('Signed in as Guest!');
                router.push("/for-you"); // Redirect on successful login
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.error(`Error signing in anonymously: ${errorMessage}`);
                setMessage(`Error signing in as Guest: ${errorMessage}`);
            });
    };

    const handleEmailPasswordLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage('');

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            console.log("User signed in with email/password:", user);

            const userDocRef = doc(db, 'users', user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                console.log("User data from Firestore:", userDocSnap.data());
                setMessage('Logged in successfully!');
                router.push("/for-you");
            } else {
                console.log("No additional user data found in Firestore for this user.");
                setMessage('Logged in successfully, but no additional profile data found.');
                router.push("/for-you");
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

                <h2 className='text-2xl font-bold text-center text-gray-800 mb-6'>Log in to Summarist</h2>

                {/* Google Sign-in Button */}
                <button
                    className='flex items-center justify-center w-full py-2.5 px-4 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mb-4'
                    onClick={signInWithGooglePopup}
                >
                    <AiFillGoogleCircle size={26} className='mr-3' />
                    Sign in with Google
                </button>

                {/* Separator */}
                <Separator className='my-4 w-full h-[1px] bg-gray-300' />

                {/* Guest Sign-in Button */}
                <button
                    onClick={handleGuestLogin}
                    className='flex items-center justify-center w-full py-2.5 px-4 bg-gray-600 text-white rounded-md font-semibold hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mb-6'
                >
                    <User2 className='mr-3' size={24} />
                    Sign in as guest
                </button>

                {/* Separator */}
                <Separator className='my-6 w-full h-[1px] bg-gray-300' />

                {/* Email and Password Login Form */}
                <form onSubmit={handleEmailPasswordLogin} className='flex flex-col gap-4'>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className='px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500'
                        placeholder='Email address'
                    />
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className='px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500'
                        placeholder='Password'
                    />

                    <button
                        type="submit"
                        className='w-full py-2.5 mt-2 bg-green-500 text-white rounded-md font-bold hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
                    >
                        Login
                    </button>

                    {/* "Don't have an account?"*/}
                    <button
                    onClick={onSignUpClick}
                        type="button" 
                        className='text-center text-blue-600 hover:underline mt-3 text-sm'
                    >
                        Don&apos;t have an account? Sign up!
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
