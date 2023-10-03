"use client";

import { type NextPage } from "next";

import CustomError, { type CustomErrorProps } from "./error";

export const GlobalError: NextPage<CustomErrorProps> = (props) => {
  return (
    <html>
      <body>
        <CustomError {...props} />
      </body>
    </html>
  );
};

export default GlobalError;
