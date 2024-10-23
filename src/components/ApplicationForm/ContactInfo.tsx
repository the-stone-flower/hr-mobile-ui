import React, { useState, useEffect } from "react";
import { Form, Input, TextArea, CascadePicker } from "antd-mobile";
import type {
  PickerValue,
  PickerValueExtend,
} from "antd-mobile/es/components/picker";
import { TabProps } from "./types";

// 地址解析正则表达式
const ADDRESS_REGEX =
  /^(北京市|天津市|上海市|重庆市|[\u4e00-\u9fa5]{2,}省|[\u4e00-\u9fa5]{2,}自治区)((?!市)[\u4e00-\u9fa5]{2,}区|[\u4e00-\u9fa5]{2,}市|[\u4e00-\u9fa5]{2,}县)?([\u4e00-\u9fa5]{2,}区|[\u4e00-\u9fa5]{2,}县)?(.+)?$/;

const ContactInfo: React.FC<TabProps> = ({ form, allOptions }) => {
  // 控制省市区选择器的显示
  const [familyVisible, setFamilyVisible] = useState(false);
  const [emergencyVisible, setEmergencyVisible] = useState(false);

  // 前端管理的地址字段
  const [familyRegion, setFamilyRegion] = useState<string[]>([]);
  const [familyLocation, setFamilyLocation] = useState("");
  const [emergencyRegion, setEmergencyRegion] = useState<string[]>([]);
  const [emergencyLocation, setEmergencyLocation] = useState("");

  const areaData = allOptions.work_place_options?.options;

  // 判断是否是直辖市
  const isDirectCity = (province: string) => {
    return ["北京市", "上海市", "天津市", "重庆市"].includes(province);
  };

  // 地址解析函数
  const parseAddress = (address: string) => {
    const match = address.match(ADDRESS_REGEX);
    if (match) {
      const [, province, city, district, detail] = match;

      if (isDirectCity(province)) {
        // 直辖市返回两级地址
        return {
          region: [province, city],
          location: detail?.trim() || "",
        };
      } else {
        // 普通省份返回三级地址
        return {
          region: [province, city, district],
          location: detail?.trim() || "",
        };
      }
    }
    return null;
  };

  // 监听现居地址变化
  useEffect(() => {
    const family_address = form.getFieldValue("family_address");
    if (family_address) {
      const parsed = parseAddress(family_address);
      if (parsed) {
        setFamilyRegion(parsed.region);
        setFamilyLocation(parsed.location);
      }
    }
  }, [form.getFieldValue("family_address")]);

  // 监听紧急联系人地址变化
  useEffect(() => {
    const emergency_address = form.getFieldValue("emergency_address");
    if (emergency_address) {
      const parsed = parseAddress(emergency_address);
      if (parsed) {
        setEmergencyRegion(parsed.region);
        setEmergencyLocation(parsed.location);
      }
    }
  }, [form.getFieldValue("emergency_address")]);

  // 处理现居地址的省市区选择
  const handleFamilyRegionChange = (
    val: PickerValue[],
    extend: PickerValueExtend
  ) => {
    setFamilyRegion(val as string[]);
    form.setFieldsValue({
      family_address: (val as string[]).join("") + familyLocation,
    });
  };

  // 处理现居地址的详细地址输入
  const handleFamilyLocationChange = (value: string) => {
    setFamilyLocation(value);
    form.setFieldsValue({
      family_address: familyRegion.join("") + value,
    });
  };

  // 处理紧急联系人地址的省市区选择
  const handleEmergencyRegionChange = (
    val: PickerValue[],
    extend: PickerValueExtend
  ) => {
    setEmergencyRegion(val as string[]);
    form.setFieldsValue({
      emergency_address: (val as string[]).join("") + emergencyLocation,
    });
  };

  // 处理紧急联系人地址的详细地址输入
  const handleEmergencyLocationChange = (value: string) => {
    setEmergencyLocation(value);
    form.setFieldsValue({
      emergency_address: emergencyRegion.join("") + value,
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
          value={familyRegion}
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
      <Form.Item label="详细地址">
        <TextArea
          placeholder="请输入详细地址（如街道、楼牌号等）"
          value={familyLocation}
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
          value={emergencyRegion}
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
      <Form.Item label="紧急联系人详细地址">
        <TextArea
          placeholder="请输入详细地址（如街道、楼牌号等）"
          value={emergencyLocation}
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
