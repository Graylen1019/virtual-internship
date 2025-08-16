"use client"

import { db } from "@/app/lib/utils/firebase-client";
import { Button } from "@/components/ui/button";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { NoUserContent } from "../auth";
import { Skeleton } from "@/components/ui/skeleton";

const SettingsPageSkeleton = () => {
    return (
        <div className="max-w-[1070px] w-full py-10 px-6 mx-auto">
            <h1 className="text-left border-b-[1px] border-[#e1e7ea] pb-4 text-3xl text-[#032b41] mb-8 font-bold">
                Settings
            </h1>
            <div className="flex flex-col items-start gap-2 mb-8 border-b-[1px] border-[#e1e7ea] pb-6">
                <h1 className="text-lg font-bold text-[#032b41]">Your subscription plan</h1>
                <div className="w-full">

                    <Skeleton className="h-5 w-1/2" />
                </div>
            </div>
            <div className="flex items-start flex-col gap-2 pb-6">
                <h1 className="text-lg font-bold text-[#032b41]">Email</h1>
                <div className="w-full">

                    <Skeleton className="h-5 w-1/2" />
                </div>
            </div>
        </div>
    )
}

export const SettingsPageContent = () => {
    const [userSubscriptionStatus, setUserSubscriptionStatus] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>()
    const [error, setError] = useState<string | boolean>()
    const auth = getAuth();
    const router = useRouter()

    useEffect(() => {
        const fetchUserData = async () => {
            const currentUser = auth.currentUser;
            if (currentUser) {
                setUserEmail(currentUser.email);
                setLoading(true)

                const userDocRef = doc(db, "users", currentUser.uid);
                const userDocSnap = await getDoc(userDocRef);


                if (userDocSnap.exists()) {
                    setUserSubscriptionStatus(userDocSnap.data().subscriptionStatus);
                    setLoading(false)
                } else {
                    setLoading(false)
                    setUserSubscriptionStatus("No subscription data found.");
                }
            } else {
                setError(!auth.currentUser)
                setLoading(false)
                setUserSubscriptionStatus("User not logged in.");
                setUserEmail("Not available");
            }
        };

        fetchUserData();
    }, [auth, error]);

    if (loading) return <SettingsPageSkeleton />

    if (!auth.currentUser) return (
        <>
            <div className="pt-10 px-6 max-w-[1070px] mx-auto w-full">
                <h1 className="text-left border-b-[1px] border-[#e1e7ea] pb-4 text-3xl text-[#032b41] mb-8 font-bold">
                    Settings
                </h1>
            </div>
            <NoUserContent />
        </>
    )

    return (
        <div className="max-w-[1070px] w-full py-10 px-6 mx-auto">
            <h1 className="text-left border-b-[1px] border-[#e1e7ea] pb-4 text-3xl text-[#032b41] mb-8 font-bold">
                Settings
            </h1>
            <div className="flex flex-col items-start gap-2 mb-8 border-b-[1px] border-[#e1e7ea] pb-6">
                <h1 className="text-lg font-bold text-[#032b41]">Your subscription plan</h1>
                <p className="text-[#032b41]">{userSubscriptionStatus}</p>
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
                <p className="text-[#032b41]">{userEmail}</p>
            </div>
        </div>
    );
}