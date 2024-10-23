import React, { useState } from "react";
import { Form, Input, TextArea, CascadePicker } from "antd-mobile";
import { TabProps } from "./types";

const ContactInfo: React.FC<TabProps> = ({ form, allOptions }) => {
  const [familyVisible, setFamilyVisible] = useState(false);
  const [emergencyVisible, setEmergencyVisible] = useState(false);

  const areaData = allOptions.work_place_options?.options;

  // 处理现居地址的省市区选择
  const handleFamilyRegionChange = (val: string[], extend: any) => {
    const regionText = extend.items.map((item: any) => item.label).join("");
    const location = form.getFieldValue("family_location") || "";
    form.setFieldsValue({
      family_region: val,
      family_address: regionText + location,
    });
  };

  // 处理现居地址的详细地址输入
  const handleFamilyLocationChange = (value: string) => {
    const regionText =
      form
        .getFieldValue("family_region")
        ?.map((val: string, index: number) => {
          const level =
            index === 0
              ? areaData
              : index === 1
              ? areaData.find(
                  (p) => p.value === form.getFieldValue("family_region")[0]
                )?.children
              : areaData
                  .find(
                    (p) => p.value === form.getFieldValue("family_region")[0]
                  )
                  ?.children?.find(
                    (c) => c.value === form.getFieldValue("family_region")[1]
                  )?.children;
          return level?.find((item: any) => item.value === val)?.label || "";
        })
        .join("") || "";
    form.setFieldsValue({
      family_location: value,
      family_address: regionText + value,
    });
  };

  // 处理紧急联系人地址的省市区选择
  const handleEmergencyRegionChange = (val: string[], extend: any) => {
    const regionText = extend.items.map((item: any) => item.label).join("");
    const location = form.getFieldValue("emergency_location") || "";
    form.setFieldsValue({
      emergency_region: val,
      emergency_address: regionText + location,
    });
  };

  // 处理紧急联系人地址的详细地址输入
  const handleEmergencyLocationChange = (value: string) => {
    const regionText =
      form
        .getFieldValue("emergency_region")
        ?.map((val: string, index: number) => {
          const level =
            index === 0
              ? areaData
              : index === 1
              ? areaData.find(
                  (p) => p.value === form.getFieldValue("emergency_region")[0]
                )?.children
              : areaData
                  .find(
                    (p) => p.value === form.getFieldValue("emergency_region")[0]
                  )
                  ?.children?.find(
                    (c) => c.value === form.getFieldValue("emergency_region")[1]
                  )?.children;
          return level?.find((item: any) => item.value === val)?.label || "";
        })
        .join("") || "";
    form.setFieldsValue({
      emergency_location: value,
      emergency_address: regionText + value,
    });
  };

  return (
    <>
      <Form.Item name="email" label="电子邮箱">
        <Input placeholder="请输入电子邮箱" />
      </Form.Item>

      <Form.Item name="wechat" label="微信号">
        <Input placeholder="请输入微信号" />
      </Form.Item>

      {/* 现居地址 - 省市区选择 */}
      <Form.Item
        name="family_region"
        label="现居地区"
        trigger="onConfirm"
        onClick={() => {
          setFamilyVisible(true);
        }}
      >
        <CascadePicker
          options={areaData}
          visible={familyVisible}
          onClose={() => {
            setFamilyVisible(false);
          }}
          onConfirm={handleFamilyRegionChange}
        >
          {(items) => {
            if (items.every((item) => item === null)) {
              return "请选择省/市/区";
            }
            return items.map((item) => item?.label ?? "").join("/");
          }}
        </CascadePicker>
      </Form.Item>

      {/* 现居地址 - 详细地址 */}
      <Form.Item name="family_location" label="详细地址">
        <TextArea
          placeholder="请输入详细地址（如街道、楼牌号等）"
          onChange={handleFamilyLocationChange}
        />
      </Form.Item>

      {/* 隐藏的完整现居地址 */}
      <Form.Item name="family_address" hidden>
        <input type="hidden" />
      </Form.Item>

      <Form.Item name="post_code" label="邮政编码">
        <Input placeholder="请输入邮政编码" />
      </Form.Item>

      <Form.Item name="postal_address" label="固定通信地址">
        <TextArea placeholder="请输入固定通信地址" />
      </Form.Item>

      <Form.Item name="emergency_contact" label="紧急联系人">
        <Input placeholder="请输入紧急联系人" />
      </Form.Item>

      <Form.Item name="emergency_contact_relation" label="紧急联系人关系">
        <Input placeholder="请输入紧急联系人关系" />
      </Form.Item>

      <Form.Item name="emergency_contact_way" label="紧急联系人电话">
        <Input placeholder="请输入紧急联系人电话" />
      </Form.Item>

      {/* 紧急联系人地址 - 省市区选择 */}
      <Form.Item
        name="emergency_region"
        label="紧急联系人地区"
        trigger="onConfirm"
        onClick={() => {
          setEmergencyVisible(true);
        }}
      >
        <CascadePicker
          options={areaData}
          visible={emergencyVisible}
          onClose={() => {
            setEmergencyVisible(false);
          }}
          onConfirm={handleEmergencyRegionChange}
        >
          {(items) => {
            if (items.every((item) => item === null)) {
              return "请选择省/市/区";
            }
            return items.map((item) => item?.label ?? "").join("/");
          }}
        </CascadePicker>
      </Form.Item>

      {/* 紧急联系人地址 - 详细地址 */}
      <Form.Item name="emergency_location" label="紧急联系人详细地址">
        <TextArea
          placeholder="请输入详细地址（如街道、楼牌号等）"
          onChange={handleEmergencyLocationChange}
        />
      </Form.Item>

      {/* 隐藏的完整紧急联系人地址 */}
      <Form.Item name="emergency_address" hidden>
        <input type="hidden" />
      </Form.Item>
    </>
  );
};

export default ContactInfo;
