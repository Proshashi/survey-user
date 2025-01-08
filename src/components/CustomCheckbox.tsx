import React, { forwardRef } from "react";
import { useFormContext, Controller } from "react-hook-form";
import styled, { css, keyframes } from "styled-components";
import { Checkbox, Spin, Space } from "antd";
import type { CheckboxProps, CheckboxRef } from "antd";
import { CheckboxGroupProps } from "antd/es/checkbox";

interface CustomCheckboxProps extends CheckboxProps {
  name: string;
  label?: React.ReactNode;
  helperText?: string;
  error?: string;
  isLoading?: boolean;
  options?: Array<{ label: string; value: string }>;
  isGroup?: boolean;
  groupProps?: CheckboxGroupProps;
}

const CheckboxWrapper = styled.div<{ $hasError?: boolean }>`
  position: relative;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;

  .ant-checkbox-wrapper {
    align-items: flex-start;

    &:hover .ant-checkbox {
      border-color: #1890ff;
    }
  }

  .ant-checkbox {
    &::after {
      content: "";
      position: absolute;
      top: -1px;
      left: -1px;
      width: 100%;
      height: 100%;
      border-radius: 2px;
      border: 1px solid transparent;
      transition: all 0.3s;
    }
  }

  ${({ $hasError }) =>
    $hasError &&
    css`
      .ant-checkbox {
        border-color: #ff4d4f;
      }
    `}
`;

const StyledLabel = styled.label`
  color: #666;
  text-transform: capitalize;
  font-size: 16px;
  pointer-events: none;
  transition: all 0.2s ease;
  background: white;
  padding: 0 4px;
  margin-bottom: 8px;
`;

const Label = styled.span`
  margin-left: 8px;
  color: rgba(0, 0, 0, 0.85);
  transition: color 0.3s;
`;

const HelperText = styled.span`
  display: block;
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
  margin-top: 4px;
  margin-left: 22px;
`;

const ErrorMessage = styled.span`
  display: block;
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
  margin-left: 22px;
`;

const StyledCheckboxGroup = styled(Checkbox.Group)`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CustomCheckbox = forwardRef<CheckboxRef, CustomCheckboxProps>(
  (
    {
      name,
      label,
      helperText,
      error,
      isLoading,
      options,
      isGroup,
      groupProps,
      ...props
    },
    ref,
  ) => {
    const { control } = useFormContext();

    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <CheckboxWrapper $hasError={!!fieldState.error}>
            {label && <StyledLabel htmlFor={name}>{label}</StyledLabel>}

            {isLoading && <Spin size="small" style={{ marginRight: 8 }} />}

            {isGroup ? (
              <StyledCheckboxGroup
                {...field}
                {...groupProps}
                options={options}
                disabled={isLoading || props.disabled}
              />
            ) : (
              <Checkbox
                {...field}
                {...props}
                ref={ref}
                checked={field.value}
                onChange={(e) => {
                  field.onChange(e.target.checked);
                  props.onChange?.(e);
                }}
                disabled={isLoading || props.disabled}
              />
            )}

            {helperText && !fieldState.error && (
              <HelperText>{helperText}</HelperText>
            )}

            {fieldState.error && (
              <ErrorMessage>{fieldState.error.message}</ErrorMessage>
            )}
          </CheckboxWrapper>
        )}
      />
    );
  },
);

CustomCheckbox.displayName = "CustomCheckbox";

export default CustomCheckbox;
