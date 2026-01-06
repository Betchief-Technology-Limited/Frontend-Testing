import { useState } from "react";
import { useOnboarding } from "../../useContextAPI/OnboardingContext";

export default function Step3DPO() {
    const { organization, saveStep } = useOnboarding();

    const [error, setError] = useState("")

    const [form, setForm] = useState({
        firstName: organization?.dataProtectionOfficer?.firstName || "",
        lastName: organization?.dataProtectionOfficer?.lastName || "",
        phoneNumber: organization?.dataProtectionOfficer?.phoneNumber || "",
        gender: organization?.dataProtectionOfficer?.gender || "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        const { firstName, lastName, phoneNumber, gender } = form;

        if (!firstName || !lastName || !phoneNumber || !gender) {
            setError("Please enter all fields");
            return;
        }

        console.log("Submitting organization:", {
            personalProfile: organization.personalProfile,
            businessProfile: organization.businessProfile,
            dataProtectionOfficer: organization.dataProtectionOfficer,
        });

        await saveStep(3, {
            dataProtectionOfficer: {
                firstName: form.firstName,
                lastName: form.lastName,
                phoneNumber: form.phoneNumber,
                gender: form.gender,
            },
        });
    };

    return (
        <>
            <h2 className="text-lg font-semibold mb-4">
                Data Protection Officer Details
            </h2>
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <input
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                className="input"
            />

            <input
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                className="input"
            />

            <input
                name="phoneNumber"
                placeholder="Phone Number"
                value={form.phoneNumber}
                onChange={handleChange}
                className="input"
            />

            <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="input"
            >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
            </select>

            <button
                onClick={handleSubmit}
                className="btn mt-6"
            >
                Save & Continue
            </button>
        </>
    );
}
