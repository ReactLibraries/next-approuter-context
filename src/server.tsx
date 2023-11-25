"use server";
import { ReactNode, cache } from "react";
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

export const createMixServerContext = <T,>(name: string = "") => {
  const Provider = ({ children, value }: { children: ReactNode; value: T }) => {
    context().set(name, value);
    return (
      <ClientProvider name={name} value={value}>
        {children}
      </ClientProvider>
    );
  };
  const result = {
    Provider,
    get: () => context().get<T>(name),
    name,
  };
  return result;
};

export const getMixContext = <T,>(name: string = "") => context().get<T>(name);
