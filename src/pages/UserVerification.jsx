import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function UserVerification() {
    const navigate = useNavigate();
    const [params] = useSearchParams();

    const verified = params.get("verified"); //"true" | "false"
    const reason = params.get("reason")

    useEffect(() => {
        if (verified === "true") {
            const timer = setTimeout(() => {
                navigate('/onboarding')
            }, 2000);

            return () => clearTimeout(timer)
        }
    }, [verified, navigate]);

    return (
        <div className="min-h-screen w-screen grid place-items-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8 text-center">
                {verified === "true" ? (
                    <>
                        <h1 className="text-2xl font-semibold text-green-600 mb-3">
                            Email Verified 🎉
                        </h1>

                        <p className="text-sm text-gray-600 mb-6">
                            Your email has been successfully verified.
                            You are being logged in automatically.
                        </p>

                        <div className="text-xs text-gray-400">
                            Redirecting to onboarding…
                        </div>
                    </>
                ) : (
                    <>
                        <h1 className="text-2xl font-semibold text-red-600 mb-3">
                            Verification Failed
                        </h1>

                        <p className="text-sm text-gray-600 mb-6">
                            {reason === "invalid_or_expired"
                                ? "This verification link is invalid or has expired."
                                : "Email verification could not be completed."}
                        </p>

                        <button
                            onClick={() => navigate("/signup")}
                            className="w-full bg-black text-white py-3 rounded-lg text-sm font-medium"
                        >
                            Go back to Sign Up
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}