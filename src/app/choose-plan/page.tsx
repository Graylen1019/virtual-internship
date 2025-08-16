"use client";

import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { app, db } from "@/app/lib/utils/firebase-client";
import Image from "next/image";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@radix-ui/react-accordion";
import { FileIcon, LeafIcon, HandshakeIcon } from "lucide-react";
import { usePlans } from "@/hooks/use-plans"; // <-- import the hook

const PlanPage = () => {
    const { plans, selectedPlan, setSelectedPlan } = usePlans(); // <-- use hook
    const [user, setUser] = useState<User | null>(null);
    const Year = new Date().getFullYear();

    // Track auth user
    useEffect(() => {
        const auth = getAuth(app);
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => setUser(firebaseUser));
        return unsubscribe;
    }, []);

    // Checkout logic
    const handleCheckout = async (priceId: string) => {
        if (!user?.uid) {
            alert("You must be logged in to start a subscription.");
            return;
        }

        try {
            const checkoutRef = collection(db, "customers", user.uid, "checkout_sessions");
            const docRef = await addDoc(checkoutRef, {
                price: priceId,
                success_url: window.location.origin,
                cancel_url: window.location.origin,
            });

            const unsubscribe = onSnapshot(docRef, (snapshot) => {
                const data = snapshot.data() as { url?: string; error?: { message: string } };

                if (data.error) {
                    alert("Checkout failed: " + data.error.message);
                    unsubscribe();
                    return;
                }

                if (data.url) {
                    window.location.href = data.url;
                    unsubscribe();
                }
            });
        } catch (err: unknown) {
            const errorMessage =
                typeof err === "object" && err !== null && "message" in err
                    ? (err as { message?: string }).message
                    : "Unknown error";
            alert("Checkout failed: " + errorMessage);
            console.error(err);
        }
    };

    return (
        <>
            {/* Hero Section */}
            <div className="relative text-center w-full pt-12 mb-6 before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-[#032b41] before:rounded-br-[16rem] before:rounded-bl-[16rem] before:-z-10">
                <div className="max-w-[1000px] mx-auto text-[#fff] px-6">
                    <div className="text-5xl font-bold mb-10 leading-normal">
                        Get unlimited access to many amazing books to read
                    </div>
                    <div className="text-xl mb-8">
                        Turn ordinary moments into amazing learning opportunities
                    </div>
                    <div className="flex justify-center max-w-[340px] mx-auto rounded-tr-[180px] rounded-tl-[180px] overflow-hidden">
                        <Image src={`/assets/pricing.webp`} alt="pricing" width={340} height={285} />
                    </div>
                </div>
            </div>

            {/* Features */}
            <div className="w-full max-w-[1070px] px-6 py-10 mx-auto">
                <div className="grid grid-cols-3 justify-items-center text-center gap-6 max-w-[800px] mx-auto mb-14">
                    <div>
                        <figure className="flex justify-center text-[#032b41] mb-3">
                            <FileIcon size={52} />
                        </figure>
                        <div className="text-[#394547] leading-normal">
                            <b>Key ideas in a few minutes</b> with many books to read.
                        </div>
                    </div>
                    <div>
                        <figure className="flex justify-center text-[#032b41] mb-3">
                            <LeafIcon size={52} />
                        </figure>
                        <div className="text-[#394547] leading-normal">
                            <b>3 Million</b> people growing with Summarist everyday.
                        </div>
                    </div>
                    <div>
                        <figure className="flex justify-center text-[#032b41] mb-3">
                            <HandshakeIcon size={52} />
                        </figure>
                        <div className="text-[#394547] leading-normal">
                            <b>Precise recommendations</b> collections curated by experts.
                        </div>
                    </div>
                </div>

                {/* Plans */}
                <div className="text-3xl text-[#032b41] text-center mb-8 font-bold">
                    Choose the plan that fits you.
                </div>

                <div className="flex flex-col gap-6 max-w-[680px] mx-auto">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            onClick={() => setSelectedPlan(plan)}
                            className={`flex gap-6 p-6 border-4 rounded-xs cursor-pointer transition-colors duration-200 ${selectedPlan?.id === plan.id ? "border-[#2bd97c]" : "border-[#bac8ce]"
                                }`}
                        >
                            <div className="relative w-6 h-6 rounded-[50%] border-2 border-[#000] flex items-center justify-center">
                                {selectedPlan?.id === plan.id && (
                                    <div className="absolute w-1.5 h-1.5 bg-[#000] rounded-[50%]"></div>
                                )}
                            </div>
                            <div>
                                <div className="text-lg font-semibold text-[#032b41] mb-1">{plan.name}</div>
                                <div className="text-2xl font-bold text-[#032b41] mb-1">
                                    ${plan.prices[0]?.amount / 100 || "0"}/{plan.prices[0]?.interval}
                                </div>
                                <div className="text-[#6b757b] text-sm">{plan.description}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Checkout button */}
                <div className="bg-[#fff] sticky bottom-0 z-[1] py-8 flex flex-col items-center gap-4">
                    <button
                        onClick={() => {
                            if (selectedPlan?.prices[0]?.id) handleCheckout(selectedPlan.prices[0].id);
                            else alert("No price selected");
                        }}
                        className="bg-[#2bd97c] text-[#032b41] w-[300px] h-10 rounded-sm transition-colors duration-200 flex items-center justify-center min-w-[180px] hover:bg-[#20ba68]"
                    >
                        Start your free 7-day trial
                    </button>

                    <div className="text-xs text-[#6b757b] text-center">
                        Cancel your trial at any time before it ends, and you won’t be charged.
                    </div>
                </div>

                {/* Accordion / FAQ */}
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1" className="">
                        <AccordionTrigger>
                            <div className=" mb-2 overflow-hidden flex justify-between items-center cursor-pointer py-6 gap-2 w-full">
                                <div className="font-medium text-2xl relative mb-0 text-[#032b41] transition-all duration-300">
                                    How does the free 7-day trial work?
                                </div>

                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="min-h-px pb-6 text-[#394547] leading-normal">
                                Begin your complimentary 7-day trial with a Summarist annual membership. You are under no obligation to continue your subscription, and you will only be billed when the trial period expires. With Premium access, you can learn at your own pace and as frequently as you desire, and you may terminate your subscription prior to the conclusion of the 7-day free trial.
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2" className="">
                        <AccordionTrigger>
                            <div className=" mb-2 overflow-hidden flex justify-between items-center cursor-pointer py-6 gap-2 w-full">
                                <div className="font-medium text-2xl relative mb-0 text-[#032b41] transition-all duration-300">
                                    Can I switch subscriptions from monthly to yearly, or yearly to monthly?
                                </div>

                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="min-h-px pb-6 text-[#394547] leading-normal">
                                While an annual plan is active, it is not feasible to switch to a monthly plan. However, once the current month ends, transitioning from a monthly plan to an annual plan is an option.
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3" className="">
                        <AccordionTrigger>
                            <div className=" mb-2 overflow-hidden flex justify-between items-center cursor-pointer py-6 gap-2 w-full">
                                <div className="font-medium text-2xl relative mb-0 text-[#032b41] transition-all duration-300">
                                    What&apos;s included in the Premium plan?
                                </div>

                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="min-h-px pb-6 text-[#394547] leading-normal">
                                Premium membership provides you with the ultimate Summarist experience, including unrestricted entry to many best-selling books high-quality audio, the ability to download titles for offline reading, and the option to send your reads to your Kindle.
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4" className="">
                        <AccordionTrigger>
                            <div className="border-b-[1px] border-[#ddd] mb-2 overflow-hidden flex justify-between items-center cursor-pointer py-6 gap-2 w-full">
                                <div className="font-medium text-2xl relative mb-0 text-[#032b41] transition-all duration-300">
                                    Can I cancel during my trial or subscription?
                                </div>

                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="min-h-px pb-6 text-[#394547] leading-normal">
                                You will not be charged if you cancel your trial before its conclusion. While you will not have complete access to the entire Summarist library, you can still expand your knowledge with one curated book per day.
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

            {/* Footer */}
            <footer className="w-full bg-[#f1f6f4] py-10 text-[#394547] text-sm">
                <div className="max-w-[1070px] mx-auto px-6">
                    <div className="grid grid-cols-4 gap-6 mb-6">
                        {/* Footer blocks repeated */}
                        <div>
                            <h4 className="font-semibold mb-2">Actions</h4>
                            <ul>
                                <li>Summarist Magazine</li>
                                <li>Cancel Subscription</li>
                                <li>Help</li>
                                <li>Contact us</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Useful Links</h4>
                            <ul>
                                <li>Pricing</li>
                                <li>Summarist Business</li>
                                <li>Gift Cards</li>
                                <li>Authors & Publishers</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Company</h4>
                            <ul>
                                <li>About</li>
                                <li>Careers</li>
                                <li>Partners</li>
                                <li>Code of Conduct</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Other</h4>
                            <ul>
                                <li>Sitemap</li>
                                <li>Legal Notice</li>
                                <li>Terms of Service</li>
                                <li>Privacy Policies</li>
                            </ul>
                        </div>
                    </div>
                    <div className="text-center text-[#6b757b]">
                        Copyright &copy; {Year} Summarist.
                    </div>
                </div>
            </footer>
        </>
    );
};

export default PlanPage;
