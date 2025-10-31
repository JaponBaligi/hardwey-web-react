// Example integration: mount AdminApp at /dfaqs without touching public routes.
// Import this file from your router setup (e.g., in App.tsx or main router file).
import { lazy } from 'react';
export const AdminApp = lazy(() => import('./AdminApp'));

// In your router configuration, add something like:
// <Route path="/dfaqs" element={<AdminApp />} />

export default null as any;


