import { Form, Input } from "antd";
import { useField, useFormikContext } from "formik";

interface TextQuestionProps {
  name: string;
  label: string;
  required?: boolean;
  helpText?: string;
}

export const TextQuestion: React.FC<TextQuestionProps> = ({
  name,
  label,
  required,
  helpText,
}) => {
  const [field, meta, helpers] = useField(name);

  return (
    <Form.Item
      label={label}
      tooltip={helpText}
      style={{
        margin: "20px 0 30px 0",
      }}
      validateStatus={meta.error && meta.touched ? "error" : ""}
      help={meta.error && meta.touched ? meta.error : ""}
      required={required}
    >
      <Input
        value={field.value}
        onChange={(e) => {
          helpers.setValue(e.target.value);
        }}
      />
    </Form.Item>
  );
};
