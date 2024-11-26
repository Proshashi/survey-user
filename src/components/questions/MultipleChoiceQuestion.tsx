import { Checkbox, Form, Input, Radio } from "antd";
import { useField } from "formik";
import React from "react";

interface MultipleChoiceQuestionProps {
  name: string;
  label: string;
  required?: boolean;
  helpText?: string;
  options?: { option: string; order: number; id: string }[];
}

const MultipleChoiceQuestion = ({
  name,
  label,
  required,
  helpText,
  options,
}: MultipleChoiceQuestionProps) => {
  const [field, meta, helpers] = useField(name);

  return (
    <Form.Item
      label={label}
      tooltip={helpText}
      style={{
        margin: "20px 0 30px 0",
      }}
      required={required}
      validateStatus={meta.error && meta.touched ? "error" : ""}
      help={meta.error && meta.touched ? meta.error : ""}
    >
      <Checkbox.Group
        options={options?.map((opt) => ({
          label: opt.option,
          value: opt.id,
        }))}
        onChange={(values) => {
          helpers.setValue(values);
        }}
        value={field.value}
      />
    </Form.Item>
  );
};

export default MultipleChoiceQuestion;
