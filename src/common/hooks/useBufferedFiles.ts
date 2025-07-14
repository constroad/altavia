import { useState, useCallback, useEffect } from 'react';

interface UseBufferedFilesOptions {
  immediateUpload?: boolean;
  onUpload?: (file: File) => void;
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
    if (immediateUpload && onUpload) {
      files.forEach((file) => onUpload(file));
    } else {
      setUploadedFiles((prev) => [...prev, ...files]);
      const newUrls = files.map((f) => URL.createObjectURL(f));
      setObjectUrls((prev) => [...prev, ...newUrls]);
    }
  }, [immediateUpload, onUpload]);

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
