import React from "react";
import { SmileOutlined } from "@ant-design/icons";
import { Result } from "antd";

const App: React.FC = () => (
  <Result icon={<SmileOutlined />} title="Successfully Submitted!" />
);

export default App;
