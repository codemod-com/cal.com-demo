"use client";

/**
 * Typescript class based component for custom-error
 * @link https://nextjs.org/docs/advanced-features/custom-error-page
 */
import type { NextPage } from "next";
import type { ErrorProps } from "next/error";
import { headers as nextHeaders } from "next/headers";
import React, { useEffect, useState } from "react";

import { HttpError } from "@calcom/lib/http-error";
import logger from "@calcom/lib/logger";
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

const log = logger.getChildLogger({ prefix: ["[error]"] });

const CustomError: NextPage<DefaultErrorProps> = (props) => {
  const headers = nextHeaders();

  const { error } = props;
  const [errorProps, setErrorProps] = useState<CustomErrorProps>({});

  useEffect(() => {
    // If a HttpError message, let's override defaults
    if (error instanceof HttpError) {
      const redactedError = redactError(error);
      setErrorProps({
        statusCode: error.statusCode,
        title: redactedError.name,
        message: redactedError.message,
        err: {
          ...redactedError,
          url: error.url,
          statusCode: error.statusCode,
          cause: error.cause,
          method: error.method,
        },
      });
    } else {
      setErrorProps({
        message: error.message,
        err: error,
      });
    }

    // Running on the client (browser).
    //
    // Next.js will provide an err if:
    //
    //  - a page's `getInitialProps` threw or returned a Promise that rejected
    //  - an exception was thrown somewhere in the React lifecycle (render,
    //    componentDidMount, etc) that was caught by Next.js's React Error
    //    Boundary. Read more about what types of exceptions are caught by Error
    //    Boundaries: https://reactjs.org/docs/error-boundaries.html
    if (error) {
      log.info("client side logged this", error);
    }
  }, [error]);

  return <ErrorPage statusCode={errorProps.statusCode} error={errorProps.err} message={errorProps.message} />;
};

export default CustomError;
