# Codex Prompt – Add Shimmer Effect to Turmeric Page

## Goal
Implement the **loading shimmer effect** from the `turmeric-demo3.html` prototype into the Next.js Turmeric page (`page.tsx`) within the Cold Press Pharmacy project.

## Context
- Framework: **Next.js 15**, **React**, **Tailwind CSS**, **shadcn/ui**
- Existing files:
  - `app/pharm-tech/turmeric/page.tsx`
  - `components/turmeric/...`
  - `styles/turmeric.css` (contains shimmer keyframes and utility classes)
- The demo (`turmeric-demo3.html`) shows a shimmer skeleton while data is loading.

## Tasks for Codex
1. **Analyze Demo**
   - Extract the shimmer CSS rules (`@keyframes shimmer`, `.shimmer`, `.shimmer-wrapper`) from `turmeric-demo3.html` and confirm they are present or port them into `styles/turmeric.css`.
   - If they already exist, verify Tailwind integration (e.g. `@layer utilities` if needed).

2. **Update React Page**
   - In `page.tsx`, wrap the search results list in a **loading state container**.
   - Show the shimmer placeholder(s) when:
     - the search is actively querying (`loading === true`) **or**
     - initial page load if we want a pre-fetch skeleton.

   - Hide shimmer and display results once the API call resolves.

3. **Implementation Details**
   - Create a `LoadingShimmer` component if you prefer modularity.
   - Ensure accessibility (add `aria-busy` where appropriate).
   - Tailwind example for shimmer:
     ```tsx
     <div className="shimmer h-6 w-full rounded-md bg-gray-300"></div>
     ```
   - Use CSS animation from `turmeric.css` for the shimmer gradient.

4. **Integration**
   - Import `turmeric.css` in `app/layout.tsx` or in the component if not already imported.
   - Ensure Next.js supports the global CSS (update `globals.css` if needed).

## Acceptance Criteria
- When the search runs, placeholder blocks **animate** with the shimmer gradient until results load.
- No layout shift or flicker when switching between shimmer and loaded content.
- Works on both desktop and mobile breakpoints.

---

### Example Component Stub
```tsx
import React from 'react';

export default function LoadingShimmer() {
  return (
    <div className="shimmer-wrapper space-y-2">
      <div className="shimmer h-6 w-3/4 rounded-md bg-gray-300"></div>
      <div className="shimmer h-6 w-1/2 rounded-md bg-gray-300"></div>
    </div>
  );
}
```
