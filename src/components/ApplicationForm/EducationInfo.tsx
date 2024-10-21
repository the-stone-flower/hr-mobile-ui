import React, { useState } from "react";
import { Form, Input, Picker, DatePicker, Button } from "antd-mobile";
import { TabProps } from "./types";
import dayjs from "dayjs";

interface EducationRecord {
  education: string;
  graduated: string;
  degree: string;
  major: string;
  graduated_date: string;
}

const defaultEducation: EducationRecord = {
  education: "",
  graduated: "",
  degree: "",
  major: "",
  graduated_date: "",
};

const EducationInfo: React.FC<TabProps> = ({ form, allOptions }) => {
  const [educationList, setEducationList] = useState<EducationRecord[]>([]);

  const addEducation = () => {
    const newList = [...educationList, defaultEducation];
    setEducationList(newList);
  };

  const removeEducation = (index: number) => {
    const newList = educationList.filter((_, i) => i !== index);
    setEducationList(newList);
    // form.setFieldsValue({ edu_info_list: newList });
  };

  return (
    <>
      {educationList.map((_, index) => (
        <div key={index}>
          <h4 className="font-bold ml-2 my-2">教育经历 {index + 1}</h4>
          <Form.Item
            name={["edu_info_list", index, "education"]}
            label="学历"
            rules={[{ required: true, message: "请选择学历" }]}
            trigger="onConfirm"
            onClick={(e, pickerRef) => {
              pickerRef.current?.open();
            }}
          >
            <Picker columns={[allOptions.education_options?.options || []]}>
              {(value) => (value ? value[0]?.label : "请选择学历")}
            </Picker>
          </Form.Item>
          <Form.Item
            name={["edu_info_list", index, "graduated"]}
            label="毕业学校"
            rules={[{ required: true, message: "请输入毕业学校" }]}
          >
            <Input placeholder="请输入毕业学校" />
          </Form.Item>
          <Form.Item
            name={["edu_info_list", index, "degree"]}
            label="学位"
            trigger="onConfirm"
            onClick={(e, pickerRef) => {
              pickerRef.current?.open();
            }}
          >
            <Picker columns={[allOptions.degree_options?.options || []]}>
              {(value) => (value ? value[0]?.label : "请选择学位")}
            </Picker>
          </Form.Item>
          <Form.Item name={["edu_info_list", index, "major"]} label="专业">
            <Input placeholder="请输入专业" />
          </Form.Item>
          <Form.Item
            name={["edu_info_list", index, "graduated_date"]}
            label="毕业时间"
            trigger="onConfirm"
            onClick={(e, datePickerRef) => {
              datePickerRef.current?.open();
            }}
          >
            <DatePicker>
              {(value) =>
                value ? dayjs(value).format("YYYY-MM-DD") : "请选择毕业时间"
              }
            </DatePicker>
          </Form.Item>
          <div className="flex justify-end mb-4">
            <Button
              color="danger"
              size="small"
              onClick={() => removeEducation(index)}
            >
              删除此教育经历
            </Button>
          </div>
        </div>
      ))}
      <div className="flex justify-center mt-2">
        <Button color="success" onClick={addEducation}>
          + 添加教育经历
        </Button>
      </div>
    </>
  );
};

export default EducationInfo;