"use client";

import { useState } from "react";
import { useModal } from "@/app/context/modal-context";
import { SignInForm } from "@/app/modules/components/sign-in/sign-in";
import { SignUpForm } from "@/app/modules/components/sign-up/sign-up";
import { BookPageContent } from "@/app/modules/components/book-page/book-page";



export default function BookPage() {
    const { isSignInOpen, closeSignInModal, openSignInModal } = useModal();
    const [isSignUpOpen, setIsSignUpOpen] = useState(false);

    const openSignUpModal = () => {
        setIsSignUpOpen(true);
        closeSignInModal();
    };

    const closeSignUpModal = () => setIsSignUpOpen(false);

    const handleSignInFromSignUp = () => {
        closeSignUpModal();
        openSignInModal();
    };


    return (
        <>

            <BookPageContent />

            {isSignInOpen && (
                <SignInForm
                    onClose={closeSignInModal}
                    onSignUpClick={openSignUpModal} />
            )}

            {isSignUpOpen && (
                <SignUpForm
                    onClose={closeSignUpModal}
                    onSignInClick={handleSignInFromSignUp} />
            )}

        </>
    );
}