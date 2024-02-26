import { toast } from "src/components";

export const copyToClipboard = (text: string | undefined, toastMessage: string) => {
  if (text) {
    navigator.clipboard.writeText(`${text}`);
  }
  toast.success(toastMessage)
};