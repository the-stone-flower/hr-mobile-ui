import React, { useState, useEffect } from "react";
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

const defaultWork: WorkRecord = {
  company: "",
  start_date: "",
  end_date: "",
  department: "",
  job: "",
  resp_achv: "",
  referee: "",
  referee_contact: "",
};

const WorkExperience: React.FC<TabProps> = ({ form }) => {
  const [workList, setWorkList] = useState<WorkRecord[]>([]);

  // 监听表单中工作经历列表的变化
  useEffect(() => {
    const workexp_info_list = form.getFieldValue('workexp_info_list');
    if (workexp_info_list && workexp_info_list.length > 0) {
      setWorkList(workexp_info_list);
    }
  }, [form]);

  const addWork = () => {
    const newList = [...workList, defaultWork];
    setWorkList(newList);
  };

  const removeWork = (index: number) => {
    const newList = workList.filter((_, i) => i !== index);
    setWorkList(newList);
    // // 更新表单数据
    // const workexp_info_list = form.getFieldValue('workexp_info_list') || [];
    // workexp_info_list.splice(index, 1);
    // form.setFieldsValue({ workexp_info_list });
  };

  return (
    <>
      {workList.map((_, index) => (
        <div key={index}>
          <h4 className="font-bold ml-2 my-2">工作经历 {index + 1}</h4>
          <Form.Item
            name={["workexp_info_list", index, "work_unit"]}
            label="工作单位"
            rules={[{ required: true, message: "请输入工作单位" }]}
          >
            <Input placeholder="请输入工作单位" />
          </Form.Item>
          <Form.Item
            name={["workexp_info_list", index, "start_date"]}
            label="开始日期"
            rules={[{ required: true, message: "请选择开始日期" }]}
            trigger="onConfirm"
            onClick={(e, datePickerRef) => {
              datePickerRef.current?.open();
            }}
          >
            <DatePicker>
              {(value) =>
                value ? dayjs(value).format("YYYY-MM-DD") : "请选择开始日期"
              }
            </DatePicker>
          </Form.Item>
          <Form.Item
            name={["workexp_info_list", index, "end_date"]}
            label="结束日期"
            trigger="onConfirm"
            onClick={(e, datePickerRef) => {
              datePickerRef.current?.open();
            }}
          >
            <DatePicker>
              {(value) =>
                value ? dayjs(value).format("YYYY-MM-DD") : "请选择结束日期"
              }
            </DatePicker>
          </Form.Item>
          <Form.Item
            name={["workexp_info_list", index, "department"]}
            label="部门"
          >
            <Input placeholder="请输入部门" />
          </Form.Item>
          <Form.Item 
            name={["workexp_info_list", index, "job"]} 
            label="职位"
          >
            <Input placeholder="请输入职位" />
          </Form.Item>
          <Form.Item
            name={["workexp_info_list", index, "resp_achv"]}
            label="主要职责"
          >
            <TextArea placeholder="请输入主要职责" />
          </Form.Item>
          <Form.Item
            name={["workexp_info_list", index, "referee"]}
            label="证明人"
          >
            <Input placeholder="请输入证明人" />
          </Form.Item>
          <Form.Item
            name={["workexp_info_list", index, "referee_contact"]}
            label="证明人联系方式"
          >
            <Input placeholder="请输入证明人联系方式" />
          </Form.Item>
          <div className="flex justify-end mb-4">
            <Button
              color="danger"
              size="small"
              onClick={() => removeWork(index)}
            >
              删除此工作经历
            </Button>
          </div>
        </div>
      ))}
      <div className="flex justify-center mt-2">
        <Button color="success" onClick={addWork}>
          + 添加工作经历
        </Button>
      </div>
    </>
  );
};

export default WorkExperience;
