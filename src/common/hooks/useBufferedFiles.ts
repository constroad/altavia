import { useState, useCallback, useEffect } from 'react';

interface UseBufferedFilesOptions {
  immediateUpload?: boolean;
  onUpload?: (file: File) => void;
  maxFiles?: number;
}

export const useBufferedFiles = (props: UseBufferedFilesOptions) => {
  const {
    immediateUpload = false,
    onUpload
  } = props;
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [objectUrls, setObjectUrls] = useState<string[]>([]);

  useEffect(() => {
    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [objectUrls]);

  const addFiles = useCallback((files: File[]) => {
    const limitedFiles = props.maxFiles === 1 ? [files[0]] : files;

    if (immediateUpload && onUpload) {
      limitedFiles.forEach((file) => onUpload(file));
    } else {
      if (props.maxFiles === 1) {
        // Reemplazar el archivo actual
        uploadedFiles.forEach((_, i) => URL.revokeObjectURL(objectUrls[i]));
        setUploadedFiles(limitedFiles);
        setObjectUrls(limitedFiles.map((f) => URL.createObjectURL(f)));
      } else {
        setUploadedFiles((prev) => [...prev, ...limitedFiles]);
        const newUrls = limitedFiles.map((f) => URL.createObjectURL(f));
        setObjectUrls((prev) => [...prev, ...newUrls]);
      }
    }
  }, [immediateUpload, onUpload, objectUrls]);

  const onSelect = useCallback((file: File | File[]) => {
    const files = Array.isArray(file) ? file : [file];
    addFiles(files);
  }, [addFiles]);

  const onPaste = useCallback((file: File | File[]) => {
    const files = Array.isArray(file) ? file : [file];
    addFiles(files);
  }, [addFiles]);

  const removeFile = useCallback((index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(objectUrls[index]);
    setObjectUrls((prev) => prev.filter((_, i) => i !== index));
  }, [objectUrls]);

  const resetFiles = useCallback(() => {
    objectUrls.forEach((url) => URL.revokeObjectURL(url));
    setUploadedFiles([]);
    setObjectUrls([]);
  }, [objectUrls]);

  return {
    uploadedFiles,
    objectUrls,
    onSelect,
    onPaste,
    removeFile,
    resetFiles,
  };
};
