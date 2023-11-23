"use server";
import React, { ReactNode, cache } from "react";
import { ClientProvider } from "./client.js";

export const context = cache(() => {
  const property: {
    [key: string]: {
      resolve: (value: unknown) => void;
      promise: Promise<unknown>;
    };
  } = {};

  const getMixContext = (name: string) => {
    if (!property[name]) {
      let resolve: (value: unknown) => void;
      const promise = new Promise<unknown>((r) => (resolve = r));
      property[name] = {
        resolve: resolve!,
        promise,
      };
    }
    return property[name];
  };

  return {
    set: <T,>(name: string, value: unknown) =>
      getMixContext(name).resolve(value as T),
    get: <T,>(name: string) => getMixContext(name).promise as Promise<T>,
  };
});

export const createMixContext = <T,>(name: string = "") => {
  const Provider = ({ children, value }: { children: ReactNode; value: T }) => {
    context().set(name, value);
    return (
      <ClientProvider name={name} value={value as never}>
        {children}
      </ClientProvider>
    );
  };
  return { Provider, get: () => context().get(name) };
};

export const getMixContext = <T,>(name: string = "") => context().get<T>(name);
