import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";

import { useAuth } from "../AuthContext";
import { ROUTES } from "../../../router/routes";
import "./login.css";

const loginSchema = z.object({
    username: z.string().trim().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});

interface FieldErrors {
    username?: string;
    password?: string;
}

interface LocationState {
    from?: { pathname?: string };
}

export default function LoginPage() {
    const { isAuthenticated, login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [formError, setFormError] = useState("");

    // Already authenticated → redirect away from /login.
    if (isAuthenticated) {
        return <Navigate to={ROUTES.HOME} replace />;
    }

    const redirectTo =
        (location.state as LocationState | null)?.from?.pathname ?? ROUTES.HOME;

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setFormError("");

        const result = loginSchema.safeParse({ username, password });
        if (!result.success) {
            const flattened = result.error.flatten().fieldErrors;
            setFieldErrors({
                username: flattened.username?.[0],
                password: flattened.password?.[0],
            });
            return;
        }

        setFieldErrors({});

        const ok = login(result.data.username, result.data.password);
        if (!ok) {
            setFormError("Invalid username or password.");
            return;
        }

        navigate(redirectTo, { replace: true });
    };

    return (
        <div className="login">
            <form className="login__card" onSubmit={handleSubmit} noValidate>
                <h1 className="login__title">Sign in to CineView</h1>

                {formError && (
                    <p className="login__error" role="alert">
                        {formError}
                    </p>
                )}

                <label className="login__field">
                    <span>Username</span>
                    <input
                        type="text"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        autoComplete="username"
                    />
                    {fieldErrors.username && (
                        <span className="login__field-error">
                            {fieldErrors.username}
                        </span>
                    )}
                </label>

                <label className="login__field">
                    <span>Password</span>
                    <div className="login__password">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            className="login__toggle"
                            onClick={() => setShowPassword((prev) => !prev)}
                            aria-label={
                                showPassword ? "Hide password" : "Show password"
                            }
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                    {fieldErrors.password && (
                        <span className="login__field-error">
                            {fieldErrors.password}
                        </span>
                    )}
                </label>

                <button type="submit" className="login__submit">
                    Sign in
                </button>
            </form>
        </div>
    );
}