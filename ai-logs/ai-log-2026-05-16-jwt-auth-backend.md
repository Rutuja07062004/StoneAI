# Session: JWT Authentication Backend Implementation
**Date:** 2026-05-16
**Objective:** Implement a secure, production-ready JWT Authentication backend system for StoneAI.

## Architecture Decisions
- **User Model:** Created `User.js` using Mongoose with a pre-save hook to hash passwords using `bcryptjs`. Included unique email and required name/password fields with timestamps.
- **Token Generation:** Created utility `generateToken.js` using `jsonwebtoken` to sign standard JWTs containing the user's `_id`. Tokens are configured to expire in 7 days.
- **Auth Controller:** Developed `authController.js` to handle `/register`, `/login`, and a protected `/profile` endpoint. Handles validation, duplicate emails, and incorrect credentials securely.
- **Middleware:** Implemented `authMiddleware.js` using a Bearer token strategy to protect routes and attach the decoded user object to the request. Checks for expiration and validity.
- **Routing:** Built `authRoutes.js` and mounted it to the Express app via `app.use('/api/auth', ...)`.
- **Security:** Hashed passwords are never returned in responses. Used status codes 200, 201, 400, 401, 500 appropriately. Standardized success and error JSON response structures.

## Files Created/Modified
- `backend/src/models/User.js`
- `backend/src/utils/generateToken.js`
- `backend/src/controllers/authController.js`
- `backend/src/routes/authRoutes.js`
- `backend/src/middleware/authMiddleware.js`
- `backend/src/app.js` (uncommented route mounting)
