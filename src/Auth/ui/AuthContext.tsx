import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { AUTH_CREDENTIALS } from "../core/constants";
import {
    clearSession,
    readSession,
    writeSession,
    type Session,
} from "../data/authStorage";

interface AuthContextValue {
    isAuthenticated: boolean;
    user: Session | null;
    login: (username: string, password: string) => boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<Session | null>(() => readSession());

    const value = useMemo<AuthContextValue>(() => {
        return {
            isAuthenticated: user !== null,
            user,
            login: (username, password) => {
                const ok =
                    username === AUTH_CREDENTIALS.username &&
                    password === AUTH_CREDENTIALS.password;

                if (!ok) {
                    return false;
                }

                const session: Session = { username };
                writeSession(session);
                setUser(session);
                return true;
            },
            logout: () => {
                clearSession();
                setUser(null);
            },
        };
    }, [user]);

    return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (ctx === null) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return ctx;
}