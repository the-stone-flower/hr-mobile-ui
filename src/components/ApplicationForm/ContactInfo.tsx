import React, { useState, useEffect } from "react";
import { Form, Input, TextArea, CascadePicker } from "antd-mobile";
import type {
  PickerValue,
  PickerValueExtend,
} from "antd-mobile/es/components/picker";
import { TabProps } from "./types";

// 更新后的地址正则表达式
const ADDRESS_REGEX =
  /(?<province>[^省]+省|[^自治区]+自治区|.+市)(?<city>[^自治州]+自治州|.+区划|[^市]+市|.+区)?(?<county>[^市]+市|[^县]+县|[^旗]+旗|.+区)?(?<town>[^区]+区|.+镇)?(?<village>.*)/;

const ContactInfo: React.FC<TabProps> = ({ form, allOptions }) => {
  // 控制省市区选择器的显示
  const [familyVisible, setFamilyVisible] = useState(false);
  const [emergencyVisible, setEmergencyVisible] = useState(false);
  const [postalVisible, setPostalVisible] = useState(false);

  // 前端管理的地址字段
  const [familyRegion, setFamilyRegion] = useState<string[]>([]);
  const [familyLocation, setFamilyLocation] = useState("");
  const [emergencyRegion, setEmergencyRegion] = useState<string[]>([]);
  const [emergencyLocation, setEmergencyLocation] = useState("");
  const [postalRegion, setPostalRegion] = useState<string[]>([]);
  const [postalLocation, setPostalLocation] = useState("");

  const areaData = allOptions?.work_place_options?.options || [];

  // 地址解析函数
  const parseAddress = (address: string) => {
    const match = address.match(ADDRESS_REGEX);
    if (match?.groups) {
      const { province, city, county, town, village } = match.groups;

      // 判断是否是直辖市
      const isDirectCity = ["北京市", "上海市", "天津市", "重庆市"].includes(
        province
      );

      if (isDirectCity) {
        // 直辖市返回两级地址：市-区
        return {
          region: [province, city || county || ""],
          location: [town, village].filter(Boolean).join(""),
        };
      } else {
        // 普通省份返回三级地址：省-市-区/县
        return {
          region: [province, city || "", county || ""].filter(Boolean),
          location: [town, village].filter(Boolean).join(""),
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
    const address = val.join("");
    form.setFieldsValue({
      family_address: address + familyLocation,
    });
  };

  // 处理现居地址的详细地址输入
  const handleFamilyLocationChange = (value: string) => {
    setFamilyLocation(value);
    const address = familyRegion.join("");
    form.setFieldsValue({
      family_address: address + value,
    });
  };

  // 处理紧急联系人地址的省市区选择
  const handleEmergencyRegionChange = (
    val: PickerValue[],
    extend: PickerValueExtend
  ) => {
    setEmergencyRegion(val as string[]);
    const address = val.join("");
    form.setFieldsValue({
      emergency_address: address + emergencyLocation,
    });
  };

  // 处理紧急联系人地址的详细地址输入
  const handleEmergencyLocationChange = (value: string) => {
    setEmergencyLocation(value);
    const address = emergencyRegion.join("");
    form.setFieldsValue({
      emergency_address: address + value,
    });
  };

  // 处理固定通信地址的省市区选择
  const handlePostalRegionChange = (val: PickerValue[], extend: PickerValueExtend) => {
    setPostalRegion(val as string[]);
    const address = val.join("");
    form.setFieldsValue({
      postal_address: address + postalLocation,
    });
  }

  // 处理固定通信地址的详细地址输入
  const handlePostalLocationChange = (value: string) => {
    setPostalLocation(value);
    const address = postalRegion.join("");
    form.setFieldsValue({
      postal_address: address + value
    });
  }

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
          {(items, name) => {
            if (items.every((item) => item === null)) {
              return "请选择省/市/区";
            }
            const selectedAddress = familyRegion.join("/");
            return selectedAddress || "请选择省/市/区";
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

      {/* 固定通信地址 - 省市区选择 */}
      <Form.Item
        label="固定通信地址"
        trigger="onConfirm"
        onClick={() => {
          setPostalVisible(true);
        }}
      >
        <CascadePicker
          options={areaData}
          visible={postalVisible}
          onClose={() => {
            setPostalVisible(false);
          }}
          value={postalRegion}
          onConfirm={handlePostalRegionChange}
        >
          {(items, name) => {
            if (items.every((item) => item === null)) {
              return "请选择省/市/区";
            }
            const selectedAddress = postalRegion.join("/");
            return selectedAddress || "请选择省/市/区";
          }}
        </CascadePicker>
      </Form.Item>

      {/* 固定通信地址 - 详细地址 */}
      <Form.Item label="详细地址">
        <TextArea
          placeholder="请输入详细地址（如街道、楼牌号等）"
          value={postalLocation}
          onChange={handlePostalLocationChange}
        />
      </Form.Item>

      {/* 隐藏固定通信地址 */}
      <Form.Item name="postal_address" label="固定通信地址" hidden>
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
            const selectedAddress = emergencyRegion.join("/");
            return selectedAddress || "请选择省/市/区";
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
