# next-approuter-context

Server component of Next.js' AppRouter, which provides a ContextAPI-like mechanism.

Context instances are created for each component tree.
Contexts cannot be retrieved from ServerActions functions.

Normally `page.tsx` -> `layout.tsx` is executed in this order, but with this library `layout.tsx` -> `page.tsx` will be executed in this order.

# Sample

- GitHub  
   https://github.com/SoraKumo001/next-approuter-context-test
- Vercel  
  https://next-approuter-context-test.vercel.app/

## app/context.tsx

Name the context so that it can be identified when retrieving data

```tsx
import { createMixContext } from "next-approuter-context";

export type ContextType1 = { text: string; color: string };
export const context1 = createMixContext<ContextType1>("context1");

export type ContextType2 = number;
export const context2 = createMixContext<ContextType2>("context2");
```

## app/layout.tsx

Set data in Provider

```tsx
import { context1, context2 } from "./context";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <context1.Provider
          value={{ text: "Send colors and text from Layout", color: "red" }}
        >
          <context2.Provider value={123456}>{children}</context2.Provider>
        </context1.Provider>
      </body>
    </html>
  );
}
```

## app/page.tsx

Place Server/Client components

```tsx
import { Client } from "./client";
import { Server } from "./server";

const Page = () => {
  return (
    <>
      <Server />
      <Client />
    </>
  );
};

export default Page;
```

## app/server.tsx

Server component handles retrieving values from context

```tsx
"use server";

import { getMixContext, useMixContext } from "next-approuter-context";
import type { ContextType1, ContextType2 } from "./context";

export const Server = () => {
  // If the component is async, it should be written as follows
  // const { text, color } = await getMixContext<ContextType1>();
  const { text, color } = useMixContext<ContextType1>("context1");
  const value = useMixContext<ContextType2>("context2");
  return (
    <>
      <div style={{ color }}>
        Server: {text} - {value}
      </div>
    </>
  );
};
```

## app/client.tsx

Client component handles retrieving values from context

```tsx
"use client";

import { useMixContext } from "next-approuter-context";
import type { ContextType1, ContextType2 } from "./context";

export const Client = () => {
  const { text, color } = useMixContext<ContextType1>("context1");
  const value = useMixContext<ContextType2>("context2");
  return (
    <>
      <div style={{ color }}>
        Client: {text} - {value}
      </div>
    </>
  );
};
```
