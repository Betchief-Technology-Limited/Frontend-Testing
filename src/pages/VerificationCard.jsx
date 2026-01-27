export default function VerificationStatCard({
    title,
    value,
    icon,
    iconBg,
    footer
}) {
    return (
        <div className="bg-white rounded-xl border p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
                <p className="text-sm text-gray-500">{title}</p>
                <div className={`p-3 rounded-lg ${iconBg}`}>
                    {icon}
                </div>
            </div>

            <p className="text-4xl font-bold text-gray-900 mt-4">
                {value}
            </p>

            {footer && (
                <div className="mt-4 text-sm text-gray-500">
                    {footer}
                </div>
            )}
        </div>
    );
}
