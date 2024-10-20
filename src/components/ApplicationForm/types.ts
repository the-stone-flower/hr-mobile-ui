import { FormInstance } from "antd-mobile/es/components/form";

export interface TabProps {
  form: FormInstance;
  allOptions: any; // 替换为实际的类型
}

export interface TabConfig {
  key: string;
  title: string;
  component: React.ComponentType<TabProps>;
  fields: string[];
}
