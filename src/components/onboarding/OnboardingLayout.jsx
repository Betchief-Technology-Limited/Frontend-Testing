import ProgressCircle from "./ProgressCircle";

export default function OnboardingLayOut({ organization, children }) {
    return(
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-md mx-auto bg-white rounded-xl p-8 relative">
                <div className="absolute top-6 right-6">
                    <ProgressCircle value={organization.completionPercentage} />
                </div>
                {children}
            </div>
        </div>
    )
}