export default function ConfirmModal({
    open,
    onClose,
    onConfirm,
    mode
}) {
    if (!mode) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm">
                <h3 className="text-lg font-semibold mb-2">
                    Regenerate {mode.toUpperCase()} Secret Key?
                </h3>

                <p className="text-sm text-gray-600 mb-4">
                    This will immediately invalidate the old secret key.
                    Any system using it will stop working.
                </p>

                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 border rounded">
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded"
                    >
                        Regenerate
                    </button>
                </div>
            </div>
        </div>
    )
}