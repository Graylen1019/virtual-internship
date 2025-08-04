"use client"

import { useModal } from '@/app/context/modal-context';
import { ForYouContent } from '@/app/modules/components/For You/for-you-content';
import { SignInForm } from '@/app/modules/components/sign-in/sign-in';
import { SignUpForm } from '@/app/modules/components/sign-up/sign-up';
import { useState } from 'react';

const ForYouPage = () => {
  const { isSignInOpen, closeSignInModal } = useModal();
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const openSignUpModal = () => {
    setIsSignUpOpen(true);
    closeSignInModal();
  };

  const closeSignUpModal = () => setIsSignUpOpen(false);

  return (
    <>
      <ForYouContent />

      {isSignInOpen && (
        <SignInForm
          onClose={closeSignInModal}
          onSignUpClick={openSignUpModal}
        />
      )}

      {isSignUpOpen && (
        <SignUpForm
          onClose={closeSignUpModal}
          onSignInClick={closeSignUpModal}
        />
      )}
    </>
  );
};

export default ForYouPage
