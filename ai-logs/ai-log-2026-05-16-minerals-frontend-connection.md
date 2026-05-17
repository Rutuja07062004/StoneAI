# Session: Connecting Minerals Backend to Expo Frontend
**Date:** 2026-05-16
**Objective:** Wire the new MongoDB minerals REST API to the existing Expo React Native frontend.

## Architecture Decisions
- **New Service Layer (`mineralApiService.ts`):** Created a dedicated API service that wraps all 5 backend endpoints. Includes a `normalizeMineral()` function that maps the MongoDB document shape (with `_id`, `color`, `subCategory`, etc.) to the existing frontend `Mineral` type — ensuring zero breaking changes to existing UI components.
- **Category Mapping:** Added two-way mappers (`mapCategory` / `reverseMapCategory`) to translate between the backend enum values (`Igneous`) and the frontend display values (`Igneous Rocks`).
- **Hook Update (`useMinerals.ts`):** Replaced the hardcoded `MINERALS` local import with a `mineralApiService.getAllMinerals()` call using `Promise.all` to fetch minerals and favorites concurrently. Added an `error` state for graceful degradation if the backend is unreachable.
- **Favorites:** Favorites remain in `AsyncStorage` (local to device) since the task specified no backend favorites yet.

## Data Flow
```
MongoDB → Backend API → mineralApiService.ts (normalize) → useMinerals.ts → guide/index.tsx
```

## Files Created/Modified
- `src/services/mineralApiService.ts` (new)
- `src/hooks/useMinerals.ts` (updated to use API)

## No UI Changes Required
The `MineralCard`, `CategoryCarousel`, `FilterModal`, and `guide/index.tsx` screen are all unchanged — the normalization adapter handles the shape mismatch transparently.
