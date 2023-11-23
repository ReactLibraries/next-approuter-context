import { ReactNode, cache, use } from "react";

export const createContext = <T>() => {
  const context = cache(() => {
    let resolve: (value: T) => void;
    const promise = new Promise<T>((r) => (resolve = r));
    return {
      set: (value: T) => resolve(value),
      get: () => promise,
    };
  });
  const Provider = ({ children, value }: { children: ReactNode; value: T }) => {
    context().set(value);
    return children;
  };
  return Object.assign(context, { Provider });
};

export const getContext = <T>(context: ReturnType<typeof createContext<T>>) =>
  context().get();
export const useContext = <T>(context: ReturnType<typeof createContext<T>>) =>
  use(context().get());
