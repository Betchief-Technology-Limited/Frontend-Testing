import { useState } from "react";
import { useOnboarding } from "../../useContextAPI/OnboardingContext";

export default function Step1PersonalInfo() {
    const { organization, saveStep } = useOnboarding();

    const [error, setError] = useState("");

    const [form, setForm] = useState({
        firstName: organization.personalProfile?.firstName || "",
        lastName: organization.personalProfile?.lastName || "",
        phoneNumber: organization.personalProfile?.phoneNumber || "",
        gender: organization.personalProfile?.gender || ""
    });

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    function submit() {
        const { firstName, lastName, phoneNumber, gender } = form;

        if(!firstName || !lastName || !phoneNumber || !gender) {
            setError("Please complete all required fields");
            return;
        }
        saveStep(1, {
            personalProfile: form,

            // Agree to terms and conditions
            agreedToTerms: true
        });
    };

    return (
        <>
            <h2 className="text-lg font-semibold mb-4">Tell us about yourself</h2>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="label">First Name</label>
                    <input
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        className="input"
                    />
                </div>
                <div>
                    <label className="label">Last Name</label>
                    <input
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        className="input"
                    />
                </div>
            </div>

            <div className="mb-4">
                <label className="label">Phone Number</label>
                <input
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    className="input"
                />
            </div>

            <div className="mb-6">
                <label className="label">Gender</label>
                <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="input"
                >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
            </div>

            <button onClick={submit} className="btn">
                Save & Continue
            </button>
        </>

    )
}