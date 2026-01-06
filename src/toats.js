import { useState } from "react";

export function useToast() {
    const [toast, setToast] = useState(null);

    function showToast(message) {
        setToast(message)
        setTimeout(
            () => {
                setToast(null)
            }, 2000
        )
    }

    function Toast(){
        toast ? (
            <div className="fixed bottom-5 right-5 bg-black text-white px-4 py-2 rounded shadow">
                {toast}
            </div>
        ): null
    }

    return { showToast, Toast }
}