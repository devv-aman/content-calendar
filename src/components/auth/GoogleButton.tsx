import { useState, useCallback, useEffect, useRef } from "react";
import { AUTH_STRINGS } from "./auth.constants";

interface GoogleButtonProps {
  onCredentialResponse: (credential: string) => Promise<void>;
  disabled?: boolean;
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const REDIRECT_URI = window.location.origin;

// Generate a random state for CSRF protection
const generateState = () => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
};

export function GoogleButton({
  onCredentialResponse,
  disabled,
}: GoogleButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const popupRef = useRef<Window | null>(null);
  const stateRef = useRef<string>("");

  // Handle messages from the popup
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // Verify the message origin
      if (event.origin !== window.location.origin) {
        return;
      }

      const { type, credential, error: authError, state } = event.data || {};

      if (type !== "google-auth-callback") {
        return;
      }

      // Verify state to prevent CSRF
      if (state !== stateRef.current) {
        console.error("State mismatch - possible CSRF attack");
        return;
      }

      // Close the popup
      if (popupRef.current) {
        popupRef.current.close();
        popupRef.current = null;
      }

      if (authError) {
        setError(authError);
        setIsLoading(false);
        return;
      }

      if (credential) {
        try {
          await onCredentialResponse(credential);
        } catch {
          setError(AUTH_STRINGS.API_ERRORS.GOOGLE_SIGN_IN_FAILED);
        } finally {
          setIsLoading(false);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onCredentialResponse]);

  const handleClick = useCallback(() => {
    if (disabled || isLoading) {
      return;
    }

    if (!GOOGLE_CLIENT_ID) {
      setError("Google Client ID is not configured");
      return;
    }

    setIsLoading(true);
    setError(null);

    // Generate state for CSRF protection
    stateRef.current = generateState();

    // Build the Google OAuth2 URL for implicit flow (returns id_token directly)
    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authUrl.searchParams.set("client_id", GOOGLE_CLIENT_ID);
    authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
    authUrl.searchParams.set("response_type", "id_token");
    authUrl.searchParams.set("scope", "openid email profile");
    authUrl.searchParams.set("state", stateRef.current);
    authUrl.searchParams.set("nonce", generateState()); // Required for id_token flow
    authUrl.searchParams.set("prompt", "select_account");

    // Calculate popup position (center of screen)
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    // Open popup
    popupRef.current = window.open(
      authUrl.toString(),
      "google-auth-popup",
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );

    // Check if popup was blocked
    if (!popupRef.current) {
      setError(AUTH_STRINGS.API_ERRORS.GOOGLE_BLOCKED);
      setIsLoading(false);
      return;
    }

    // Monitor popup close
    const checkPopupClosed = setInterval(() => {
      if (popupRef.current?.closed) {
        clearInterval(checkPopupClosed);
        // Only set loading to false if we haven't received a response
        setTimeout(() => {
          if (isLoading) {
            setIsLoading(false);
          }
        }, 500);
      }
    }, 500);
  }, [disabled, isLoading]);

  const isDisabled = disabled || isLoading;

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleClick}
        disabled={isDisabled}
        className="w-full flex items-center justify-center gap-3 h-11 px-4 rounded-lg border border-(--neutral-border-main) bg-(--neutral-bg-base) text-(--neutral-text-primary) font-medium transition-all hover:bg-(--state-overlay-hover) focus:outline-none focus:ring-2 focus:ring-(--state-focus-ring) disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <svg
            className="size-5 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <svg
            className="size-5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        <span>
          {isLoading ? AUTH_STRINGS.LOADING_TEXT : AUTH_STRINGS.GOOGLE_BUTTON}
        </span>
      </button>

      {error && (
        <p className="mt-2 text-xs text-center text-(--brand-accent01-main)">
          {error}
        </p>
      )}
    </div>
  );
}
