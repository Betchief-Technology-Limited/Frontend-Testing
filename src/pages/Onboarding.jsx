import { OnboardingProvider, useOnboarding } from "../useContextAPI/OnboardingContext";
import { useUser } from "../useContextAPI/userContextApi";
import OnboardingLayOut from "../components/onboarding/OnboardingLayout";
import Step1PersonalInfo from "../components/onboarding/Step1PersonalInfo";
import Step2BusinessInfo from "../components/onboarding/Step2BusinessInfo";
import Step3DPO from "../components/onboarding/Step3DPO";
import Step4Documents from "../components/onboarding/Step4Documents";
import Step5Supplementary from "../components/onboarding/Step5SupplementarySummary";
import StepCompleted from "../components/onboarding/StepCompleted";


const steps = [
    Step1PersonalInfo,
    Step2BusinessInfo,
    Step3DPO,
    Step4Documents,
    Step5Supplementary,
    StepCompleted
]

function OnboardingFlow() {
    const { organization, loading } = useOnboarding()
    if (loading) return null;

    if (!organization) {
        return (
            <div className="min-h-screen grid place-items-center text-sm text-gray-500">
                Loading onboarding…
            </div>
        );
    }

    const Step = steps[organization.currentStep - 1] || Step1PersonalInfo;
    return (
        <OnboardingLayOut organization={organization}>
            <Step />
        </OnboardingLayOut>
    )
}

export default function Onboarding() {
    const { user, loading } = useUser();
    if(loading) return null;
    if(!user) return null;
    return (
        <OnboardingProvider clientId={user._id}>
            <OnboardingFlow />
        </OnboardingProvider>
    )
}