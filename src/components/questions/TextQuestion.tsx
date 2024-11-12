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
  const context = useFormikContext();
  console.log({ context, name });

  const [field, meta, helpers] = useField(name);
  console.log({ field });
  return (
    <Form.Item
      label={label}
      tooltip={helpText}
      style={{
        margin: "20px 0 30px 0",
      }}
    >
      <Input
        required={required}
        value={field.value}
        onChange={(e) => {
          helpers.setValue(e.target.value);
        }}
      />
    </Form.Item>
  );
};
