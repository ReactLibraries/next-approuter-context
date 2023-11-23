export * from "./server.js";
export * from "./client.js";

import React, { use } from "react";
import { useClientContext } from "./client";
import { context } from "./server";

export const getComponentType = () =>
  !React["useState"]
    ? "Server"
    : React["createServerContext"] || !React["useOptimistic"]
    ? "Pages"
    : "Client";

export const useMixContext = <T>(name: string = "") => {
  if (getComponentType() === "Server") return use(context().get<T>(name));
  return useClientContext<T>(name);
};
