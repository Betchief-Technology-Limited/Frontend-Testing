import React, { useState, useEffect } from "react";
import { useUser } from "../../useContextAPI/userContextApi";
import { useNavigate } from "react-router-dom"

export default function StepCompleted() {
    const { user } = useUser();
    const navigate = useNavigate();
   const email = user.email;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 text-center">

                {/* Icon */}
                <div className="relative flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center">
                        <svg
                            className="w-10 h-10 text-white"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    Onboarding Completed
                </h2>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-6">
                    Your account is currently being verified, this takes within{" "}
                    <span className="font-medium text-gray-900">24hrs – 48hrs</span>.
                    You’ll be notified once it’s completed.
                </p>

                {/* Info box */}
                <div className="border rounded-lg p-4 bg-gray-50">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                        Accessing your account
                    </p>
                    <p className="text-sm text-gray-600">
                        From now on you will use{" "}
                        <span className="font-medium text-gray-900">
                            {email}
                        </span>{" "}
                        to access your account
                    </p>
                </div>

                {/* Progress bar */}
                <div className="mt-6">
                    <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full w-1/4 bg-gray-900 rounded-full"></div>
                    </div>
                </div>
                <button onClick={()=>navigate('/api-keys')} className="mt-5 bg-green-500 p-3 text-sm text-white">Click here to continue</button>
            </div>
        </div>
    );
}