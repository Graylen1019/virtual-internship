"use client"

import { db } from "@/app/lib/utils/firebase-client";
import { Button } from "@/components/ui/button";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export const SettingsPageContent = () => {
    const [userSubscriptionStatus, setUserSubscriptionStatus] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const auth = getAuth();
    const router = useRouter()

    useEffect(() => {
        const fetchUserData = async () => {
            const currentUser = auth.currentUser;
            if (currentUser) {
                // Set the user's email directly from the currentUser object
                setUserEmail(currentUser.email);
                
                const userDocRef = doc(db, "users", currentUser.uid);
                const userDocSnap = await getDoc(userDocRef);
                
                if (userDocSnap.exists()) {
                    setUserSubscriptionStatus(userDocSnap.data().subscriptionStatus);
                } else {
                    // Handle the case where the user document doesn't exist
                    setUserSubscriptionStatus("No subscription data found.");
                }
            } else {
                // Handle the case where there is no authenticated user
                setUserSubscriptionStatus("User not logged in.");
                setUserEmail("Not available");
            }
        };

        fetchUserData();
    }, [auth]);
    return ( 
            <div className="max-w-[1070px] w-full py-10 px-6 mx-auto">
            <h1 className="text-left border-b-[1px] border-[#e1e7ea] pb-4 text-3xl text-[#032b41] mb-8 font-bold">
                Settings
            </h1>
            <div className="flex flex-col items-start gap-2 mb-8 border-b-[1px] border-[#e1e7ea] pb-6">
                <h1 className="text-lg font-bold text-[#032b41]">Your subscription plan</h1>
                <p className="text-[#032b41]">{userSubscriptionStatus || "Loading..."}</p>
                {userSubscriptionStatus !== "premium" && (
                    <Button
                    variant={"ghost"}
                        onClick={() => router.push("/choose-plan")}
                        className="bg-[#2bd97c] text-[#032b41] w-full h-10 rounded-sm transition-all duration-200 flex items-center justify-center min-w-[180px] max-w-[180px] hover:bg-[#20ba68]"
                    >
                        Upgrade to premium
                    </Button>
                )}
            </div>
            <div className="flex items-start flex-col gap-2 pb-6">
                <h1 className="text-lg font-bold text-[#032b41]">Email</h1>
                <p className="text-[#032b41]">{userEmail || "Loading..."}</p>
            </div>
        </div>
    );
}