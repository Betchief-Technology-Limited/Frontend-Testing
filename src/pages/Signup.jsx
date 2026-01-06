import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import shield from "../assets/Shield.png";
import { signUpAdmin } from "../config/api.js";

export default function Signup() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState('')

    const [form, setForm] = useState({
        companyName: "",
        email: "",
        password: "",
        confirmPassword: "",
        terms: true
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.companyName || !form.email || !form.password || !form.confirmPassword) {
            setError("All fields are required");
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        setError("");

        try {
             const response = await signUpAdmin({
                companyName: form.companyName,
                email: form.email,
                password: form.password,
                confirmPassword: form.confirmPassword,
                terms: form.terms
            });

            setSuccessMessage(response.message)

            setTimeout(()=>{
                navigate("/check-email", {
                    state: { email: form.email }
                });
            }, 1000)
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to create account. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* LEFT SECTION */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-b from-black to-gray-900 text-white px-16 py-12 relative">
                <div className="w-full">
                    {/* Brand */}
                    <div className="flex items-center gap-2 mb-16">
                        <div className="w-6 h-6 bg-white/20 rounded-md" />
                        <span className="font-semibold text-sm">Authentify</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-3xl font-semibold leading-snug max-w-md">
                        Ensuring your business’
                        <br />
                        Compliance with African
                        <br />
                        Regulations.
                    </h1>

                    {/* Illustration */}
                    <div className="absolute bottom-16 left-16 w-72 h-72 rounded-2xl bg-white/10 flex items-center justify-center">
                        <img
                            src={shield}
                            alt="Security Shield"
                            className="w-56 object-contain"
                        />
                    </div>
                </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-6">
                <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-8">
                    <h2 className="text-2xl font-semibold mb-1">
                        Create an Authentify Account
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">
                        Your data is safe and secure with us
                    </p>

                    <form onSubmit={handleSubmit}>
                        {/* Error */}
                        {error && (
                            <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                                {error}
                            </div>
                        )}

                           {successMessage && (
                            <div className="mb-4 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                                {successMessage}
                            </div>
                        )}

                        {/* Company Name */}
                        <div className="mb-4">
                            <label className="text-sm font-medium text-gray-700">
                                Company Name
                            </label>
                            <input
                                type="text"
                                name="companyName"
                                placeholder="Company Name"
                                value={form.companyName}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-purple-600 focus:outline-none"
                            />
                        </div>

                        {/* Email */}
                        <div className="mb-4">
                            <label className="text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={form.email}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-purple-600 focus:outline-none"
                            />
                        </div>

                        {/* Password */}
                        <div className="mb-4">
                            <label className="text-sm font-medium text-gray-700">
                                Create Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Create Password"
                                value={form.password}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-purple-600 focus:outline-none"
                            />

                            <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
                                <span className="px-2 py-1 bg-gray-100 rounded">
                                    ✔ Uppercase letter
                                </span>
                                <span className="px-2 py-1 bg-gray-100 rounded">
                                    ✔ Lowercase letter
                                </span>
                                <span className="px-2 py-1 bg-gray-100 rounded">
                                    ✔ Number
                                </span>
                                <span className="px-2 py-1 bg-gray-100 rounded">
                                    ✔ Special character
                                </span>
                                <span className="px-2 py-1 bg-gray-100 rounded">
                                    ✔ Min 8 characters
                                </span>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="mb-6">
                            <label className="text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-purple-600 focus:outline-none"
                            />
                        </div>

                        {/* Login link */}
                        <div className="text-sm text-center mb-6">
                            Already have an account?{" "}
                            <a
                                href="/login"
                                className="text-purple-600 font-medium hover:underline"
                            >
                                Log In
                            </a>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white py-3 rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-60"
                        >
                            {loading ? "Creating account..." : "Proceed"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
