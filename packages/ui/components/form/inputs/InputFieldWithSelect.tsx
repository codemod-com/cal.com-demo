import React from "react";

import { InputField, UnstyledSelect } from "../../..";
import type { InputFieldProps } from "./types";

export const InputFieldWithSelect = function EmailField(
  {
    ref,
    ...props
  }
) {
  return (
    <InputField
      ref={ref}
      {...props}
      inputIsFullWidth={false}
      addOnClassname="!px-0"
      addOnSuffix={<UnstyledSelect {...props.selectProps} />}
    />
  );
};
