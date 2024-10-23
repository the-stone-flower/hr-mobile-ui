import React, { useState, useEffect } from "react";
import { Form, Input, Radio, Picker, DatePicker, Button } from "antd-mobile";
import { TabProps } from "./types";
import dayjs from "dayjs";

interface FamilyRecord {
  relative_name: string;
  relation: string;
  is_cnpc_staff: string;
  occupation: string;
  birthday: string;
  work_unit: string;
  contact_way: string;
  is_emergency_contact: string;
}

const defaultFamily: FamilyRecord = {
  relative_name: "",
  relation: "",
  is_cnpc_staff: "",
  occupation: "",
  birthday: "",
  work_unit: "",
  contact_way: "",
  is_emergency_contact: "",
};

const FamilyInfo: React.FC<TabProps> = ({ form, allOptions }) => {
  const [familyList, setFamilyList] = useState<FamilyRecord[]>([]);

  // 监听表单中家庭成员列表的变化
  useEffect(() => {
    const social_info_list = form.getFieldValue('social_info_list');
    if (social_info_list && social_info_list.length > 0) {
      setFamilyList(social_info_list);
    }
  }, [form]);

  const addFamily = () => {
    const newList = [...familyList, defaultFamily];
    setFamilyList(newList);
  };

  const removeFamily = (index: number) => {
    const newList = familyList.filter((_, i) => i !== index);
    setFamilyList(newList);
    // // 更新表单数据
    // const social_info_list = form.getFieldValue('social_info_list') || [];
    // social_info_list.splice(index, 1);
    // form.setFieldsValue({ social_info_list });
  };

  return (
    <>
      {familyList.map((_, index) => (
        <div key={index}>
          <h4 className="font-bold ml-2 my-2">家庭成员 {index + 1}</h4>
          <Form.Item
            name={["social_info_list", index, "relative_name"]}
            label="成员姓名"
            rules={[{ required: true, message: "请输入成员姓名" }]}
          >
            <Input placeholder="请输入成员姓名" />
          </Form.Item>
          <Form.Item
            name={["social_info_list", index, "relation"]}
            label="与本人关系"
            rules={[{ required: true, message: "请选择与本人关系" }]}
            trigger="onConfirm"
            onClick={(e, pickerRef) => {
              pickerRef.current?.open();
            }}
          >
            <Picker columns={[allOptions.relation_options?.options || []]}>
              {(value) => (value ? value[0]?.label : "请选择与本人关系")}
            </Picker>
          </Form.Item>
          <Form.Item
            name={["social_info_list", index, "is_cnpc_staff"]}
            label="中石油员工"
            rules={[{ required: true, message: "请选择是否为中石油员工" }]}
          >
            <Radio.Group>
              <Radio value="true">是</Radio>
              <Radio value="false">否</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name={["social_info_list", index, "occupation"]}
            label="职业"
          >
            <Input placeholder="请输入职业" />
          </Form.Item>
          <Form.Item
            name={["social_info_list", index, "birthday"]}
            label="出生年月"
            trigger="onConfirm"
            onClick={(e, datePickerRef) => {
              datePickerRef.current?.open();
            }}
          >
            <DatePicker
              min={new Date(1924, 0, 1)} // 设置为100年前
              max={new Date()} // 设置到当前时间
              precision="day" // 精确到天
            >
              {(value) =>
                value ? dayjs(value).format("YYYY-MM-DD") : "请选择出生年月"
              }
            </DatePicker>
          </Form.Item>
          <Form.Item
            name={["social_info_list", index, "work_unit"]}
            label="工作单位"
          >
            <Input placeholder="请输入工作单位" />
          </Form.Item>
          <Form.Item
            name={["social_info_list", index, "contact_way"]}
            label="联系电话"
          >
            <Input placeholder="请输入联系电话" />
          </Form.Item>
          <Form.Item
            name={["social_info_list", index, "is_emergency_contact"]}
            label="紧急联系人"
          >
            <Radio.Group>
              <Radio value="true">是</Radio>
              <Radio value="false">否</Radio>
            </Radio.Group>
          </Form.Item>
          <div className="flex justify-end mb-4">
            <Button
              color="danger"
              size="small"
              onClick={() => removeFamily(index)}
            >
              删除此家庭成员
            </Button>
          </div>
        </div>
      ))}
      <div className="flex justify-center mt-2">
        <Button color="success" onClick={addFamily}>
          + 添加家庭成员
        </Button>
      </div>
    </>
  );
};

export default FamilyInfo;
