import React, { useState } from "react";
import { Form, Input, DatePicker, TextArea, Button } from "antd-mobile";
import { TabProps } from "./types";
import dayjs from "dayjs";

interface WorkRecord {
  company: string;
  start_date: string;
  end_date: string;
  department: string;
  job: string;
  resp_achv: string;
  referee: string;
  referee_contact: string;
}

const WorkExperience: React.FC<TabProps> = ({ form }) => {
  const [localWorkList, setLocalWorkList] = useState<WorkRecord[]>([]);

  // 使用表单值来控制工作经历列表的显示，如果没有表单值则使用本地状态
  const getWorkList = () => {
    const formWorkList = form.getFieldValue("workexp_info_list");
    return formWorkList || localWorkList;
  };

  // 处理添加工作经历
  const handleAddWork = () => {
    const newList = [...getWorkList(), {}];
    setLocalWorkList(newList);
  };

  // 处理删除工作经历
  const handleRemoveWork = (index: number) => {
    const currentList = getWorkList();
    const newList = currentList.filter((_: any, i: number) => i !== index);
    setLocalWorkList(newList);
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

  return (
    <>
      {getWorkList().map((_: any, index: number) => (
        <div key={index}>
          <h4 className="font-bold ml-2 my-2">工作经历 {index + 1}</h4>
          <Form.Item
            name={["workexp_info_list", String(index), "work_unit"]}
            label="工作单位"
            rules={[{ required: true, message: "请输入工作单位" }]}
          >
            <Input placeholder="请输入工作单位" />
          </Form.Item>

          <Form.Item
            name={["workexp_info_list", String(index), "start_date"]}
            label="开始日期"
            rules={[{ required: true, message: "请选择开始日期" }]}
            trigger="onConfirm"
            onClick={(e, datePickerRef) => {
              datePickerRef.current?.open();
            }}
          >
            <DatePicker>
              {(value) =>
                getDateDisplayText(
                  value,
                  ["workexp_info_list", String(index), "start_date"],
                  "请选择开始日期"
                )
              }
            </DatePicker>
          </Form.Item>

          <Form.Item
            name={["workexp_info_list", String(index), "end_date"]}
            label="结束日期"
            trigger="onConfirm"
            onClick={(e, datePickerRef) => {
              datePickerRef.current?.open();
            }}
          >
            <DatePicker>
              {(value) =>
                getDateDisplayText(
                  value,
                  ["workexp_info_list", String(index), "end_date"],
                  "请选择结束日期"
                )
              }
            </DatePicker>
          </Form.Item>

          <Form.Item
            name={["workexp_info_list", String(index), "department"]}
            label="部门"
          >
            <Input placeholder="请输入部门" />
          </Form.Item>

          <Form.Item
            name={["workexp_info_list", String(index), "job"]}
            label="职位"
          >
            <Input placeholder="请输入职位" />
          </Form.Item>

          <Form.Item
            name={["workexp_info_list", String(index), "resp_achv"]}
            label="主要职责"
          >
            <TextArea placeholder="请输入主要职责" />
          </Form.Item>

          <Form.Item
            name={["workexp_info_list", String(index), "referee"]}
            label="证明人"
          >
            <Input placeholder="请输入证明人" />
          </Form.Item>

          <Form.Item
            name={["workexp_info_list", String(index), "referee_contact"]}
            label="证明人联系方式"
          >
            <Input placeholder="请输入证明人联系方式" />
          </Form.Item>

          <div className="flex justify-end mb-4">
            <Button
              color="danger"
              size="small"
              onClick={() => handleRemoveWork(index)}
            >
              删除此工作经历
            </Button>
          </div>
        </div>
      ))}
      <div className="flex justify-center mt-2">
        <Button color="success" onClick={handleAddWork}>
          + 添加工作经历
        </Button>
      </div>
    </>
  );
};

export default WorkExperience;
