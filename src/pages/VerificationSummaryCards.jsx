import { useEffect, useState } from "react";
import VerificationStatCard from "./VerificationCard";
import { CheckCircle, ShieldCheck } from "lucide-react";

export default function VerificationSummaryCards({ token }) {
    const [stats, setStats] = useState({
        totalVerifications: 0,
        successfulVerifications: 0
    });

    useEffect(() => {
        fetchSummary();
    }, []);

    async function fetchSummary() {

        const TOKEN = token || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjk3MzM3ZGQ2YzMwODZjOTgwZWFkODYxIiwiZW1haWwiOiJzdXNhbi5laGlzLWFrb2xvckBiZXRjaGllZi5uZyIsImlhdCI6MTc2OTU1MTM0OSwiZXhwIjoxNzY5NjM3NzQ5fQ.eRH7zSh0jQaOS3drga6mnIVfrr1eyK7Y5kNOQbyQTkM"
        const res = await fetch(
            "http://localhost:3006/api/analytics/kyc/summary",
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`
                }
            }
        );

        const json = await res.json();
        if (json.success) {
            setStats(json.data);
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Total Verifications */}
            <VerificationStatCard
                title="Total Verifications"
                value={stats.totalVerifications}
                icon={<ShieldCheck className="text-blue-600" />}
                iconBg="bg-blue-100"
                footer={
                    <span className="flex items-center gap-1 cursor-pointer">
                        Today
                        <svg width="10" height="6" viewBox="0 0 10 6">
                            <path d="M1 1l4 4 4-4" stroke="currentColor" />
                        </svg>
                    </span>
                }
            />

            {/* Successful Verifications */}
            <VerificationStatCard
                title="Total Successful Verifications"
                value={stats.successfulVerifications}
                icon={<CheckCircle className="text-orange-500" />}
                iconBg="bg-orange-100"
                footer={
                    <span className="flex items-center gap-2">
                        <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs">
                            10%
                        </span>
                        Compared to last month
                    </span>
                }
            />

        </div>
    );
}
