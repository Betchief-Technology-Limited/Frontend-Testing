import { uploadDocuments } from "../../api/organization.api.js";
import { useOnboarding } from "../../useContextAPI/OnboardingContext";
import { useState } from "react";

export default function Step4Documents() {
    const { organization, saveStep } = useOnboarding();
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    async function handleUpload(e, key) {
        try {
            setUploading(true);
            setError("")

            const file = e.target.files[0];
            if (!file) return;

            const fd = new FormData();
            fd.append(key, file);

            await uploadDocuments(organization._id, fd);
        } catch (err) {
            console.error("Upload failed:", err);
            setError("File upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    }

    async function handleContinue() {
        const uploads = organization.uploads || {};

         // ✅ REQUIRED DOCUMENTS
        if (!uploads.certificateOfIncorporation || !uploads.directorsId) {
            setError(
                "Please upload Certificate of Incorporation and Directors ID before continuing."
            );
            return;
        }
        // ✅ Mark step as completed and move to next step
        await saveStep(4, {});
    }

    return (
        <>
            <h2 className="text-lg font-semibold mb-4">
                Upload Documents
            </h2>

            {[
                { key: "certificateOfIncorporation", label: "Certificate of Incorporation" },
                { key: "directorsId", label: "Directors ID" },
                { key: "shareholdersParticulars", label: "Shareholders Particulars" },
                { key: "operatingLicence", label: "Operating Licence" },
            ].map(({ key, label }) => (
                <div key={key} className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                        {label}
                    </label>
                    <input
                        type="file"
                        onChange={(e) => handleUpload(e, key)}
                        className="block w-full text-sm"
                    />
                </div>
            ))}

            {/* ✅ SAVE & CONTINUE BUTTON */}
            <button
                onClick={handleContinue}
                disabled={uploading}
                className="mt-6 w-full bg-black text-white py-3 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
            >
                {uploading ? "Uploading…" : "Save & Continue"}
            </button>
        </>
    );
}


