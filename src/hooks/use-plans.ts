import { useEffect, useState } from "react";
import { db } from "@/app/lib/utils/firebase-client";
import { collection, getDocs } from "firebase/firestore";

export interface Price {
  id: string;
  amount: number; // in cents
  interval: string; // "month" | "year"
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  prices: Price[];
}

export const usePlans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const productsSnapshot = await getDocs(collection(db, "products"));

        const loadedPlans: Plan[] = await Promise.all(
          productsSnapshot.docs.map(async (doc) => {
            const data = doc.data();

            // Fetch subcollection 'prices' for this product
            const pricesSnapshot = await getDocs(
              collection(db, "products", doc.id, "prices")
            );
            const prices: Price[] = pricesSnapshot.docs.map((priceDoc) => {
              const priceData = priceDoc.data();
              return {
                id: priceData.stripe_price_id || priceDoc.id,
                amount: data.stripe_metadata_price
                  ? Math.round(
                      parseFloat(data.stripe_metadata_price.replace("$", "")) *
                        100
                    )
                  : 0,
                interval: priceData.interval || "month",
              };
            });

            return {
              id: doc.id,
              name: data.stripe_metadata_name,
              description: data.stripe_metadata_trial,
              prices,
            };
          })
        );

        setPlans(loadedPlans);
        setSelectedPlan(loadedPlans[0] || null);
      } catch (err) {
        console.error("Error fetching plans:", err);
      }
    };

    fetchPlans();
  }, []);

  return { plans, selectedPlan, setSelectedPlan };
};
