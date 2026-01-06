import { useState } from "react";
import { useOnboarding } from "../../useContextAPI/OnboardingContext";

function YesNoRadio({ label, value, onChange }) {
    return (
        <div className="mb-4">
            <p className="text-sm mb-2">{label}</p>
            <div className="flex gap-6">
                <label className="flex items-center gap-2">
                    <input
                        type="radio"
                        checked={value === true}
                        onChange={() => onChange(true)}
                    />
                    Yes
                </label>

                <label className="flex items-center gap-2">
                    <input
                        type="radio"
                        checked={value === false}
                        onChange={() => onChange(false)}
                    />
                    No
                </label>
            </div>
        </div>
    );
}

export default function Step5Supplementary() {
    const { organization, saveStep, submit } = useOnboarding();
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        // ROOT LEVEL (null = unanswered)
        requiresLicense: organization.requiresLicense ?? null,
        servicesRegulatedByAuthority:
            organization.servicesRegulatedByAuthority ?? null,
        complyWithAntiLaundering:
            organization.complyWithAntiLaundering ?? null,
        hasAntiLaunderingPolicies:
            organization.hasAntiLaunderingPolicies ?? null,
        hasNdaWithStaff: organization.hasNdaWithStaff ?? null,
        hasSanctionsForLaundering:
            organization.hasSanctionsForLaundering ?? null,
        hasSanctionsForDataBreach:
            organization.hasSanctionsForDataBreach ?? null,
        hasDataProtectionPolicy:
            organization.hasDataProtectionPolicy ?? null,

        // NESTED
        dataProtection: {
            adoptSecurityMeasures:
                organization.dataProtection?.adoptSecurityMeasures ?? null,
            transferDataToOtherCountries:
                organization.dataProtection?.transferDataToOtherCountries ?? null,
            useDataForOtherPurposes:
                organization.dataProtection?.useDataForOtherPurposes ?? null,
            sanctionedByRegulator:
                organization.dataProtection?.sanctionedByRegulator ?? null,
            createAlternateDatabase:
                organization.dataProtection?.createAlternateDatabase ?? null,
        },
    });

    const setRoot = (key, value) =>
        setForm({ ...form, [key]: value });

    const setNested = (key, value) =>
        setForm({
            ...form,
            dataProtection: {
                ...form.dataProtection,
                [key]: value,
            },
        });

    function hasUnanswered() {
        const rootUnanswered = Object.values(form)
            .filter(v => typeof v !== "object")
            .some(v => v === null);

        const nestedUnanswered = Object.values(form.dataProtection)
            .some(v => v === null);

        return rootUnanswered || nestedUnanswered;
    }

    async function finalize() {
        if (hasUnanswered()) {
            setError("Please answer all questions before submitting.");
            return;
        }

        setError("");
        await saveStep(5, form);
        await submit();
    }

    return (
        <>
            <h2 className="text-lg font-semibold mb-6">
                Supplementary Questions
            </h2>

            {error && (
                <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* ROOT QUESTIONS */}
            <YesNoRadio
                label="Does your business require a license?"
                value={form.requiresLicense}
                onChange={(v) => setRoot("requiresLicense", v)}
            />

            <YesNoRadio
                label="Are your services regulated by an authority?"
                value={form.servicesRegulatedByAuthority}
                onChange={(v) =>
                    setRoot("servicesRegulatedByAuthority", v)
                }
            />

            <YesNoRadio
                label="Do you comply with anti-money laundering laws?"
                value={form.complyWithAntiLaundering}
                onChange={(v) =>
                    setRoot("complyWithAntiLaundering", v)
                }
            />

            <YesNoRadio
                label="Do you have AML policies in place?"
                value={form.hasAntiLaunderingPolicies}
                onChange={(v) =>
                    setRoot("hasAntiLaunderingPolicies", v)
                }
            />

            <YesNoRadio
                label="Do staff sign NDAs?"
                value={form.hasNdaWithStaff}
                onChange={(v) =>
                    setRoot("hasNdaWithStaff", v)
                }
            />

            <YesNoRadio
                label="Are there sanctions for laundering violations?"
                value={form.hasSanctionsForLaundering}
                onChange={(v) =>
                    setRoot("hasSanctionsForLaundering", v)
                }
            />

            <YesNoRadio
                label="Are there sanctions for data breaches?"
                value={form.hasSanctionsForDataBreach}
                onChange={(v) =>
                    setRoot("hasSanctionsForDataBreach", v)
                }
            />

            <YesNoRadio
                label="Do you have a data protection policy?"
                value={form.hasDataProtectionPolicy}
                onChange={(v) =>
                    setRoot("hasDataProtectionPolicy", v)
                }
            />

            {/* DATA PROTECTION */}
            <h3 className="text-md font-semibold mt-8 mb-4">
                Data Protection Practices
            </h3>

            <YesNoRadio
                label="Do you adopt security measures?"
                value={form.dataProtection.adoptSecurityMeasures}
                onChange={(v) =>
                    setNested("adoptSecurityMeasures", v)
                }
            />

            <YesNoRadio
                label="Do you transfer data to other countries?"
                value={form.dataProtection.transferDataToOtherCountries}
                onChange={(v) =>
                    setNested("transferDataToOtherCountries", v)
                }
            />

            <YesNoRadio
                label="Do you use data for other purposes?"
                value={form.dataProtection.useDataForOtherPurposes}
                onChange={(v) =>
                    setNested("useDataForOtherPurposes", v)
                }
            />

            <YesNoRadio
                label="Have you been sanctioned by a regulator?"
                value={form.dataProtection.sanctionedByRegulator}
                onChange={(v) =>
                    setNested("sanctionedByRegulator", v)
                }
            />

            <YesNoRadio
                label="Do you maintain an alternate database?"
                value={form.dataProtection.createAlternateDatabase}
                onChange={(v) =>
                    setNested("createAlternateDatabase", v)
                }
            />

            <button onClick={finalize} className="btn mt-8">
                Submit Onboarding
            </button>
        </>
    );
}

