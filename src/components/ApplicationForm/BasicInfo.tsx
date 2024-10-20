import React from "react";
import {
  Form,
  Input,
  Radio,
  Picker,
  DatePicker,
  CascadePicker,
} from "antd-mobile";
import { TabProps } from "./types";
import dayjs from "dayjs";

const BasicInfo: React.FC<TabProps> = ({ form, allOptions }) => {
  return (
    <>
      <Form.Item
        name="name"
        label="姓名"
        rules={[{ required: true, message: "请输入姓名" }]}
      >
        <Input placeholder="请输入姓名" />
      </Form.Item>
      <Form.Item
        name="id_number"
        label="身份证号码"
        rules={[{ required: true, message: "请输入身份证号码" }]}
      >
        <Input placeholder="请输入身份证号码" />
      </Form.Item>
      <Form.Item
        name="contact_way"
        label="手机号"
        rules={[{ required: true, message: "请输入手机号" }]}
      >
        <Input placeholder="请输入手机号" />
      </Form.Item>
      <Form.Item
        name="employment"
        label="应聘岗位"
        rules={[{ required: true, message: "请选择应聘岗位" }]}
        trigger="onConfirm"
        onClick={(e, pickerRef) => {
          pickerRef.current?.open();
        }}
      >
        <Picker columns={[allOptions.employment_options?.options || []]}>
          {(value) => (value ? value[0]?.label : "请选择应聘岗位")}
        </Picker>
      </Form.Item>
      <Form.Item name="gender" label="性别">
        <Radio.Group>
          {allOptions.gender_options?.options?.map((option: any) => (
            <Radio key={option.value} value={option.value}>
              {option.label}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>
      <Form.Item
        name="birthday"
        label="出生日期"
        trigger="onConfirm"
        onClick={(e, datePickerRef) => {
          datePickerRef.current?.open();
        }}
      >
        <DatePicker>
          {(value) =>
            value ? dayjs(value).format("YYYY-MM-DD") : "请选择出生日期"
          }
        </DatePicker>
      </Form.Item>
      <Form.Item name="age" label="年龄">
        <Input type="number" placeholder="请输入年龄" />
      </Form.Item>
      <Form.Item
        name="nation"
        label="民族"
        trigger="onConfirm"
        onClick={(e, pickerRef) => {
          pickerRef.current?.open();
        }}
      >
        <Picker columns={[allOptions.nation_options?.options || []]}>
          {(value) => (value ? value[0]?.label : "请选择民族")}
        </Picker>
      </Form.Item>
      <Form.Item name="native_place" label="籍贯">
        <Input placeholder="请输入籍贯" />
      </Form.Item>
      <Form.Item
        name="political"
        label="政治面貌"
        trigger="onConfirm"
        onClick={(e, pickerRef) => {
          pickerRef.current?.open();
        }}
      >
        <Picker columns={[allOptions.political_options?.options || []]}>
          {(value) => (value ? value[0]?.label : "请选择政治面貌")}
        </Picker>
      </Form.Item>
      <Form.Item
        name="join_party_date"
        label="入党时间"
        trigger="onConfirm"
        onClick={(e, datePickerRef) => {
          datePickerRef.current?.open();
        }}
      >
        <DatePicker>
          {(value) =>
            value ? dayjs(value).format("YYYY-MM-DD") : "请选择入党时间"
          }
        </DatePicker>
      </Form.Item>
      <Form.Item
        name="marital_status"
        label="婚姻状况"
        trigger="onConfirm"
        onClick={(e, pickerRef) => {
          pickerRef.current?.open();
        }}
      >
        <Picker columns={[allOptions.marital_options?.options || []]}>
          {(value) => (value ? value[0]?.label : "请选择婚姻状况")}
        </Picker>
      </Form.Item>
      <Form.Item name="is_veteran" label="是否退役军人">
        <Radio.Group>
          <Radio value="true">是</Radio>
          <Radio value="false">否</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        name="physical_disability"
        label="残疾类型"
        trigger="onConfirm"
        onClick={(e, pickerRef) => {
          pickerRef.current?.open();
        }}
      >
        <CascadePicker
          title="残疾类型"
          options={
            allOptions.physical_disability_options?.options?.map(
              (item: any, index: number) => ({ ...item, value: String(index) })
            ) || []
          }
          onConfirm={(val, extend) => {
            console.log("onConfirm", val, extend.items);
            form.setFieldsValue({ physical_disability: val });
          }}
          onSelect={(val) => {
            console.log("onSelect", val);
          }}
        >
          {(items) => {
            if (!items.length) return "请选择残疾类型";
            return items.map((item: any) => item?.label)?.join(" - ");
          }}
        </CascadePicker>
      </Form.Item>
    </>
  );
};

export default BasicInfo;
