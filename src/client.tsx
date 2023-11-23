"use client";
import { ReactNode, Suspense, createContext, useContext } from "react";

export const clientContext = createContext<{ [key: string]: unknown }>(
  undefined as never
);

export const ClientProvider = ({
  name,
  value,
  children,
}: {
  name: string;
  value: unknown;
  children: ReactNode;
}) => {
  const parentContext = useContext(clientContext);
  const newValue = { ...parentContext, [name]: value };
  return (
    <clientContext.Provider value={newValue}>
      <Suspense>{children}</Suspense>
    </clientContext.Provider>
  );
};

export const useClientContext = <T,>(name: string = "") => {
  const context = useContext(clientContext);
  return context[name] as T;
};
