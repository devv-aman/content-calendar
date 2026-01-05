import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/styles/globals.css";
import App from "./App.tsx";

// Handle Google OAuth popup callback before React mounts
// This runs when the popup redirects back with the id_token
const handleOAuthCallback = () => {
  const hash = window.location.hash;

  // Check if this is an OAuth callback (has id_token or error in hash)
  if (hash && (hash.includes("id_token") || hash.includes("error"))) {
    // Only handle if this is a popup window (has opener)
    if (window.opener) {
      const params = new URLSearchParams(hash.substring(1));
      const idToken = params.get("id_token");
      const state = params.get("state");
      const error = params.get("error");

      // Send message to parent window
      window.opener.postMessage(
        {
          type: "google-auth-callback",
          credential: idToken,
          error: error,
          state: state,
        },
        window.location.origin
      );

      // Close the popup
      window.close();

      // Prevent React from rendering in the popup
      return true;
    }
  }

  return false;
};

// If this is an OAuth callback popup, don't render the app
if (!handleOAuthCallback()) {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
