import { createContext, useContext, useMemo } from "react";
import { Toaster, toaster } from "../ui/toaster";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const value = useMemo(
    () => ({
      show({ title, description, type = "info", closable = true, duration = 3000 }) {
        toaster.create({
          title,
          description,
          type,
          closable,
          duration,
        });
      },
      success(title, description, options = {}) {
        toaster.create({
          title,
          description,
          type: "success",
          closable: true,
          duration: 3000,
          ...options,
        });
      },
      error(title, description, options = {}) {
        toaster.create({
          title,
          description,
          type: "error",
          closable: true,
          duration: 4000,
          ...options,
        });
      },
      warning(title, description, options = {}) {
        toaster.create({
          title,
          description,
          type: "warning",
          closable: true,
          duration: 3500,
          ...options,
        });
      },
    }),
    [],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast precisa ser usado dentro de ToastProvider.");
  }

  return context;
}
