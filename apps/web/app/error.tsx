"use client";

/**
 * Typescript class based component for custom-error
 * @link https://nextjs.org/docs/advanced-features/custom-error-page
 */
import type { NextPage } from "next";
import type { ErrorProps } from "next/error";
import React from "react";

import { HttpError } from "@calcom/lib/http-error";
import { redactError } from "@calcom/lib/redactError";

import { ErrorPage } from "@components/error/error-page";

type NextError = Error & { digest?: string };
// Ref: https://nextjs.org/docs/app/api-reference/file-conventions/error#props
export type DefaultErrorProps = {
  error: NextError;
  reset: () => void; // A function to reset the error boundary
};

type AugmentedError = NextError | HttpError | null;

type CustomErrorProps = {
  err?: AugmentedError;
  statusCode?: number;
  message?: string;
} & Omit<ErrorProps, "err" | "statusCode">;

const CustomError: NextPage<DefaultErrorProps> = (props) => {
  const { error } = props;
  let errorObject: CustomErrorProps = {
    message: error.message,
    err: error,
  };

  if (error instanceof HttpError) {
    const redactedError = redactError(error);
    errorObject = {
      statusCode: error.statusCode,
      title: redactedError.name,
      message: redactedError.message,
      err: {
        ...redactedError,
        ...error,
      },
    };
  }

  return (
    <ErrorPage statusCode={errorObject.statusCode} error={errorObject.err} message={errorObject.message} />
  );
};

export default CustomError;
