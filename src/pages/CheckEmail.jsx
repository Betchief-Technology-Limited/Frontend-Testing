import { useLocation, useNavigate } from "react-router-dom";
import plane from "../assets/plane.png";
import { useEffect, useState } from "react";
import { emailVerification } from "../config/api";

export default function CheckEmailForVerification() {
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;
    const [timer, setTimer] = useState(180);

    useEffect(() => {
        if (timer <= 0) return;
        const i = setInterval(() => setTimer(t => t - 1), 1000);
        return () => clearInterval(i);
    }, [timer]);

    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;

    const handleResend = async () => {
        await emailVerification({ email });
        setTimer(180);
    };

    if (!email) {
        return (
            <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
                Email not found. Please sign up again.
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8 text-center">
                <img
                    src={plane}
                    alt="Verify email"
                    className="mx-auto w-40 mb-6"
                />

                <h1 className="text-xl font-semibold mb-2">
                    Verify Email Address
                </h1>

                <p className="text-sm text-gray-500 mb-2">
                    A verification link has been sent to
                </p>

                <p className="font-medium mb-6 break-all">
                    {email}
                </p>

                <div className="text-xs text-gray-500 mb-6">
                    {minutes}:{seconds.toString().padStart(2, "0")}
                    <button
                        disabled={timer > 0}
                        onClick={handleResend}
                        className="ml-2 font-medium text-purple-600 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                        Resend Link
                    </button>
                </div>

                <button
                    onClick={() => navigate("/signup")}
                    className="w-full bg-black text-white py-3 rounded-lg text-sm font-medium hover:opacity-90 transition"
                >
                    Edit Account Information
                </button>
            </div>
        </div>
    );

}
