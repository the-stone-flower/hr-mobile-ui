import React, { useState, useEffect } from "react";
import { Form, Button, Toast, Tabs } from "antd-mobile";
import { useAppDispatch, useAppSelector } from "modules/store";
import { fetchOptions, optionsSelector } from "modules/options/index";
import { addListItem } from "modules/list/recruit";
import { tabConfigs } from "./config";

const ApplicationForm: React.FC = () => {
  const [form] = Form.useForm();
  const [activeKey, setActiveKey] = useState("1");
  const dispatch = useAppDispatch();
  const { allOptions } = useAppSelector(optionsSelector);

  useEffect(() => {
    dispatch(fetchOptions("create_ext_user_options"));
  }, [dispatch]);

  const handleTabChange = async (key: string) => {
    try {
      const currentTabConfig = tabConfigs.find(
        (config) => config.key === activeKey
      );
      if (currentTabConfig) {
        await form.validateFields(currentTabConfig.fields);
      }
      setActiveKey(key);
    } catch (errorInfo) {
      console.log("Validation Failed:", errorInfo);
      Toast.show({
        icon: "fail",
        content: "请填写当前页面的所有必填字段！",
      });
    }
  };

  const onFinish = async () => {
    try {
      // 验证所有字段
      const values = await form.validateFields();
      console.log("Raw Form values:", values);

      // 处理 edu_info_list, workexp_info_list, social_info_list
      const processedValues = {
        ...values,
        edu_info_list: values.edu_info_list || [],
        workexp_info_list: values.workexp_info_list || [],
        social_info_list: values.social_info_list || [],
      };

      // 确保 physical_disability 字段正确处理
      if (processedValues.physical_disability) {
        processedValues.physical_disability =
          processedValues.physical_disability[1];
      }

      console.log("Processed Form values:", processedValues);

      // 发送到后端
      await dispatch(addListItem(processedValues)).unwrap();
      Toast.show({
        icon: "success",
        content: "提交成功！",
      });
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
      Toast.show({
        icon: "fail",
        content: "请填写所有必填字段！",
      });
    }
  };
  return (
    <div className="app-container">
      <div className="form-wrapper mb-4">
        <h1 className="form-title">应聘登记表</h1>
        <Form form={form}>
          <Tabs activeKey={activeKey} onChange={handleTabChange}>
            {tabConfigs.map(({ key, title, component: TabComponent }) => (
              <Tabs.Tab title={title} key={key}>
                <TabComponent form={form} allOptions={allOptions} />
              </Tabs.Tab>
            ))}
          </Tabs>
        </Form>
        {activeKey === "5" && (
          <Button
            block
            className="mb-10"
            type="submit"
            color="primary"
            size="large"
            onClick={onFinish}
          >
            提交
          </Button>
        )}
      </div>
    </div>
  );
};

export default ApplicationForm;
