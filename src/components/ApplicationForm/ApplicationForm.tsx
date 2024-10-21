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

  const handleNext = async () => {
    try {
      const currentTabConfig = tabConfigs.find(
        (config) => config.key === activeKey
      );
      if (currentTabConfig) {
        await form.validateFields(currentTabConfig.fields);
      }
      const currentIndex = tabConfigs.findIndex((config) => config.key === activeKey);
      if (currentIndex < tabConfigs.length - 1) {
        setActiveKey(tabConfigs[currentIndex + 1].key);
      }
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
      const values = await form.validateFields();
      console.log("Raw Form values:", values);

      const processedValues = {
        ...values,
        edu_info_list: values.edu_info_list || [],
        workexp_info_list: values.workexp_info_list || [],
        social_info_list: values.social_info_list || [],
      };

      if (processedValues.physical_disability) {
        processedValues.physical_disability =
          processedValues.physical_disability[1];
      }

      console.log("Processed Form values:", processedValues);

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

  const renderNextButton = () => {
    const currentIndex = tabConfigs.findIndex((config) => config.key === activeKey);
    if (currentIndex < tabConfigs.length - 1 && currentIndex < 2) {
      return (
        <Button block type="submit" color="primary" onClick={handleNext}>
          下一步
        </Button>
      );
    }
    return null;
  };

  return (
    <div className="app-container">
      <div className="form-wrapper mb-4">
        <h1 className="form-title">应聘登记表</h1>
        <Form form={form}>
          <Tabs activeKey={activeKey} onChange={setActiveKey}>
            {tabConfigs.map(({ key, title, component: TabComponent }) => (
              <Tabs.Tab title={title} key={key}>
                <TabComponent form={form} allOptions={allOptions} />
                {renderNextButton()}
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