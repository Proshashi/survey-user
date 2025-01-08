import React, { forwardRef } from "react";
import { useFormContext, Controller } from "react-hook-form";
import styled, { css, keyframes } from "styled-components";
import { Radio, Space, Spin } from "antd";
import type { RadioProps, RadioGroupProps } from "antd";
import { RadioRef } from "antd/es/radio";

interface CustomRadioButtonProps extends Omit<RadioProps, "defaultValue"> {
  name: string;
  label?: React.ReactNode;
  helperText?: string;
  error?: string;
  isLoading?: boolean;
  options?: Array<{ label: string; value: any }>;
  isGroup?: boolean;
  groupProps?: Omit<RadioGroupProps, "onChange">;
  variant?: "default" | "button";
  direction?: "horizontal" | "vertical";
}

const RadioWrapper = styled.div<{ $hasError?: boolean }>`
  position: relative;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;

  .ant-radio-wrapper {
    align-items: flex-start;

    &:hover .ant-radio {
      border-color: #1890ff;
    }
  }

  .ant-radio {
    &::after {
      content: "";
      position: absolute;
      top: -1px;
      left: -1px;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      transition: all 0.3s;
    }
  }

  .ant-radio-button-wrapper {
    &:hover {
      color: #1890ff;
    }

    &-checked {
      &::before {
        background-color: #1890ff;
      }
    }
  }

  ${({ $hasError }) =>
    $hasError &&
    css`
      .ant-radio {
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

const StyledSpace = styled(Space)<{ $direction: "horizontal" | "vertical" }>`
  display: flex;
  flex-direction: ${({ $direction }) => $direction};
  width: 100%;
`;

const CustomRadioButton = forwardRef<RadioRef, CustomRadioButtonProps>(
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
      variant = "default",
      direction = "vertical",
      ...props
    },
    ref,
  ) => {
    const { control } = useFormContext();

    const RadioComponent = variant === "button" ? Radio.Button : Radio;
    const GroupComponent = variant === "button" ? Radio.Group : Radio.Group;

    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <RadioWrapper $hasError={!!fieldState.error}>
            {label && <StyledLabel htmlFor={name}>{label}</StyledLabel>}

            {isLoading && <Spin size="small" style={{ marginRight: 8 }} />}

            {isGroup ? (
              <GroupComponent
                {...field}
                {...groupProps}
                disabled={isLoading || props.disabled}
                optionType={variant === "button" ? "button" : "default"}
              >
                <StyledSpace $direction={direction}>
                  {options?.map((option) => (
                    <RadioComponent key={option.value} value={option.value}>
                      {option.label}
                    </RadioComponent>
                  ))}
                </StyledSpace>
              </GroupComponent>
            ) : (
              <RadioComponent
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
          </RadioWrapper>
        )}
      />
    );
  },
);

CustomRadioButton.displayName = "CustomRadioButton";

export default CustomRadioButton;
