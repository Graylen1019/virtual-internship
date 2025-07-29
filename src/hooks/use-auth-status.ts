// src/hooks/useAuthStatus.ts (or .js if you're not strictly using .ts, but this error implies you are)
"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth"; // <--- Import 'User' type here
import { auth } from "@/app/lib/utils/firebase-client"; // Assuming this path is correct for your Firebase config

const useAuthStatus = () => {
    // Explicitly tell TypeScript that 'user' can be a 'User' object or 'null'
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            // currentUser is already typed as User | null by Firebase SDK
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { user, loading };
};

export default useAuthStatus;