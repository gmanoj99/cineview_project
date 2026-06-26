import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { useAuth } from "../AuthContext";
import { ROUTES } from "../../../router/routes";
import "./login.css";

const loginSchema = z.object({
    username: z.string().trim().min(1, "auth:errors.usernameRequired"),
    password: z.string().min(1, "auth:errors.passwordRequired"),
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
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [formError, setFormError] = useState("");

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
            setFormError(t("auth:invalidCredentials"));
            return;
        }

        navigate(redirectTo, { replace: true });
    };

    return (
        <div className="login">
            <form className="login__card" onSubmit={handleSubmit} noValidate>
                <h1 className="login__title">{t("auth:title")}</h1>

                {formError && (
                    <p className="login__error" role="alert">
                        {formError}
                    </p>
                )}

                <label className="login__field">
                    <span>{t("auth:username")}</span>
                    <input
                        type="text"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        autoComplete="username"
                    />
                    {fieldErrors.username && (
                        <span className="login__field-error">
                            {t(fieldErrors.username)}
                        </span>
                    )}
                </label>

                <label className="login__field">
                    <span>{t("auth:password")}</span>
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
                                showPassword
                                    ? t("auth:hidePassword")
                                    : t("auth:showPassword")
                            }
                        >
                            {showPassword ? t("auth:hide") : t("auth:show")}
                        </button>
                    </div>
                    {fieldErrors.password && (
                        <span className="login__field-error">
                            {t(fieldErrors.password)}
                        </span>
                    )}
                </label>

                <button type="submit" className="login__submit">
                    {t("auth:submit")}
                </button>
            </form>
        </div>
    );
}