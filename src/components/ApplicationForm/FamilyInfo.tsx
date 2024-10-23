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

interface PickerOption {
  label: string;
  value: string | number;
}

const FamilyInfo: React.FC<TabProps> = ({ form, allOptions }) => {
  const [localFamilyList, setLocalFamilyList] = useState<FamilyRecord[]>([]);

  // 监听表单值变化，设置初始值
  useEffect(() => {
    const formFamilyList = form.getFieldValue("social_info_list");
    if (formFamilyList && Array.isArray(formFamilyList)) {
      setLocalFamilyList(formFamilyList);
    }
  }, [form.getFieldValue("social_info_list")]);

  // 处理添加家庭成员
  const handleAddFamily = () => {
    setLocalFamilyList([...localFamilyList, {}]);
  };

  // 处理删除家庭成员
  const handleRemoveFamily = (index: number) => {
    const newList = localFamilyList.filter((_: any, i: number) => i !== index);
    setLocalFamilyList(newList);
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

  return (
    <>
      {localFamilyList.map((_: any, index: number) => (
        <div key={index}>
          <h4 className="font-bold ml-2 my-2">家庭成员 {index + 1}</h4>
          <Form.Item
            name={["social_info_list", String(index), "relative_name"]}
            label="成员姓名"
            rules={[{ required: true, message: "请输入成员姓名" }]}
          >
            <Input placeholder="请输入成员姓名" />
          </Form.Item>

          <Form.Item
            name={["social_info_list", String(index), "relation"]}
            label="与本人关系"
            rules={[{ required: true, message: "请选择与本人关系" }]}
            trigger="onConfirm"
            onClick={(e, pickerRef) => {
              pickerRef.current?.open();
            }}
          >
            <Picker columns={[allOptions.relation_options?.options || []]}>
              {(value) =>
                getPickerDisplayText(
                  value,
                  allOptions.relation_options?.options || [],
                  "请选择与本人关系",
                  ["social_info_list", String(index), "relation"]
                )
              }
            </Picker>
          </Form.Item>

          <Form.Item
            name={["social_info_list", String(index), "is_cnpc_staff"]}
            label="中石油员工"
            rules={[{ required: true, message: "请选择是否为中石油员工" }]}
          >
            <Radio.Group>
              <Radio value="true">是</Radio>
              <Radio value="false">否</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name={["social_info_list", String(index), "occupation"]}
            label="职业"
          >
            <Input placeholder="请输入职业" />
          </Form.Item>

          <Form.Item
            name={["social_info_list", String(index), "birthday"]}
            label="出生年月"
            trigger="onConfirm"
            onClick={(e, datePickerRef) => {
              datePickerRef.current?.open();
            }}
          >
            <DatePicker
              min={new Date(1924, 0, 1)}
              max={new Date()}
              precision="day"
            >
              {(value) =>
                getDateDisplayText(
                  value,
                  ["social_info_list", String(index), "birthday"],
                  "请选择出生年月"
                )
              }
            </DatePicker>
          </Form.Item>

          <Form.Item
            name={["social_info_list", String(index), "work_unit"]}
            label="工作单位"
          >
            <Input placeholder="请输入工作单位" />
          </Form.Item>

          <Form.Item
            name={["social_info_list", String(index), "contact_way"]}
            label="联系电话"
          >
            <Input placeholder="请输入联系电话" />
          </Form.Item>

          <Form.Item
            name={["social_info_list", String(index), "is_emergency_contact"]}
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
              onClick={() => handleRemoveFamily(index)}
            >
              删除此家庭成员
            </Button>
          </div>
        </div>
      ))}
      <div className="flex justify-center mt-2">
        <Button color="success" onClick={handleAddFamily}>
          + 添加家庭成员
        </Button>
      </div>
    </>
  );
};

export default FamilyInfo;
