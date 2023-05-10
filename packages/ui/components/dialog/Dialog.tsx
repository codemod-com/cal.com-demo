import * as DialogPrimitive from "@radix-ui/react-dialog";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import React, { useState } from "react";

import classNames from "@calcom/lib/classNames";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import type { SVGComponent } from "@calcom/types/SVGComponent";

import type { ButtonProps } from "../../components/button";
import { Button } from "../../components/button";

export type DialogProps = React.ComponentProps<(typeof DialogPrimitive)["Root"]> & {
  name?: string;
  clearQueryParamsOnClose?: string[];
};
export function Dialog(props: DialogProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { children, name, ...dialogProps } = props;
  // only used if name is set
  const [open, setOpen] = useState(!!dialogProps.open);

  if (name) {
    const clearQueryParamsOnClose = ["dialog", ...(props.clearQueryParamsOnClose || [])];
    dialogProps.onOpenChange = (open) => {
      if (props.onOpenChange) {
        props.onOpenChange(open);
      }
      // toggles "dialog" query param
      const query = new URLSearchParams(searchParams);

      if (open) {
        query.set("dialog", name);
      } else {
        clearQueryParamsOnClose.forEach((queryParam) => {
          query.delete(queryParam);
        });
      }

      router.push(`${pathname}?${query.toString()}`);
      setOpen(open);
    };
    // handles initial state
    if (!open && searchParams.get("dialog") === name) {
      setOpen(true);
    }
    // allow overriding
    if (!("open" in dialogProps)) {
      dialogProps.open = open;
    }
  }

  return <DialogPrimitive.Root {...dialogProps}>{children}</DialogPrimitive.Root>;
}
type DialogContentProps = React.ComponentProps<(typeof DialogPrimitive)["Content"]> & {
  size?: "xl" | "lg" | "md";
  type?: "creation" | "confirmation";
  title?: string;
  description?: string | JSX.Element | undefined;
  closeText?: string;
  actionDisabled?: boolean;
  Icon?: SVGComponent;
  enableOverflow?: boolean;
};

// enableOverflow:- use this prop whenever content inside DialogContent could overflow and require scrollbar
export const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ children, title, Icon, enableOverflow, type = "creation", ...props }, forwardedRef) => {
    return (
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fadeIn fixed inset-0 z-50 bg-neutral-800 bg-opacity-70 transition-opacity dark:bg-opacity-70 " />
        <DialogPrimitive.Content
          {...props}
          className={classNames(
            "fadeIn bg-default fixed left-1/2 top-1/2 z-50 w-full max-w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded text-left shadow-xl focus-visible:outline-none sm:align-middle",
            props.size == "xl"
              ? "p-8 sm:max-w-[90rem]"
              : props.size == "lg"
              ? "p-8 sm:max-w-[70rem]"
              : props.size == "md"
              ? "p-8 sm:max-w-[48rem]"
              : "p-8 sm:max-w-[35rem]",
            "max-h-[95vh]",
            enableOverflow ? "overflow-auto" : "overflow-visible",
            `${props.className || ""}`
          )}
          ref={forwardedRef}>
          {type === "creation" && (
            <div>
              <DialogHeader title={title} subtitle={props.description} />
              <div className="flex flex-col space-y-6">{children}</div>
            </div>
          )}
          {type === "confirmation" && (
            <div className="flex">
              {Icon && (
                <div className="bg-emphasis mr-4 inline-flex h-10 w-10 items-center justify-center rounded-full">
                  <Icon className="text-emphasis h-4 w-4" />
                </div>
              )}
              <div className="w-full">
                <DialogHeader title={title} subtitle={props.description} />
                <div className="flex flex-col space-y-6">{children}</div>
              </div>
            </div>
          )}
          {!type && children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    );
  }
);

type DialogHeaderProps = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
};

export function DialogHeader(props: DialogHeaderProps) {
  if (!props.title) return null;

  return (
    <div className="mb-4">
      <h3 className="leading-20 text-semibold font-cal text-emphasis pb-1 text-xl" id="modal-title">
        {props.title}
      </h3>
      {props.subtitle && <div className="text-subtle text-sm">{props.subtitle}</div>}
    </div>
  );
}

export function DialogFooter(props: { children: ReactNode }) {
  return <div className="mt-7 flex justify-end space-x-2 rtl:space-x-reverse ">{props.children}</div>;
}

DialogContent.displayName = "DialogContent";

export const DialogTrigger = DialogPrimitive.Trigger;
// export const DialogClose = DialogPrimitive.Close;

export function DialogClose(
  props: {
    dialogCloseProps?: React.ComponentProps<(typeof DialogPrimitive)["Close"]>;
    children?: ReactNode;
    onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    disabled?: boolean;
    color?: ButtonProps["color"];
  } & React.ComponentProps<typeof Button>
) {
  const { t } = useLocale();
  return (
    <DialogPrimitive.Close asChild {...props.dialogCloseProps}>
      {/* This will require the i18n string passed in */}
      <Button color={props.color || "minimal"} {...props}>
        {props.children ? props.children : t("Close")}
      </Button>
    </DialogPrimitive.Close>
  );
}
