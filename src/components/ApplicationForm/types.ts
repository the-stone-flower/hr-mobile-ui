import { FormInstance } from "antd-mobile/es/components/form";

export interface TabProps {
  form: FormInstance;
  allOptions: any;
  onIdNumberChange?: (idNumber: string) => void;
}

export interface TabConfig {
  key: string;
  title: string;
  component: React.ComponentType<TabProps>;
  fields: string[];
}
