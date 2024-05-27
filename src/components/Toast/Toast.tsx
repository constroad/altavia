import { PropsWithChildren } from 'react';
import curry from 'lodash/curry';
import { enqueueSnackbar, SharedProps, SnackbarProvider } from 'notistack';

const getToast = curry((variant: SharedProps['variant'], message: string) =>
  enqueueSnackbar?.(message, { variant, autoHideDuration: 3200 })
);
export const toast = {
  success: getToast('success'),
  error: getToast('error'),
  warning: getToast('warning'),
  info: getToast('info'),
};

export const ToastProvider = ({ children }: PropsWithChildren) => {
  return (
    <SnackbarProvider
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      {children}
    </SnackbarProvider>
  );
};
