/**
 * An array of routes that are accessible the public
 * There routes do not require authentication
 * @type {string[]}
 */

export const publicRoutes = [
    "/",
    "/auth/new-verification",
    "/auth/new-password"
]

/**
 * An array of routes that are used  for authentication
 * There routes will redirect logged in users to /settings
 * @type {string[]}
 */

export const authRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/reset",
    "/auth/error"

]

/**
 * Prefix for the authentication routes
 * Route that start with this prefix are used for API
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth"

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/settings"