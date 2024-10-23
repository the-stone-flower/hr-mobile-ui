import React, { useEffect, useState } from "react";
import { Form, Input, Picker, DatePicker, Button } from "antd-mobile";
import { TabProps } from "./types";
import dayjs from "dayjs";

interface EducationRecord {
  education_type: string;
  education: string;
  graduated: string;
  degree: string;
  major: string;
  graduated_date: string;
}

interface PickerOption {
  label: string;
  value: string | number;
  children?: PickerOption[];
}

const EducationInfo: React.FC<TabProps> = ({ form, allOptions }) => {
  const [localEduList, setLocalEduList] = useState<EducationRecord[]>([]);

  // 使用表单值来控制教育经历列表的显示，如果没有表单值则使用本地状态
  const getEducationList = () => {
    const formEduList = form.getFieldValue("edu_info_list");
    if (formEduList && formEduList.length) {
      
    }
    return formEduList || localEduList;
  };

  // 处理添加教育经历
  const handleAddEducation = () => {
    const newList = [...getEducationList(), {}];

    setLocalEduList(newList);
  };

  // 处理删除教育经历
  const handleRemoveEducation = (index: number) => {
    const currentList = getEducationList();
    const newList = currentList.filter((_: any, i: number) => i !== index);
    setLocalEduList(newList);
  };
  // 辅助函数：获取选择器显示文本
  const getPickerDisplayText = (
    value: any,
    options: PickerOption[],
    defaultText: string,
    formFieldPath?: string[]
  ) => {
    if (value?.[0]?.label) {
      return value[0].label;
    }

    const formValue = formFieldPath ? form.getFieldValue(formFieldPath) : value;
    if (formValue) {
      const actualValue = Array.isArray(formValue) ? formValue[0] : formValue;
      const option = options?.find((opt) => opt.value == actualValue);
      return option?.label || defaultText;
    }

    return defaultText;
  };

  // 辅助函数：获取日期显示文本
  const getDateDisplayText = (
    value: Date | null | undefined,
    formFieldPath: string[],
    defaultText: string
  ) => {
    const dateValue = value || form.getFieldValue(formFieldPath);
    return dateValue ? dayjs(dateValue).format("YYYY-MM-DD") : defaultText;
  };

  // 获取学历选项
  const getEducationOptions = (index: number) => {
    const educationType = form.getFieldValue([
      "edu_info_list",
      String(index),
      "education_type",
    ]);
    if (educationType) {
      const eduType = Array.isArray(educationType)
        ? educationType[0]
        : educationType;
      const selectedType = allOptions.education_info_options?.options.find(
        (option: any) => option.value == eduType
      );
      return selectedType?.children || [];
    }
    return [];
  };

  return (
    <>
      {localEduList.map((_: any, index: number) => (
        <div key={index}>
          <h4 className="font-bold ml-2 my-2">教育经历 {index + 1}</h4>
          <Form.Item
            name={["edu_info_list", String(index), "education_type"]}
            label="学历类型"
            rules={[{ required: true, message: "请选择学历类型" }]}
            trigger="onConfirm"
            onClick={(e, pickerRef) => {
              pickerRef.current?.open();
            }}
          >
            <Picker
              columns={[allOptions.education_info_options?.options || []]}
            >
              {(value) =>
                getPickerDisplayText(
                  value,
                  allOptions.education_info_options?.options || [],
                  "请选择学历类型",
                  ["edu_info_list", String(index), "education_type"]
                )
              }
            </Picker>
          </Form.Item>

          <Form.Item
            name={["edu_info_list", String(index), "education"]}
            label="学历"
            rules={[{ required: true, message: "请选择学历" }]}
            trigger="onConfirm"
            onClick={(e, pickerRef) => {
              pickerRef.current?.open();
            }}
            dependencies={[["edu_info_list", String(index), "education_type"]]}
          >
            <Picker columns={[getEducationOptions(index)]}>
              {(value) =>
                getPickerDisplayText(
                  value,
                  getEducationOptions(index),
                  "请选择学历",
                  ["edu_info_list", String(index), "education"]
                )
              }
            </Picker>
          </Form.Item>

          <Form.Item
            name={["edu_info_list", String(index), "graduated"]}
            label="毕业学校"
            rules={[{ required: true, message: "请输入毕业学校" }]}
          >
            <Input placeholder="请输入毕业学校" />
          </Form.Item>

          <Form.Item
            name={["edu_info_list", String(index), "degree"]}
            label="学位"
            trigger="onConfirm"
            onClick={(e, pickerRef) => {
              pickerRef.current?.open();
            }}
          >
            <Picker columns={[allOptions.degree_options?.options || []]}>
              {(value) =>
                getPickerDisplayText(
                  value,
                  allOptions.degree_options?.options || [],
                  "请选择学位",
                  ["edu_info_list", String(index), "degree"]
                )
              }
            </Picker>
          </Form.Item>

          <Form.Item
            name={["edu_info_list", String(index), "major"]}
            label="专业"
          >
            <Input placeholder="请输入专业" />
          </Form.Item>

          <Form.Item
            name={["edu_info_list", String(index), "graduated_date"]}
            label="毕业时间"
            trigger="onConfirm"
            onClick={(e, datePickerRef) => {
              datePickerRef.current?.open();
            }}
          >
            <DatePicker>
              {(value) =>
                getDateDisplayText(
                  value,
                  ["edu_info_list", String(index), "graduated_date"],
                  "请选择毕业时间"
                )
              }
            </DatePicker>
          </Form.Item>

          <div className="flex justify-end mb-4">
            <Button
              color="danger"
              size="small"
              onClick={() => handleRemoveEducation(index)}
            >
              删除此教育经历
            </Button>
          </div>
        </div>
      ))}
      <div className="flex justify-center mt-2">
        <Button color="success" onClick={handleAddEducation}>
          + 添加教育经历
        </Button>
      </div>
    </>
  );
};

export default EducationInfo;
