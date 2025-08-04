// app/context/ModalContext.tsx
"use client";
import React, { createContext, useContext, useState } from "react";

type ModalContextType = {
  openSignInModal: () => void;
  closeSignInModal: () => void;
  isSignInOpen: boolean;
};

const ModalContext = createContext<ModalContextType | null>(null);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isSignInOpen, setSignInOpen] = useState(false);

  const openSignInModal = () => setSignInOpen(true);
  const closeSignInModal = () => setSignInOpen(false);

  return (
    <ModalContext.Provider value={{ openSignInModal, closeSignInModal, isSignInOpen }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within a ModalProvider");
  return ctx;
};
