const BASEURL = "http://localhost:3006/api/admin"

// To get logged in admin
export default async function getCurrentAdmin() {
    const res = await fetch(`${BASEURL}/me`, {
        credentials: "include"
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch admin");
    return data;
}

// To get sign up admin
export async function signUpAdmin(payload) {
    const res = await fetch(`${BASEURL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Sign up failed");
    return data
}

// This is to login admin
export async function loginAdmin(payload) {
    const res = await fetch(`${BASEURL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to login");
    return data
}

// To logout admin
export async function logOutAdmin() {
    const res = await fetch(`${BASEURL}/logout`, {
        method: "POST",
        credentials: "include"
    });

    return res.json();
}

// Generate API kayes
export async function regenerateApiKey(mode) {
    const res = await fetch(`${BASEURL}/keys/regenerate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ mode })
    });

    const data = await res.json();
    if(!res.ok) throw new Error(data.message || "Key regeneration failed");
    return data;
}

// Resend email verification link to the provider email address
export async function emailVerification(payload) {
    const res = await fetch(`${BASEURL}/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    if(!res.ok) throw new Error(data.message || "Link not sent");
    return data;
}