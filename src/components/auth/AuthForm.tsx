import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { GoogleButton } from "./GoogleButton";
import { AUTH_STRINGS } from "./auth.constants";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import type { AxiosError } from "axios";

type AuthMode = "login" | "register";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  api?: string;
}

const initialFormData: FormData = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const isLogin = mode === "login";

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!isLogin && !formData.name.trim()) {
      newErrors.name = AUTH_STRINGS.ERRORS.NAME_REQUIRED;
    }

    if (!formData.email.trim()) {
      newErrors.email = AUTH_STRINGS.ERRORS.EMAIL_REQUIRED;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = AUTH_STRINGS.ERRORS.EMAIL_INVALID;
    }

    if (!formData.password) {
      newErrors.password = AUTH_STRINGS.ERRORS.PASSWORD_REQUIRED;
    } else if (formData.password.length < 8) {
      newErrors.password = AUTH_STRINGS.ERRORS.PASSWORD_MIN_LENGTH;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = AUTH_STRINGS.ERRORS.PASSWORDS_NOT_MATCH;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      if (isLogin) {
        await login({
          email: formData.email,
          password: formData.password,
        });
      } else {
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
      }
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const message =
        axiosError.response?.data?.message || AUTH_STRINGS.API_ERRORS.GENERIC;
      setErrors({ api: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field error on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "register" : "login"));
    setFormData(initialFormData);
    setErrors({});
  };

  const handleGoogleCredential = async (credential: string) => {
    setErrors({});
    try {
      await googleLogin(credential);
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const message =
        axiosError.response?.data?.message ||
        AUTH_STRINGS.API_ERRORS.GOOGLE_SIGN_IN_FAILED;
      setErrors({ api: message });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-2xl bg-(--neutral-bg-surface) border border-(--neutral-border-main) shadow-lg">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-(--neutral-text-primary) mb-2">
          {isLogin ? AUTH_STRINGS.LOGIN_TITLE : AUTH_STRINGS.REGISTER_TITLE}
        </h1>
        <p className="text-sm text-(--neutral-text-secondary)">
          {isLogin
            ? AUTH_STRINGS.LOGIN_SUBTITLE
            : AUTH_STRINGS.REGISTER_SUBTITLE}
        </p>
      </div>

      {/* Google Sign In */}
      <GoogleButton
        onCredentialResponse={handleGoogleCredential}
        disabled={isSubmitting}
      />

      {/* Divider */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-(--neutral-border-main)" />
        <span className="text-sm text-(--neutral-text-disabled)">
          {AUTH_STRINGS.OR_DIVIDER}
        </span>
        <div className="flex-1 h-px bg-(--neutral-border-main)" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* API Error */}
        {errors.api && (
          <div className="p-3 rounded-lg bg-(--brand-accent01-opacity-12) border border-(--brand-accent01-main) text-sm text-(--brand-accent01-main)">
            {errors.api}
          </div>
        )}

        {/* Name field (Register only) */}
        {!isLogin && (
          <div className="space-y-1.5">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-(--neutral-text-primary)"
            >
              {AUTH_STRINGS.NAME_LABEL}
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder={AUTH_STRINGS.NAME_PLACEHOLDER}
              className={cn(
                "w-full h-11 px-4 rounded-lg border bg-(--neutral-bg-base) text-(--neutral-text-primary) placeholder:text-(--neutral-text-disabled) transition-all focus:outline-none focus:ring-2 focus:ring-(--state-focus-ring)",
                errors.name
                  ? "border-(--brand-accent01-main)"
                  : "border-(--neutral-border-main)"
              )}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-xs text-(--brand-accent01-main)">
                {errors.name}
              </p>
            )}
          </div>
        )}

        {/* Email field */}
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-(--neutral-text-primary)"
          >
            {AUTH_STRINGS.EMAIL_LABEL}
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder={AUTH_STRINGS.EMAIL_PLACEHOLDER}
            className={cn(
              "w-full h-11 px-4 rounded-lg border bg-(--neutral-bg-base) text-(--neutral-text-primary) placeholder:text-(--neutral-text-disabled) transition-all focus:outline-none focus:ring-2 focus:ring-(--state-focus-ring)",
              errors.email
                ? "border-(--brand-accent01-main)"
                : "border-(--neutral-border-main)"
            )}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-xs text-(--brand-accent01-main)">
              {errors.email}
            </p>
          )}
        </div>

        {/* Password field */}
        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-(--neutral-text-primary)"
          >
            {AUTH_STRINGS.PASSWORD_LABEL}
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            placeholder={AUTH_STRINGS.PASSWORD_PLACEHOLDER}
            className={cn(
              "w-full h-11 px-4 rounded-lg border bg-(--neutral-bg-base) text-(--neutral-text-primary) placeholder:text-(--neutral-text-disabled) transition-all focus:outline-none focus:ring-2 focus:ring-(--state-focus-ring)",
              errors.password
                ? "border-(--brand-accent01-main)"
                : "border-(--neutral-border-main)"
            )}
            disabled={isSubmitting}
          />
          {errors.password && (
            <p className="text-xs text-(--brand-accent01-main)">
              {errors.password}
            </p>
          )}
        </div>

        {/* Confirm Password field (Register only) */}
        {!isLogin && (
          <div className="space-y-1.5">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-(--neutral-text-primary)"
            >
              {AUTH_STRINGS.CONFIRM_PASSWORD_LABEL}
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) =>
                handleInputChange("confirmPassword", e.target.value)
              }
              placeholder={AUTH_STRINGS.CONFIRM_PASSWORD_PLACEHOLDER}
              className={cn(
                "w-full h-11 px-4 rounded-lg border bg-(--neutral-bg-base) text-(--neutral-text-primary) placeholder:text-(--neutral-text-disabled) transition-all focus:outline-none focus:ring-2 focus:ring-(--state-focus-ring)",
                errors.confirmPassword
                  ? "border-(--brand-accent01-main)"
                  : "border-(--neutral-border-main)"
              )}
              disabled={isSubmitting}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-(--brand-accent01-main)">
                {errors.confirmPassword}
              </p>
            )}
          </div>
        )}

        {/* Submit Button */}
        <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
          {isSubmitting
            ? AUTH_STRINGS.LOADING_TEXT
            : isLogin
            ? AUTH_STRINGS.LOGIN_BUTTON
            : AUTH_STRINGS.REGISTER_BUTTON}
        </Button>
      </form>

      {/* Mode Toggle */}
      <p className="mt-6 text-center text-sm text-(--neutral-text-secondary)">
        {isLogin ? AUTH_STRINGS.NO_ACCOUNT : AUTH_STRINGS.HAS_ACCOUNT}{" "}
        <button
          type="button"
          onClick={toggleMode}
          className="font-medium text-(--brand-primary-main) hover:underline focus:outline-none"
        >
          {isLogin ? AUTH_STRINGS.SIGN_UP_LINK : AUTH_STRINGS.SIGN_IN_LINK}
        </button>
      </p>
    </div>
  );
}
