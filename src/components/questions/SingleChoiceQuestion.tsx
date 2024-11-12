import { Form, Input, Radio } from "antd";
import { useField } from "formik";
import React from "react";

interface SingleChoiceQuestionProps {
  name: string;
  label: string;
  required?: boolean;
  helpText?: string;
  options?: { option: string; order: number }[];
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
    >
      <Radio.Group
        onChange={(e) => {
          helpers.setValue(e.target.value);
        }}
        value={field.value}
      >
        {options?.map((opt) => (
          <Radio
            key={opt.option}
            value={opt.option}
            checked={field.value === opt.option}
          >
            {opt.option}
          </Radio>
        ))}
      </Radio.Group>
    </Form.Item>
  );
};

export default SingleChoiceQuestion;
