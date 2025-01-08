import React, { forwardRef } from "react";
import { useFormContext, Controller } from "react-hook-form";
import styled, { css, keyframes } from "styled-components";
import { Input, InputProps } from "antd";
import type { InputRef } from "antd";

interface CustomInputProps extends Omit<InputProps, "prefix"> {
  name: string;
  label?: string;
  icon?: React.ReactNode;
  error?: string;
  isLoading?: boolean;
  type?: "text" | "password";
}

const floatLabel = keyframes`
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
`;

const StyledLabel = styled.label<{ isFloating: boolean }>`
  position: absolute;
  left: 16px;
  color: #666;
  pointer-events: none;
  transition: all 0.2s ease;
  background: white;
  padding: 0 4px;
  z-index: 1;

  ${({ isFloating }) =>
    isFloating &&
    css`
      animation: ${floatLabel} 0.2s ease forwards;
      color: #1890ff;
    `}
`;

const ErrorMessage = styled.span`
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
  display: block;
`;

const CustomInput = forwardRef<InputRef, CustomInputProps>(
  ({ name, label, icon, error, isLoading, type = "text", ...props }, ref) => {
    const { control } = useFormContext();
    const [isFocused, setIsFocused] = React.useState(false);

    const InputComponent = type === "password" ? Input.Password : Input;

    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <InputWrapper>
            {label && (
              <StyledLabel
                htmlFor={name}
                isFloating={isFocused || !!field.value}
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
