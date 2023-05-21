"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export const SupportContext = createContext<{
  files: File[];
  uploadFile: (file: File) => void;
  removeFile: (file: File) => void;
}>({
  files: [],
  uploadFile: () => {},
  removeFile: () => {},
});

export default function SupportProvider({ children }: React.PropsWithChildren) {
  const [files, setFiles] = useState<File[]>([]);

  const uploadFile = useCallback((file: File) => {
    setFiles((files) => [...files, file]);
  }, []);

  const removeFile = useCallback((file: File) => {
    setFiles((files) => files.filter((f) => f !== file));
  }, []);

  const contextValue = useMemo(() => {
    return {
      files,
      uploadFile,
      removeFile,
    };
  }, [files, uploadFile, removeFile]);

  return (
    <SupportContext.Provider value={contextValue}>
      {children}
    </SupportContext.Provider>
  );
}

export const useSupportContext = () => useContext(SupportContext);
