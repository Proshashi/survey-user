import React, { forwardRef, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import styled, { keyframes } from "styled-components";
import { Input, InputProps } from "antd";
import type { InputRef } from "antd";

interface CustomInputProps extends Omit<InputProps, "prefix"> {
  name: string;
  label?: string;
  icon?: React.ReactNode;
  error?: string;
  isLoading?: boolean;
  type?: "text" | "password";
  helperText?: string;
  required?: boolean;
}

const floatLabelAnimation = keyframes`
  from {
    transform: translateY(0);
    font-size: 16px;
  }
  to {
    transform: translateY(-24px);
    font-size: 12px;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 24px;

  .ant-input-affix-wrapper {
    padding: 8px 11px;
    border-radius: 8px;

    &:focus,
    &-focused {
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    }

    &-status-error {
      border-color: #ff4d4f;
    }
  }

  .ant-input {
    &:focus + label,
    &:not(:placeholder-shown) + label {
      animation: ${floatLabelAnimation} 0.2s forwards;
    }
  }
`;

const HelperText = styled.span`
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
  margin-top: 4px;
  display: block;
`;

const StyledLabel = styled.label<{
  isFloating: boolean;
  $isRequired?: boolean;
}>`
  color: #666;
  pointer-events: none;
  text-transform: capitalize;
  font-size: 16px;
  transition: all 0.2s ease;
  background: white;
  padding: 0 4px;

  ${(props) =>
    props.$isRequired &&
    `
    &::after {
      content: ' *';
      color: #ff4d4f;
      margin-left: 2px;
    }
  `}
`;

const ErrorMessage = styled.span`
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
  display: block;
`;

const CustomInput = forwardRef<InputRef, CustomInputProps>(
  (
    {
      name,
      label,
      icon,
      error,
      isLoading,
      type = "text",
      helperText,
      required,
      ...props
    },
    ref,
  ) => {
    const { control } = useFormContext();
    const [isFocused, setIsFocused] = useState(false);

    const InputComponent = type === "password" ? Input.Password : Input;

    return (
      <Controller
        name={name}
        control={control}
        rules={{
          required: required && "This field is required",
        }}
        render={({ field, fieldState }) => (
          <InputWrapper>
            {label && (
              <StyledLabel
                htmlFor={name}
                isFloating={isFocused || !!field.value}
                $isRequired={required}
              >
                {label}
              </StyledLabel>
            )}

            <InputComponent
              {...field}
              {...props}
              id={name}
              ref={ref}
              status={fieldState.error ? "error" : undefined}
              prefix={icon}
              disabled={isLoading || props.disabled}
              placeholder=" "
              onFocus={(e) => {
                setIsFocused(true);
                field.onBlur();
                props.onFocus?.(e);
              }}
              onBlur={(e) => {
                setIsFocused(false);
                field.onBlur();
                props.onBlur?.(e);
              }}
            />

            {helperText && !fieldState.error && (
              <HelperText>{helperText}</HelperText>
            )}

            {fieldState.error && (
              <ErrorMessage>{fieldState.error.message}</ErrorMessage>
            )}
          </InputWrapper>
        )}
      />
    );
  },
);

CustomInput.displayName = "CustomInput";

export default CustomInput;
