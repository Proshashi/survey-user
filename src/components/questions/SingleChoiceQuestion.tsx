import { Form, Input, Radio } from "antd";
import { useField } from "formik";
import React from "react";

interface SingleChoiceQuestionProps {
  name: string;
  label: string;
  required?: boolean;
  helpText?: string;
  options?: { option: string; order: number; id: string }[];
}

const SingleChoiceQuestion = ({
  name,
  label,
  required,
  helpText,
  options,
}: SingleChoiceQuestionProps) => {
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
      <Radio.Group
        onChange={(e) => {
          helpers.setValue(e.target.value);
        }}
        value={field.value}
      >
        {options?.map((opt) => (
          <Radio key={opt.id} value={opt.id} checked={field.value === opt.id}>
            {opt.option}
          </Radio>
        ))}
      </Radio.Group>
    </Form.Item>
  );
};

export default SingleChoiceQuestion;
