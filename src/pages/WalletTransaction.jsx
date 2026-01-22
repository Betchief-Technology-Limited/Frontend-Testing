import { useEffect, useState } from "react";

/**
 * Wallet Transactions Table (Cursor Pagination)
 * Backend: GET /wallet/transactions?limit=50&cursor=ISO_DATE
 */

export default function WalletTransaction({ token }) {
    const [transactions, setTransactions] = useState([]);
    const [nextCursor, setNextCursor] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const LIMIT = 6;


    async function fetchTransaction(cursor = null) {
        if (loading) return;

        setLoading(true);

        try {
            const params = new URLSearchParams({ limit: LIMIT })
            if (cursor) params.append("cursor", cursor);

            const AUTH_TOKEN = token || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjk2ZGUzZWY4Y2YwNzczZTY4MGE2ODg5IiwiZW1haWwiOiJjYXJvbGluZS5tYXRvMUBnbWFpbC5jb20iLCJpYXQiOjE3NjkwNzc0NjIsImV4cCI6MTc2OTE2Mzg2Mn0.fe2SAoUY-In6iyY6TU_8WLOif6e8GTVH556W5qx0BYQ"

            const res = await fetch(
                `http://localhost:3006/api/wallet/transaction?${params.toString()}`,
                {
                    headers: {
                        Authorization: `Bearer ${AUTH_TOKEN}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            const data = await res.json();
            console.log(data)

            if (data.success) {
                setTransactions(prev => [...prev, ...data.data]);
                setNextCursor(data.meta.nextCursor);
                setHasMore(Boolean(data.meta.nextCursor))
            }
        } catch (err) {
            console.error("Failed to load transactions:", err);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTransaction();
    }, [])

    return (
        <div className="w-full max-w-7xl mx-auto p-6">
            <h2 className="text-xl font-semibold mb-4">Wallet Transactions</h2>

            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Reference</th>
                            <th className="px-4 py-3">Amount</th>
                            <th className="px-4 py-3">Balance</th>
                            <th className="px-4 py-3">Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {transactions.map((tx) => (
                            <tr
                                key={tx.reference}
                                className="border-t hover:bg-gray-50"
                            >
                                <td className="px-4 py-3">
                                    {new Date(tx.date).toLocaleString()}
                                </td>

                                <td className="px-4 py-3 font-mono text-xs">
                                    {tx.reference}
                                </td>

                                <td className="px-4 py-3">
                                    ₦{tx.amount.toLocaleString()}
                                </td>

                                <td className="px-4 py-3">
                                    {tx.balance !== null
                                        ? `₦${tx.balance.toLocaleString()}`
                                        : "-"}
                                </td>

                                <td className="px-4 py-3">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium
                      ${tx.status === "successful"
                                                ? "bg-green-100 text-green-700"
                                                : tx.status === "pending"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {tx.status}
                                    </span>
                                </td>
                            </tr>
                        ))}

                        {!transactions.length && !loading && (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="text-center py-8 text-gray-500"
                                >
                                    No transactions found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Load More Button */}
            {hasMore && (
                <div className="flex justify-center mt-6">
                    <button
                        onClick={() => fetchTransaction(nextCursor)}
                        disabled={loading}
                        className="px-6 py-2 rounded-md bg-black text-white text-sm font-medium
                       hover:bg-gray-800 disabled:opacity-50"
                    >
                        {loading ? "Loading..." : "Load more"}
                    </button>
                </div>
            )}
        </div>
    );
}