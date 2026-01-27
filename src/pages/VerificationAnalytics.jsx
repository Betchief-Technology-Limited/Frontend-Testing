import { useEffect, useState } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer
} from "recharts";

const COLORS = {
    nin: "#C084FC",
    bvn: "#A78BFA",
    drivers_license: "#93C5FD",
    cac: "#60A5FA",
    others: "#CBD5E1"
}

export default function VerificationAnalytics({ token }) {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    async function fetchAnalytics() {
        try {
            setLoading(true)

            const TOKEN = token || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjk3MzM3ZGQ2YzMwODZjOTgwZWFkODYxIiwiZW1haWwiOiJzdXNhbi5laGlzLWFrb2xvckBiZXRjaGllZi5uZyIsImlhdCI6MTc2OTU1MTM0OSwiZXhwIjoxNzY5NjM3NzQ5fQ.eRH7zSh0jQaOS3drga6mnIVfrr1eyK7Y5kNOQbyQTkM"

            const res = await fetch(
                "http://localhost:3006/api/analytics/kyc/verification-rates",
                {
                    headers: {
                        Authorization: `Bearer ${TOKEN}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            const json = await res.json();
            if (!json.success) return;

            const total = json.data.reduce((sum, i) => sum + i.count, 0)

            const formatted = json.data.map(i => ({
                type: i.type,
                count: i.count,
                percentage: total
                    ? Number(((i.count / total) * 100).toFixed(1))
                    : 0
            }));

            setChartData(formatted);
        } catch (err) {
            console.error("Analytics fetch failed", err);
        } finally {
            setLoading(false)
        }
    }

    const totalPercent = chartData.reduce(
        (sum, i) => sum + i.percentage,
        0
    );

    return (
        <div className="bg-white rounded-xl shadow p-6 w-full max-w-md">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
                Verification Analytics
            </h3>

            {/* Chart */}
            <div className="relative h-64">
                {loading ? (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        Loading analytics…
                    </div>
                ) : chartData.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        No data available
                    </div>
                ) : (
                    <>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    dataKey="percentage"
                                    startAngle={180}
                                    endAngle={0}
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={2}
                                >
                                    {chartData.map((entry) => (
                                        <Cell
                                            key={entry.type}
                                            fill={COLORS[entry.type] || "#E5E7EB"}
                                        />
                                    ))}
                                </Pie>

                                <Tooltip formatter={(v) => `${v}%`} />
                            </PieChart>
                        </ResponsiveContainer>

                        {/* Center label */}
                        <div className="absolute inset-x-0 bottom-12 text-center">
                            <p className="text-2xl font-bold text-gray-900">
                                {totalPercent.toFixed(0)}%
                            </p>
                            <p className="text-xs text-gray-500">
                                Total Verifications
                            </p>
                        </div>
                    </>
                )}
            </div>

            {/* Legend */}
            <div className="mt-4 space-y-2">
                {chartData.map(item => (
                    <div
                        key={item.type}
                        className="flex items-center justify-between text-sm"
                    >
                        <div className="flex items-center gap-2">
                            <span
                                className="w-3 h-3 rounded-full"
                                style={{
                                    backgroundColor: COLORS[item.type] || "#E5E7EB"
                                }}
                            />
                            <span className="capitalize text-gray-700">
                                {item.type.replace("_", " ")}
                            </span>
                        </div>

                        <span className="font-medium text-gray-900">
                            {item.percentage}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}