import { useState, useEffect } from "react";
import { useOnboarding } from "../../useContextAPI/OnboardingContext";
import { useUser } from "../../useContextAPI/userContextApi";

export default function Step2BusinessInfo() {
    const { organization, saveStep } = useOnboarding();
    const { user } = useUser();
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        registeredName: organization.businessProfile?.registeredName || "",
        registrationNumber:
            organization.businessProfile?.registrationNumber || "",
        industry: organization.businessProfile?.industry || "",
    });

    // ✅ AUTO-FILL REGISTERED NAME FROM SIGNUP
    useEffect(() => {
        if (
            !form.registeredName &&
            user?.companyName
        ) {
            setForm((prev) => ({
                ...prev,
                registeredName: user.companyName,
            }));
        }
    }, [user, form.registeredName]);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function submit() {
        const { registeredName, registrationNumber, industry } = form;

        if (!registeredName || !registrationNumber || !industry) {
            setError("Please kindly fill all fields");
            return;
        }

        saveStep(2, {
            businessProfile: form,
        });
    }

    return (
        <>
            <h2 className="text-lg font-semibold mb-4">
                Tell us about your business
            </h2>

            {error && (
                <p className="text-red-500 text-sm mb-4">
                    {error}
                </p>
            )}

            <div className="mb-4">
                <label className="label">Registered Name</label>
                <input
                    name="registeredName"
                    value={form.registeredName}
                    onChange={handleChange}
                    className="input"
                />
            </div>

            <div className="mb-4">
                <label className="label">Registration Number</label>
                <input
                    name="registrationNumber"
                    value={form.registrationNumber}
                    onChange={handleChange}
                    className="input"
                />
            </div>

            <div className="mb-6">
                <label className="label">Industry</label>
                <input
                    name="industry"
                    value={form.industry}
                    onChange={handleChange}
                    className="input"
                />
            </div>

            <button onClick={submit} className="btn">
                Save & Continue
            </button>
        </>
    );
}
