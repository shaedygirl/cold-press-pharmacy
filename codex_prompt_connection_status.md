# Codex Prompt – Add Connection Status Logic to Turmeric Page

## Goal
Implement the **connection status check** feature from the `turmeric-demo3.html` file into the current **Next.js/React** Turmeric page (`page.tsx`).

## Context
- The existing `turmeric-demo3.html` demo contains JavaScript logic that tests network connectivity and displays a connection status indicator within the UI.
- The production app uses **Next.js 15**, **React**, **TailwindCSS**, and the app router.
- `page.tsx` is the current Turmeric page located in:
  ```
  /app/pharm-tech/turmeric/page.tsx
  ```
- This page already manages the search UI, overlay activation, and keyboard events.

## Requirements
1. **Connection Indicator**
   - Add a small, visible component to indicate current connection status (e.g., “Connected” / “Offline”).
   - The component should:
     - Check connectivity on page load.
     - Periodically recheck (every X seconds).
     - Update reactively if the connection changes.

2. **Placement**
   - Match the positioning and behavior demonstrated in the `turmeric-demo3.html` demo.
   - Likely near the top-right corner of the overlay or inside the header section of the Turmeric interface.

3. **Implementation**
   - Create a reusable React component named `ConnectionStatus.tsx` inside:
     ```
     /components/turmeric/common/ConnectionStatus.tsx
     ```
   - Use `useEffect` + `useState` hooks to:
     - Perform an initial `fetch` or `navigator.onLine` check.
     - Subscribe to `online`/`offline` window events for real-time updates.
   - TailwindCSS for styling (green for online, red/gray for offline).

4. **Integration**
   - Import and render `<ConnectionStatus />` inside `page.tsx` so it appears whenever the Turmeric page loads.
   - Ensure the logic remains **client-side only** to avoid Next.js server build errors.

5. **Testing**
   - Test by disabling/enabling network in the browser dev tools to confirm visual updates.
   - Confirm no hydration or SSR issues in Next.js.

## Example Starting Snippet (React)
```tsx
"use client";
import { useState, useEffect } from "react";

export default function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const updateStatus = () => setIsOnline(navigator.onLine);
    updateStatus();
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);
    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  return (
    <div
      className={`fixed top-4 right-4 px-3 py-1 rounded text-white text-sm ${isOnline ? "bg-green-600" : "bg-red-600"}`}
    >
      {isOnline ? "Connected" : "Offline"}
    </div>
  );
}
```

## Prompt to Codex
> Implement a `ConnectionStatus` component for the Turmeric Next.js page based on the HTML demo’s connection logic.  
> - Use React hooks (`useState`, `useEffect`) to check `navigator.onLine`.  
> - Add event listeners for `online` and `offline`.  
> - Style with TailwindCSS.  
> - Place the component at the top-right of the Turmeric page (`page.tsx`).  
> - Verify correct behavior in dev mode when toggling network status.

---

**Save this file as** `codex_prompt_connection_status.md` and provide it to Codex to guide the implementation.
