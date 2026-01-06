import { createContext, useContext, useEffect, useState } from "react";
import {
    createOrGetDraft,
    saveDraft,
    submitOnboarding,
    getOrganizationByClient
} from "../api/organization.api.js";

const OnboardingContext = createContext();

export const useOnboarding = () => useContext(OnboardingContext)

export function OnboardingProvider({ clientId, children }) {
    const [organization, setOrganization] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!clientId) {
            setLoading(false);
            return;
        }
        const initOnboarding = async () => {
            try {
                setLoading(true);

                const res = await getOrganizationByClient(clientId);

                /**
                 * BACKEND RESPONSE CASES
                 * 1. { success: true, data: organization }
                 * 2. { success: true, data: { status, organization: null } }
                 */

                if (res.data.data?.organization === null) {
                    const draft = await createOrGetDraft({ clientId });
                    setOrganization(draft.data.data)
                } else {
                    setOrganization(res.data.data)
                }
                setLoading(false)
            } catch (err) {
                console.error("Onboarding init error:", err);
                setError("Failed to load onboarding data")
            } finally {
                setLoading(false)
            }
        };

        initOnboarding();
    }, [clientId]);

    async function saveStep(step, payload) {
        if (!organization._id) return;

        try {
            const res = await saveDraft(organization._id, step, payload);
            setOrganization(res.data.data)

        } catch (err) {
            console.error("Save step error:", err);
            throw err;
        }
    }

    async function submit() {
        if (!organization._id) return
        try {
            await submitOnboarding(organization._id);
            setOrganization((prev)=>({
                ...prev,
                onboardingStatus: "submitted"
            }))
        } catch (err) {
            console.error("Submit onboarding error:", err);
            throw err;
        }
    }

    return (
        <OnboardingContext.Provider
            value={{ organization, loading, error, saveStep, submit }}
        >
            {children}
        </OnboardingContext.Provider>
    )
}