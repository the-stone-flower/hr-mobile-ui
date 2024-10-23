import React, { useState, useEffect, useCallback } from "react";
import { Form, Button, Toast, Tabs, SpinLoading } from "antd-mobile";
import { useAppDispatch, useAppSelector } from "modules/store";
import { fetchOptions, optionsSelector } from "modules/options/index";
import { addListItem, getListItemFromId } from "modules/list/recruit";
import { tabConfigs } from "./config";
import { CheckCircleFill } from "antd-mobile-icons";

const ApplicationForm: React.FC = () => {
  const [form] = Form.useForm();
  const [activeKey, setActiveKey] = useState("1");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const dispatch = useAppDispatch();
  const { allOptions } = useAppSelector(optionsSelector);

  useEffect(() => {
    dispatch(fetchOptions("create_ext_user_options"));
  }, [dispatch]);

  const handleIdNumberChange = useCallback(
    async (idNumber: string) => {
      try {
        const res = await dispatch(
          getListItemFromId({ id_number: idNumber })
        ).unwrap();

        if (res && res.id) {
          // 工具函数：过滤掉对象中的 null 和空值
          const filterNullValues = (obj: any) => {
            const result: any = {};
            Object.entries(obj).forEach(([key, value]) => {
              // 如果是数组，递归处理数组中的每个对象
              if (Array.isArray(value)) {
                const filteredArray = value
                  .map((item) =>
                    typeof item === "object" ? filterNullValues(item) : item
                  )
                  .filter((item) => Object.keys(item).length > 0);
                if (filteredArray.length > 0) {
                  result[key] = filteredArray;
                }
              }
              // 处理 Picker 组件的值，确保是数组格式
              else if (
                [
                  "nation",
                  "political",
                  "marital_status",
                  "employment",
                  "degree",
                ].includes(key) &&
                value
              ) {
                result[key] = [value];
              }
              // 如果是有效值，则保留
              else if (value !== null && value !== undefined && value !== "") {
                result[key] = value;
              }
            });
            return result;
          };

          // 设置表单数据，只设置有效值
          const processedData = filterNullValues(res);

          // 处理教育经历列表中的 Picker 值
          if (processedData.edu_info_list) {
            processedData.edu_info_list = processedData.edu_info_list.map(
              (edu: any) => ({
                ...edu,
                education: edu.education ? [edu.education] : undefined,
                degree: edu.degree ? [edu.degree] : undefined,
                education_type: edu.education_type
                  ? [edu.education_type]
                  : undefined,
              })
            );
          }

          form.setFieldsValue(processedData);

          Toast.show({
            icon: "success",
            content: "已自动填充历史数据",
          });
        }
      } catch (error) {
        console.log("未找到历史数据");
      }
    },
    [dispatch, form]
  );

  const handleNext = async () => {
    try {
      const currentTabConfig = tabConfigs.find(
        (config) => config.key === activeKey
      );
      if (currentTabConfig) {
        await form.validateFields(currentTabConfig.fields);
      }
      const currentIndex = tabConfigs.findIndex(
        (config) => config.key === activeKey
      );
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

  const handlePrevious = () => {
    const currentIndex = tabConfigs.findIndex(
      (config) => config.key === activeKey
    );
    if (currentIndex > 0) {
      setActiveKey(tabConfigs[currentIndex - 1].key);
    }
  };

  const onFinish = async () => {
    try {
      setIsSubmitting(true);
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
      setIsSubmitted(true);
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
      Toast.show({
        icon: "fail",
        content: "请填写所有必填字段！",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderNavigationButtons = () => {
    const currentIndex = tabConfigs.findIndex(
      (config) => config.key === activeKey
    );
    const isFirstTab = currentIndex === 0;
    const isLastTab = currentIndex === tabConfigs.length - 1;

    return (
      <div className="flex justify-between mt-6 mb-10 mx-4 gap-4">
        {!isFirstTab && (
          <Button className="flex-grow" onClick={handlePrevious}>
            上一步
          </Button>
        )}
        {!isLastTab && (
          <Button className="flex-grow" onClick={handleNext}>
            下一步
          </Button>
        )}
        {isLastTab && (
          <Button
            color="primary"
            onClick={onFinish}
            loading={isSubmitting}
            loadingText="提交中"
            className="flex-grow"
          >
            {isSubmitting ? <SpinLoading /> : "提交"}
          </Button>
        )}
      </div>
    );
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <CheckCircleFill className="text-green-500 text-6xl mb-4" />
        <p className="text-xl">登记提交成功</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="form-wrapper mb-4">
        <h1 className="form-title">应聘登记表</h1>
        <Form form={form}>
          <Tabs activeKey={activeKey} onChange={setActiveKey}>
            {tabConfigs.map(({ key, title, component: TabComponent }) => (
              <Tabs.Tab title={title} key={key}>
                <TabComponent
                  form={form}
                  allOptions={allOptions}
                  onIdNumberChange={
                    key === "1" ? handleIdNumberChange : undefined
                  }
                />
              </Tabs.Tab>
            ))}
          </Tabs>
          {renderNavigationButtons()}
        </Form>
      </div>
    </div>
  );
};

export default ApplicationForm;
