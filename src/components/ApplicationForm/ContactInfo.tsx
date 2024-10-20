import React from "react";
import { Form, Input, TextArea } from "antd-mobile";
import { TabProps } from "./types";

const ContactInfo: React.FC<TabProps> = () => {
  return (
    <>
      <Form.Item name="email" label="邮箱">
        <Input placeholder="请输入邮箱" />
      </Form.Item>
      <Form.Item name="wechat" label="微信号">
        <Input placeholder="请输入微信号" />
      </Form.Item>
      <Form.Item name="family_address" label="现居地址">
        <TextArea placeholder="请输入现居地址" />
      </Form.Item>
      <Form.Item name="post_code" label="邮编">
        <Input placeholder="请输入邮编" />
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
      <Form.Item name="emergency_address" label="紧急联系人地址">
        <TextArea placeholder="请输入紧急联系人地址" />
      </Form.Item>
    </>
  );
};

export default ContactInfo;
