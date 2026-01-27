import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import VerificationAnalytics from "./VerificationAnalytics";
import VerificationSummaryCards from "./VerificationSummaryCards";
/* -----------------------------
   Debounce Hook
------------------------------ */
function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

/* -----------------------------
   Wallet Transactions
------------------------------ */
export default function WalletTransaction({ token }) {
  const [transactions, setTransactions] = useState([]);

  // filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [dateRange, setDateRange] = useState({ from: null, to: null });

  // pagination
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [nextCursor, setNextCursor] = useState(null);
  const [cursorStack, setCursorStack] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);

  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebounce(search);

  /* -----------------------------
     Fetch Page
  ------------------------------ */
  async function fetchPage(cursor = null, direction = "init") {
    if (loading) return;
    setLoading(true);

    try {
      const params = new URLSearchParams({ limit: rowsPerPage });

      if (debouncedSearch) params.append("search", debouncedSearch);
      if (status) params.append("status", status);

      if (dateRange.from)
        params.append("startDate", dateRange.from.toISOString());
      if (dateRange.to)
        params.append("endDate", dateRange.to.toISOString());

      if (cursor) params.append("cursor", cursor);

      const AUTH_TOKEN = token || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjk3MzM3ZGQ2YzMwODZjOTgwZWFkODYxIiwiZW1haWwiOiJzdXNhbi5laGlzLWFrb2xvckBiZXRjaGllZi5uZyIsImlhdCI6MTc2OTU1MTM0OSwiZXhwIjoxNzY5NjM3NzQ5fQ.eRH7zSh0jQaOS3drga6mnIVfrr1eyK7Y5kNOQbyQTkM"

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

      if (data.success) {
        setTransactions(data.data);
        setNextCursor(data.meta.nextCursor);
      }

      if (direction === "next" && cursor) {
        setCursorStack(prev => [...prev, cursor]);
        setPageIndex(p => p + 1);
      }

      if (direction === "prev") {
        setPageIndex(p => Math.max(p - 1, 0));
      }
    } catch (err) {
      console.error("Failed to load transactions", err);
    } finally {
      setLoading(false);
    }
  }

  /* -----------------------------
     Auto Fetch on Filters
  ------------------------------ */
  useEffect(() => {
    setCursorStack([]);
    setPageIndex(0);
    fetchPage();
  }, [
    debouncedSearch,
    status,
    dateRange.from,
    dateRange.to,
    rowsPerPage
  ]);

  const start = pageIndex * rowsPerPage + 1;
  const end = start + transactions.length - 1;

  /* -----------------------------
     UI
  ------------------------------ */
  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <h2 className="text-xl font-semibold">Wallet Transactions</h2>

      {/* ---------------- Filters ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <input
          type="text"
          placeholder="Search reference..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded px-3 py-2"
        />

        {/* Status */}
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">All Status</option>
          <option value="successful">Successful</option>
          <option value="failed">Failed</option>
          <option value="pending">Pending</option>
        </select>

        {/* Date Range */}
        <div className="md:col-span-2 border rounded p-2">
          <DayPicker
            mode="range"
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={2}
          />
        </div>
      </div>

      {/* ---------------- Table ---------------- */}
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
            {transactions.map(tx => (
              <tr key={tx.reference} className="border-t">
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
                    className={`px-2 py-1 rounded-full text-xs
                      ${
                        tx.status === "successful"
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
                <td colSpan="5" className="text-center py-8 text-gray-500">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ---------------- Pagination ---------------- */}
      <div className="flex items-center justify-between text-sm">
        {/* Rows per page */}
        <div className="flex items-center gap-2">
          <span>Rows per page</span>
          <select
            value={rowsPerPage}
            onChange={e => setRowsPerPage(Number(e.target.value))}
            className="border rounded px-2 py-1"
          >
            {[5, 10, 15, 20].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        {/* Page info */}
        <div>
          {transactions.length ? `${start}–${end}` : "0–0"}
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <button
            disabled={pageIndex === 0}
            onClick={() => {
              const prev = cursorStack[cursorStack.length - 1];
              setCursorStack(s => s.slice(0, -1));
              fetchPage(prev, "prev");
            }}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            ‹
          </button>

          <button
            disabled={!nextCursor}
            onClick={() => fetchPage(nextCursor, "next")}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            ›
          </button>
        </div>
      </div>

      <VerificationAnalytics />
      <VerificationSummaryCards />
    </div>
  );
}






















































































































































































































// import { useEffect, useState } from "react";
// import { DayPicker } from "react-day-picker";

// import "react-day-picker/dist/style.css"
// /**
//  * Wallet Transactions Table (Cursor Pagination)
//  * Backend: GET /wallet/transactions?limit=50&cursor=ISO_DATE
//  */

// export default function WalletTransaction({ token }) {
//     const [transactions, setTransactions] = useState([]);

//     const [rowsPerPage, setRowsPerPage] = useState(5);
//     const [nextCursor, setNextCursor] = useState(null);
//     const [cursorStack, setCursorStack] = useState([]);
//     const [pageIndex, setPageIndex] = useState(0);

    

//     const [loading, setLoading] = useState(false);
//     // const [hasMore, setHasMore] = useState(true);

//     // const LIMIT = 6;


//     async function fetchPage(cursor = null, direction = 'init') {
//         if (loading) return;

//         setLoading(true);

//         try {
//             const params = new URLSearchParams({
//                 limit: rowsPerPage,
//             })
//             if (cursor) params.append("cursor", cursor);

//             const AUTH_TOKEN = token || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjk2ZGUzZWY4Y2YwNzczZTY4MGE2ODg5IiwiZW1haWwiOiJjYXJvbGluZS5tYXRvMUBnbWFpbC5jb20iLCJpYXQiOjE3Njk1MDIwOTQsImV4cCI6MTc2OTU4ODQ5NH0.oVJlrM9rvw_ndyvrqzuzC_onbpV7fKEx625gzm4yfAE"

//             const res = await fetch(
//                 `http://localhost:3006/api/wallet/transaction?${params.toString()}`,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${AUTH_TOKEN}`,
//                         "Content-Type": "application/json"
//                     }
//                 }
//             );

//             const data = await res.json();
//             console.log(data)

//             if (data.success) {
//                 setTransactions(data.data);
//                 setNextCursor(data.meta.nextCursor);
//                 // setHasMore(Boolean(data.meta.nextCursor))
//             }

//             if (direction === 'next' && cursor) {
//                 setCursorStack(prev => [...prev, cursor]);
//                 setPageIndex(p => p + 1)
//             }

//             if (direction === 'prev') {
//                 setPageIndex(p => Math.max(p - 1, 0))
//             }
//         } catch (err) {
//             console.error("Failed to load transactions:", err);
//         } finally {
//             setLoading(false)
//         }
//     }

//     useEffect(() => {
//         fetchPage();
//     }, []);

//     // Rows-per-page change
//     useEffect(() => {
//         setCursorStack([]);
//         setPageIndex(0);
//         fetchPage();
//     }, [rowsPerPage]);

//     const start = pageIndex * rowsPerPage + 1;
//     const end = start + transactions.length - 1;


//     return (
//         <div className="w-full max-w-7xl mx-auto p-6">
//             <h2 className="text-xl font-semibold mb-4">Wallet Transactions</h2>

//             <div className="overflow-x-auto bg-white rounded-lg shadow">
//                 <table className="min-w-full text-sm text-left">
//                     <thead className="bg-gray-100 text-gray-700">
//                         <tr>
//                             <th className="px-4 py-3">Date</th>
//                             <th className="px-4 py-3">Reference</th>
//                             <th className="px-4 py-3">Amount</th>
//                             <th className="px-4 py-3">Balance</th>
//                             <th className="px-4 py-3">Status</th>
//                         </tr>
//                     </thead>

//                     <tbody>
//                         {transactions.map(tx => (
//                             <tr key={tx.reference} className="border-t hover:bg-gray-50">
//                                 <td className="px-4 py-3">
//                                     {new Date(tx.date).toLocaleString()}
//                                 </td>
//                                 <td className="px-4 py-3 font-mono text-xs">
//                                     {tx.reference}
//                                 </td>
//                                 <td className="px-4 py-3">
//                                     ₦{tx.amount.toLocaleString()}
//                                 </td>
//                                 <td className="px-4 py-3">
//                                     {tx.balance !== null
//                                         ? `₦${tx.balance.toLocaleString()}`
//                                         : "-"}
//                                 </td>
//                                 <td className="px-4 py-3">
//                                     <span
//                                         className={`px-2 py-1 rounded-full text-xs font-medium
//                       ${tx.status === "successful"
//                                                 ? "bg-green-100 text-green-700"
//                                                 : tx.status === "pending"
//                                                     ? "bg-yellow-100 text-yellow-700"
//                                                     : "bg-red-100 text-red-700"
//                                             }`}
//                                     >
//                                         {tx.status}
//                                     </span>
//                                 </td>
//                             </tr>
//                         ))}

//                         {!transactions.length && !loading && (
//                             <tr>
//                                 <td colSpan="5" className="text-center py-8 text-gray-500">
//                                     No transactions found
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Pagination Footer */}
//             <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
//                 {/* Rows per page */}
//                 <div className="flex items-center gap-2">
//                     <span>Rows per page:</span>
//                     <select
//                         value={rowsPerPage}
//                         onChange={e => setRowsPerPage(Number(e.target.value))}
//                         className="border rounded px-2 py-1"
//                     >
//                         {[5, 10, 15, 20].map(n => (
//                             <option key={n} value={n}>{n}</option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* Page info */}
//                 <div>
//                     {transactions.length
//                         ? `${start}–${end}`
//                         : "0–0"}
//                 </div>

//                 {/* Prev / Next */}
//                 <div className="flex gap-2">
//                     <button
//                         disabled={pageIndex === 0}
//                         onClick={() => {
//                             const prevCursor =
//                                 cursorStack[cursorStack.length - 1];
//                             setCursorStack(stack => stack.slice(0, -1));
//                             fetchPage(prevCursor, "prev");
//                         }}
//                         className="px-2 py-1 rounded border disabled:opacity-40"
//                     >
//                         ‹
//                     </button>

//                     <button
//                         disabled={!nextCursor}
//                         onClick={() => fetchPage(nextCursor, "next")}
//                         className="px-2 py-1 rounded border disabled:opacity-40"
//                     >
//                         ›
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }