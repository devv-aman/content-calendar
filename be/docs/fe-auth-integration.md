# Frontend Authentication Integration Guide

This guide explains how to integrate the frontend with the backend authentication system.

## Prerequisites

- Backend running on `http://localhost:3001`
- Frontend running on `http://localhost:5173`

## Axios Configuration

Update your axios instance to include credentials for HTTP-only cookies:

```typescript
// src/lib/axios.ts
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: true, // Required for HTTP-only cookies
});

// Response interceptor for handling token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await apiClient.post("/api/v1/auth/refresh");
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Redirect to login
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
```

## Environment Variable

Add to your `.env` file:

```
VITE_API_BASE_URL=http://localhost:3001
```

## API Endpoints

### Login

**Endpoint:** `POST /api/v1/auth/login`

**Request:**

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "admin@example.com",
    "password": "Admin@123"
  }'
```

**Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "uuid",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "deleted_at": null
  }
}
```

**Response (401):**

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**Cookies Set:**

- `access_token` - JWT access token (15 min expiry)
- `refresh_token` - JWT refresh token (7 day expiry)

---

### Get Current User

**Endpoint:** `GET /api/v1/auth/me`

**Request:**

```bash
curl -X GET http://localhost:3001/api/v1/auth/me \
  -b cookies.txt
```

**Response (200):**

```json
{
  "success": true,
  "message": "User details fetched successfully",
  "data": {
    "id": "uuid",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "deleted_at": null
  }
}
```

**Response (401):**

```json
{
  "success": false,
  "message": "Access token is required"
}
```

---

### Refresh Token

**Endpoint:** `POST /api/v1/auth/refresh`

**Request:**

```bash
curl -X POST http://localhost:3001/api/v1/auth/refresh \
  -b cookies.txt \
  -c cookies.txt
```

**Response (200):**

```json
{
  "success": true,
  "message": "Token refreshed successfully"
}
```

**Response (401):**

```json
{
  "success": false,
  "message": "Refresh token is required"
}
```

**Cookies Updated:**

- `access_token` - New JWT access token

---

### Logout

**Endpoint:** `POST /api/v1/auth/logout`

**Request:**

```bash
curl -X POST http://localhost:3001/api/v1/auth/logout \
  -b cookies.txt \
  -c cookies.txt
```

**Response (200):**

```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Cookies Cleared:**

- `access_token`
- `refresh_token`

---

## React Integration Example

```typescript
// hooks/useAuth.ts
import { useState, useEffect, useCallback } from "react";
import apiClient from "../lib/axios";

interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  created_at: string;
  updated_at: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const fetchUser = useCallback(async () => {
    try {
      const response = await apiClient.get("/api/v1/auth/me");
      setState({
        user: response.data.data,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch {
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await apiClient.post("/api/v1/auth/login", {
      email,
      password,
    });
    setState({
      user: response.data.data,
      isLoading: false,
      isAuthenticated: true,
    });
    return response.data;
  };

  const logout = async () => {
    await apiClient.post("/api/v1/auth/logout");
    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    ...state,
    login,
    logout,
    refetchUser: fetchUser,
  };
};
```

## Error Response Format

All error responses follow this format:

```typescript
interface ErrorResponse {
  success: false;
  message: string;
  error?: string; // Stack trace in development mode
}
```

## HTTP Status Codes

| Code | Description                                  |
| ---- | -------------------------------------------- |
| 200  | Success                                      |
| 400  | Bad Request                                  |
| 401  | Unauthorized (token missing/invalid/expired) |
| 403  | Forbidden (insufficient permissions)         |
| 404  | Not Found                                    |
| 422  | Validation Error                             |
| 500  | Internal Server Error                        |

## Test Credentials

| Role  | Email             | Password  |
| ----- | ----------------- | --------- |
| Admin | admin@example.com | Admin@123 |
| User  | user@example.com  | User@123  |
