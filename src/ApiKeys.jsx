import React, { useContext, useEffect, useRef, useState } from "react";
import { Eye, EyeOff, RefreshCw, Copy, X } from "lucide-react";
import { UserContext } from "./useContextAPI/userContextApi";
import getCurrentAdmin from "./config/api.js";
import { regenerateApiKey } from "./config/api.js";

export default function ApiKeys() {
    const { user, setUser } = useContext(UserContext);

    const [visible, setVisible] = useState({ test: false, live: false });
    const [loading, setLoading] = useState(false);
    const [confirmMode, setConfirmMode] = useState(null); 
    const [toast, setToast] = useState(null);

    const hideTimers = useRef({}); 

       // FETCH ADMIN

    useEffect(() => {
        const fetchAdmin = async () => {
            try {
               const data = await getCurrentAdmin();
                setUser(data);
            } catch (err) {
                showToast("error", err.message);
            }
        };
        fetchAdmin();
    }, []);

    /* ===============================
       HELPERS
    =============================== */
    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    };

    const copyToClipboard = async (text) => {
        await navigator.clipboard.writeText(text);
        showToast("success", "Copied to clipboard");
    };

    const toggleVisibility = (mode) => {
        setVisible((prev) => {
            const newState = !prev[mode];

            // ⏱ auto-hide after 30s
            if (newState) {
                clearTimeout(hideTimers.current[mode]);
                hideTimers.current[mode] = setTimeout(() => {
                    setVisible((v) => ({ ...v, [mode]: false }));
                }, 30000);
            }

            return { ...prev, [mode]: newState };
        });
    };

    /* ===============================
       REGENERATE SECRET KEY
    =============================== */
    const regenerateKey = async () => {
        if (!confirmMode) return;

        try {
            setLoading(true);

            const data = await regenerateApiKey(confirmMode);

            setUser((prev) => ({
                ...prev,
                apiKeys: {
                    ...prev.apiKeys,
                    [confirmMode]: {
                        ...prev.apiKeys[confirmMode],
                        secretKey: data.apiKeys.secretKey,
                        lastRotatedAt: new Date().toISOString(),
                    },
                },
            }));

            setVisible((v) => ({ ...v, [confirmMode]: true }));

            showToast(
                "success",
                "Secret regenerated. Old key is now invalid."
            );
        } catch (err) {
            showToast("error", err.message);
        } finally {
            setLoading(false);
            setConfirmMode(null);
        }
    };

    if (!user) return <div className="p-6">Loading…</div>;

    /* ===============================
       RENDER CARD
    =============================== */
    const renderCard = (mode, title, badgeClass) => {
        const key = user.apiKeys?.[mode];
        if (!key?.publicKey) return null;

        return (
            <div className="rounded-xl border p-6 bg-white shadow">
                <div className="flex justify-between mb-4">
                    <h2 className="font-semibold">{title}</h2>
                    <span className={`px-3 py-1 text-xs rounded ${badgeClass}`}>
                        {mode === "test" ? "Development" : "Production"}
                    </span>
                </div>

                {/* PUBLIC KEY */}
                <div className="mb-4">
                    <label className="text-xs text-gray-500">Public Key</label>
                    <div className="mt-1 flex items-center justify-between bg-gray-100 p-3 rounded font-mono text-sm">
                        <span className="break-all">{key.publicKey}</span>
                        <button onClick={() => copyToClipboard(key.publicKey)}>
                            <Copy size={16} />
                        </button>
                    </div>
                </div>

                {/* SECRET KEY */}
                <div className="mb-4">
                    <label className="text-xs text-gray-500">Secret Key</label>
                    <div className="mt-1 flex items-center justify-between bg-gray-100 p-3 rounded font-mono text-sm">
                        <span>
                            {visible[mode]
                                ? key.secretKey
                                : "••••••••••••••••••••••••••"}
                        </span>

                        <div className="flex gap-2">
                            {visible[mode] && (
                                <button onClick={() => copyToClipboard(key.secretKey)}>
                                    <Copy size={16} />
                                </button>
                            )}
                            <button onClick={() => toggleVisibility(mode)}>
                                {visible[mode] ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {visible[mode] && (
                        <p className="text-xs text-red-500 mt-1">
                            Auto-hides in 30 seconds
                        </p>
                    )}
                </div>

                {/* META */}
                <div className="text-xs text-gray-500 mb-4">
                    Created:{" "}
                    {key.createdAt
                        ? new Date(key.createdAt).toLocaleDateString()
                        : "-"}
                    <br />
                    Last rotated:{" "}
                    {key.lastRotatedAt
                        ? new Date(key.lastRotatedAt).toLocaleString()
                        : "-"}
                </div>

                {/* REGENERATE */}
                <button
                    onClick={() => setConfirmMode(mode)}
                    className={`flex items-center gap-2 px-4 py-2 border rounded ${mode === "live"
                        ? "border-red-500 text-red-600 hover:bg-red-50"
                        : "border-gray-400 hover:bg-gray-100"
                        }`}
                >
                    <RefreshCw size={16} />
                    Regenerate
                </button>
            </div>
        );
    };

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">API Keys</h1>

            <div className="grid md:grid-cols-2 gap-6">
                {renderCard("test", "Test API Keys", "bg-blue-100 text-blue-700")}
                {renderCard("live", "Live API Keys", "bg-green-100 text-green-700")}
            </div>

            {/* CONFIRM MODAL */}
            {confirmMode && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between mb-4">
                            <h3 className="font-semibold">
                                Regenerate {confirmMode} secret key?
                            </h3>
                            <button onClick={() => setConfirmMode(null)}>
                                <X size={18} />
                            </button>
                        </div>

                        <p className="text-sm text-gray-600 mb-6">
                            This action invalidates the old secret key immediately.
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setConfirmMode(null)}
                                className="px-4 py-2 border rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={regenerateKey}
                                disabled={loading}
                                className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
                            >
                                {loading ? "Regenerating…" : "Yes, Regenerate"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TOAST */}
            {toast && (
                <div
                    className={`fixed bottom-6 right-6 px-4 py-3 rounded text-white shadow ${toast.type === "success" ? "bg-green-600" : "bg-red-600"
                        }`}
                >
                    {toast.message}
                </div>
            )}
        </div>
    );
}
















































































// import React, { useContext, useEffect, useState } from "react";
// import { Eye, EyeOff, RefreshCw, X } from "lucide-react";
// import { UserContext } from "./useContextAPI/userContextApi";

// export default function ApiKeys() {
//     const { user, setUser } = useContext(UserContext);

//     const [visible, setVisible] = useState({ test: false, live: false });
//     const [loading, setLoading] = useState(false);
//     const [confirmMode, setConfirmMode] = useState(null); // "test" | "live" | null
//     const [toast, setToast] = useState(null); // { type, message }

//     /* ===============================
//        FETCH ADMIN (ME)
//     =============================== */
//     useEffect(() => {
//         const fetchAdmin = async () => {
//             try {
//                 const res = await fetch("http://localhost:3006/api/admin/me", {
//                     credentials: "include",
//                 });
//                 const data = await res.json();
//                 if (!res.ok) throw new Error(data.message || "Failed");
//                 setUser(data);
//             } catch (err) {
//                 showToast("error", err.message);
//             }
//         };
//         fetchAdmin();
//     }, []);

//     /* ===============================
//        HELPERS
//     =============================== */
//     const showToast = (type, message) => {
//         setToast({ type, message });
//         setTimeout(() => setToast(null), 3500);
//     };

//     const toggleVisibility = (mode) => {
//         setVisible((prev) => ({ ...prev, [mode]: !prev[mode] }));
//     };

//     /* ===============================
//        REGENERATE SECRET KEY
//     =============================== */
//     const regenerateKey = async () => {
//         if (!confirmMode) return;

//         try {
//             setLoading(true);

//             const res = await fetch(
//                 "http://localhost:3006/api/admin/keys/regenerate",
//                 {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     credentials: "include",
//                     body: JSON.stringify({ mode: confirmMode }),
//                 }
//             );

//             const data = await res.json();
//             if (!res.ok) throw new Error(data.message || "Failed");

//             // Update UI — public key stays same, secret updates
//             setUser((prev) => ({
//                 ...prev,
//                 apiKeys: {
//                     ...prev.apiKeys,
//                     [confirmMode]: {
//                         ...prev.apiKeys[confirmMode],
//                         secretKey: data.apiKeys.secretKey,
//                         lastRotatedAt: new Date().toISOString(),
//                     },
//                 },
//             }));

//             setVisible((v) => ({ ...v, [confirmMode]: true }));

//             showToast(
//                 "success",
//                 "Secret key regenerated. Old key is now invalid."
//             );
//         } catch (err) {
//             showToast("error", err.message);
//         } finally {
//             setLoading(false);
//             setConfirmMode(null);
//         }
//     };

//     if (!user) return <div className="p-6">Loading...</div>;

//     /* ===============================
//        RENDER KEY CARD
//     =============================== */
//     const renderCard = (mode, title, badgeClass) => {
//         const key = user.apiKeys?.[mode];
//         if (!key?.publicKey) return null;

//         return (
//             <div className="rounded-xl border p-6 bg-white shadow-sm">
//                 <div className="flex justify-between items-center mb-4">
//                     <h2 className="text-lg font-semibold">{title}</h2>
//                     <span className={`px-3 py-1 text-xs rounded-full ${badgeClass}`}>
//                         {mode === "test" ? "Development" : "Production"}
//                     </span>
//                 </div>

//                 {/* Public Key */}
//                 <div className="mb-4">
//                     <label className="text-sm text-gray-500">Public Key</label>
//                     <div className="mt-1 bg-gray-100 p-3 rounded font-mono text-sm break-all">
//                         {key.publicKey}
//                     </div>
//                 </div>

//                 {/* Secret Key */}
//                 <div className="mb-4">
//                     <label className="text-sm text-gray-500">Secret Key</label>
//                     <div className="mt-1 flex items-center justify-between bg-gray-100 p-3 rounded font-mono text-sm">
//                         <span>
//                             {visible[mode]
//                                 ? key.secretKey || "Not available"
//                                 : "••••••••••••••••••••••••••••"}
//                         </span>
//                         <button onClick={() => toggleVisibility(mode)}>
//                             {visible[mode] ? <EyeOff size={18} /> : <Eye size={18} />}
//                         </button>
//                     </div>
//                 </div>

//                 {/* Meta */}
//                 <div className="text-xs text-gray-500 mb-4">
//                     Created:{" "}
//                     {key.createdAt
//                         ? new Date(key.createdAt).toLocaleDateString()
//                         : "-"}
//                     <br />
//                     Last rotated:{" "}
//                     {key.lastRotatedAt
//                         ? new Date(key.lastRotatedAt).toLocaleString()
//                         : "-"}
//                 </div>

//                 {/* Regenerate */}
//                 <button
//                     onClick={() => setConfirmMode(mode)}
//                     className={`flex items-center gap-2 px-4 py-2 rounded border ${mode === "live"
//                             ? "border-red-500 text-red-600 hover:bg-red-50"
//                             : "border-gray-400 hover:bg-gray-100"
//                         }`}
//                 >
//                     <RefreshCw size={16} />
//                     Regenerate
//                 </button>
//             </div>
//         );
//     };

//     return (
//         <div className="p-6 space-y-6">
//             <h1 className="text-2xl font-bold">API Keys</h1>

//             <div className="grid md:grid-cols-2 gap-6">
//                 {renderCard("test", "Test API Keys", "bg-blue-100 text-blue-700")}
//                 {renderCard("live", "Live API Keys", "bg-green-100 text-green-700")}
//             </div>

//             {/* ===============================
//           CONFIRM MODAL
//       =============================== */}
//             {confirmMode && (
//                 <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//                     <div className="bg-white rounded-lg p-6 w-full max-w-md">
//                         <div className="flex justify-between items-center mb-4">
//                             <h3 className="text-lg font-semibold">
//                                 Regenerate {confirmMode} secret key?
//                             </h3>
//                             <button onClick={() => setConfirmMode(null)}>
//                                 <X size={18} />
//                             </button>
//                         </div>

//                         <p className="text-sm text-gray-600 mb-6">
//                             This will immediately invalidate the old secret key.
//                             Any application using the old key will stop working.
//                         </p>

//                         <div className="flex justify-end gap-3">
//                             <button
//                                 onClick={() => setConfirmMode(null)}
//                                 className="px-4 py-2 border rounded"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={regenerateKey}
//                                 disabled={loading}
//                                 className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
//                             >
//                                 {loading ? "Regenerating..." : "Yes, Regenerate"}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* ===============================
//           TOAST
//       =============================== */}
//             {toast && (
//                 <div
//                     className={`fixed bottom-6 right-6 px-4 py-3 rounded shadow-lg text-white ${toast.type === "success" ? "bg-green-600" : "bg-red-600"
//                         }`}
//                 >
//                     {toast.message}
//                 </div>
//             )}
//         </div>
//     );
// }