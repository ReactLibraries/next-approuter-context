export { createMixServerContext } from "./server";
export * from "./server.js";
export * from "./client.js";

import React, { use } from "react";
import { useClientContext } from "./client";
import { context, createMixServerContext } from "./server";

export const getComponentType = () =>
  !React["useState"]
    ? "Server"
    : React["createServerContext"] || !React["useOptimistic"]
    ? "Pages"
    : "Client";

export const useMixContext = <T>({ name }: { name: string; type: T }) => {
  if (getComponentType() === "Server") return use(context().get<T>(name));
  return useClientContext<T>(name);
};

export const createMixContext = <T>(name: string) => {
  const context =
    getComponentType() === "Server"
      ? createMixServerContext<T>(name)
      : { name };
  return context as typeof context & { type: T };
};
