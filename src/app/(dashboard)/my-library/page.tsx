"use client"

import { useState } from "react";
import { useModal } from "@/app/context/modal-context";
import { SignInForm } from "@/app/modules/components/sign-in/sign-in";
import { SignUpForm } from "@/app/modules/components/sign-up/sign-up";
import { LibraryPageContent } from "@/app/modules/components/dashboard/library/library-page";



const MyLibraryPage = () => {

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

            <LibraryPageContent />

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

export default MyLibraryPage