# next-server-context

Server component of Next.js' AppRouter, which provides a ContextAPI-like mechanism.

Context instances are created for each component tree.
Contexts cannot be retrieved from ServerActions functions.

Normally `page.tsx` -> `layout.tsx` is executed in this order, but with this library `layout.tsx` -> `page.tsx` will be executed in this order.

- app/context.tsx

```tsx
import { createContext } from "next-server-context";

export const context = createContext<{ text: string; color: string }>();
```

- app/layout.tsx

```tsx
import React from "react";
import { context } from "context";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Without using Provider, values can also be set in the following ways
  // context().set(VALUE)

  return (
    <html lang="en">
      <body>
        <context.Provider
          value={{ text: "Send colors and text from Layout", color: "red" }}
        >
          {children}
        </context.Provider>
      </body>
    </html>
  );
}
```

- app/pages.tsx

```tsx
import { context } from "context";
import { useContext } from "next-server-context";

const Page = () => {
  const { text, color } = useContext(context);
  // If the component is async, it should be written as follows
  // const { text, color } = async getContext(context);
  return <div style={{ color }}>Page: {text}</div>;
};

export default Page;
```
