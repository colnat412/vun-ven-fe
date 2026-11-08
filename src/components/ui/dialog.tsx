import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { XIcon } from 'lucide-react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import * as React from 'react';

type DialogProps = React.ComponentProps<typeof DialogPrimitive.Root>;
type DialogTriggerProps = React.ComponentProps<typeof DialogPrimitive.Trigger>;
type DialogPortalProps = React.ComponentProps<typeof DialogPrimitive.Portal>;
type DialogCloseProps = React.ComponentProps<typeof DialogPrimitive.Close>;
type DialogOverlayProps = React.ComponentProps<typeof DialogPrimitive.Overlay>;
type DialogContentProps = React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
};
type DialogHeaderProps = React.ComponentProps<'div'>;
type DialogFooterProps = React.ComponentProps<'div'> & {
  showCloseButton?: boolean;
};
type DialogTitleProps = React.ComponentProps<typeof DialogPrimitive.Title>;
type DialogDescriptionProps = React.ComponentProps<typeof DialogPrimitive.Description>;
const Dialog = (componentProps: DialogProps) => {
  const { ...props } = componentProps;
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
};
const DialogTrigger = (componentProps: DialogTriggerProps) => {
  const { ...props } = componentProps;
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
};
const DialogPortal = (componentProps: DialogPortalProps) => {
  const { ...props } = componentProps;
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
};
const DialogClose = (componentProps: DialogCloseProps) => {
  const { ...props } = componentProps;
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
};
const DialogOverlay = (componentProps: DialogOverlayProps) => {
  const { className, ...props } = componentProps;
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        'fixed inset-0 z-50 bg-[var(--overlay)] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0',
        className,
      )}
      {...props}
    />
  );
};
const DialogContent = (componentProps: DialogContentProps) => {
  const { className, children, showCloseButton = true, ...props } = componentProps;
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          'fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background p-6 shadow-lg duration-200 outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:max-w-lg',
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className="absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          >
            <XIcon />
            <span className="sr-only">Đóng</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
};
const DialogHeader = (componentProps: DialogHeaderProps) => {
  const { className, ...props } = componentProps;
  return (
    <div
      data-slot="dialog-header"
      className={cn('flex flex-col gap-2 text-center sm:text-left', className)}
      {...props}
    />
  );
};
const DialogFooter = (componentProps: DialogFooterProps) => {
  const { className, showCloseButton = false, children, ...props } = componentProps;
  return (
    <div
      data-slot="dialog-footer"
      className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close asChild>
          <Button variant="outline">Đóng</Button>
        </DialogPrimitive.Close>
      )}
    </div>
  );
};
const DialogTitle = (componentProps: DialogTitleProps) => {
  const { className, ...props } = componentProps;
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn('text-lg leading-none font-semibold', className)}
      {...props}
    />
  );
};
const DialogDescription = (componentProps: DialogDescriptionProps) => {
  const { className, ...props } = componentProps;
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
};
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
