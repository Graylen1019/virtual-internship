"use client"

import { useModal } from "@/app/context/modal-context";
import { PlayerPageContent } from "@/app/modules/components/book-player/player-page/player-page";
import { SignInForm } from "@/app/modules/components/sign-in/sign-in";
import { SignUpForm } from "@/app/modules/components/sign-up/sign-up";
import { useState } from "react";

const PlayerPage = () => {
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

            <PlayerPageContent />

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

export default PlayerPage;