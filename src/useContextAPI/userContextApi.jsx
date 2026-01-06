import React, { createContext, useContext, useEffect, useState } from "react";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    // FETCH CURRENT ADMIN
    useEffect(()=>{
        const fetchMe = async () => {
            try {
                setLoading(true);
    
                const res = await fetch("http://localhost:3006/api/admin/me", {
                    credentials: "include",
                });
    
                if (!res.ok) {
                    setUser(null);
                    return;
                }
    
                const data = await res.json();
                setUser(data);
            } catch (err) {
                console.error("Fetch user error:", err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchMe();

    }, [])
 


    const login = async (email, password) => {
        const res = await fetch("http://localhost:3006/api/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message || "Login failed");
        }

        setUser(data.admin);
        return data;
    };

 
    const logout = async () => {
        await fetch("http://localhost:3006/api/admin/logout", {
            method: "POST",
            credentials: "include",
        });

        setUser(null);
    };


    return (
        <UserContext.Provider
            value={{
                user,
                setUser,
                loading,
                login,
                logout,
                refreshUser: fetchMe,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
