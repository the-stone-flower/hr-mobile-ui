import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Radio,
  Picker,
  Toast,
  TextArea,
  Tabs,
} from "antd-mobile";
import { useAppDispatch, useAppSelector } from "./modules/store";
import { fetchOptions, optionsSelector } from "./modules/options/index";
// import './ApplicationForm.css';

const ApplicationForm: React.FC = () => {
  const [form] = Form.useForm();
  const [activeKey, setActiveKey] = useState("1");
  const dispatch = useAppDispatch();
  const { allOptions } = useAppSelector(optionsSelector);

  useEffect(() => {
    dispatch(fetchOptions("create_ext_user_options"));
  }, [dispatch]);

  const onFinish = (values: any) => {
    console.log("Form values:", values);
    Toast.show({
      icon: "success",
      content: "提交成功！",
    });
  };

  const renderBasicInfo = () => (
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
      >
        {allOptions.employment_options?.options?.[0].label}
        <Picker columns={[allOptions.employment_options?.options || []]}>
          {(value) => (value ? value[0]?.label : "请选择应聘岗位")}
        </Picker>
      </Form.Item>
      <Form.Item name="gender" label="性别">
        <Radio.Group>
          <Radio value="boy">男</Radio>
          <Radio value="girl">女</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item name="birthday" label="出生日期">
        <DatePicker>
          {(value) => (value ? value.toDateString() : "请选择出生日期")}
        </DatePicker>
      </Form.Item>
      <Form.Item name="age" label="年龄">
        <Input type="number" placeholder="请输入年龄" />
      </Form.Item>
      <Form.Item name="nation" label="民族">
        <Picker columns={[allOptions.nation_options?.options || []]}>
          {(value) => (value ? value[0]?.label : "请选择民族")}
        </Picker>
      </Form.Item>
      <Form.Item name="native_place" label="籍贯">
        <Input placeholder="请输入籍贯" />
      </Form.Item>
      <Form.Item name="political" label="政治面貌">
        <Picker columns={[allOptions.political_options?.options || []]}>
          {(value) => (value ? value[0]?.label : "请选择政治面貌")}
        </Picker>
      </Form.Item>
      <Form.Item name="join_party_date" label="入党时间">
        <DatePicker>
          {(value) => (value ? value.toDateString() : "请选择入党时间")}
        </DatePicker>
      </Form.Item>
      <Form.Item name="marital_status" label="婚姻状况">
        <Picker columns={[allOptions.marital_options?.options || []]}>
          {(value) => (value ? value[0]?.label : "请选择婚姻状况")}
        </Picker>
      </Form.Item>
      <Form.Item name="is_veteran" label="是否退役军人">
        <Radio.Group>
          <Radio value="true">是</Radio>
          <Radio value="false" className="ml-4">
            否
          </Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item name="physical_disability" label="残疾类型">
        <Picker
          columns={[allOptions.physical_disability_options?.options || []]}
        >
          {(value) => (value ? value[0]?.label : "请选择残疾类型")}
        </Picker>
      </Form.Item>
    </>
  );

  const renderContactInfo = () => (
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

  const renderEducationInfo = () => (
    <>
      <Form.Item
        name="education"
        label="学历"
        rules={[{ required: true, message: "请选择学历" }]}
      >
        <Picker columns={[allOptions.education_options?.options || []]}>
          {(value) => (value ? value[0]?.label : "请选择学历")}
        </Picker>
      </Form.Item>
      <Form.Item
        name="graduated"
        label="毕业学校"
        rules={[{ required: true, message: "请输入毕业学校" }]}
      >
        <Input placeholder="请输入毕业学校" />
      </Form.Item>
      <Form.Item name="degree" label="学位">
        <Picker columns={[allOptions.degree_options?.options || []]}>
          {(value) => (value ? value[0]?.label : "请选择学位")}
        </Picker>
      </Form.Item>
      <Form.Item name="major" label="专业">
        <Input placeholder="请输入专业" />
      </Form.Item>
      <Form.Item name="graduated_date" label="毕业时间">
        <DatePicker>
          {(value) => (value ? value.toDateString() : "请选择毕业时间")}
        </DatePicker>
      </Form.Item>
    </>
  );

  const renderWorkExperience = () => (
    <>
      <Form.Item
        name="company"
        label="工作单位"
        rules={[{ required: true, message: "请输入工作单位" }]}
      >
        <Input placeholder="请输入工作单位" />
      </Form.Item>
      <Form.Item
        name="start_date"
        label="开始日期"
        rules={[{ required: true, message: "请选择开始日期" }]}
      >
        <DatePicker>
          {(value) => (value ? value.toDateString() : "请选择开始日期")}
        </DatePicker>
      </Form.Item>
      <Form.Item name="end_date" label="结束日期">
        <DatePicker>
          {(value) => (value ? value.toDateString() : "请选择结束日期")}
        </DatePicker>
      </Form.Item>
      <Form.Item name="department" label="部门">
        <Input placeholder="请输入部门" />
      </Form.Item>
      <Form.Item name="job" label="职位">
        <Input placeholder="请输入职位" />
      </Form.Item>
      <Form.Item name="resp_achv" label="主要职责">
        <TextArea placeholder="请输入主要职责" />
      </Form.Item>
      <Form.Item name="referee" label="证明人">
        <Input placeholder="请输入证明人" />
      </Form.Item>
      <Form.Item name="referee_contact" label="证明人联系方式">
        <Input placeholder="请输入证明人联系方式" />
      </Form.Item>
    </>
  );

  const renderFamilyInfo = () => (
    <>
      <Form.Item
        name="relative_name"
        label="成员姓名"
        rules={[{ required: true, message: "请输入成员姓名" }]}
      >
        <Input placeholder="请输入成员姓名" />
      </Form.Item>
      <Form.Item
        name="relation"
        label="与本人关系"
        rules={[{ required: true, message: "请选择与本人关系" }]}
      >
        <Picker columns={[allOptions.relation_options?.options || []]}>
          {(value) => (value ? value[0]?.label : "请选择与本人关系")}
        </Picker>
      </Form.Item>
      <Form.Item
        name="is_cnpc_staff"
        label="中石油员工"
        rules={[{ required: true, message: "请选择是否为中石油员工" }]}
      >
        <Radio.Group>
          <Radio value="true">是</Radio>
          <Radio value="false">否</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item name="work_desc" label="职业">
        <Input placeholder="请输入职业" />
      </Form.Item>
      <Form.Item name="birthday" label="出生年月">
        <DatePicker>
          {(value) => (value ? value.toDateString() : "请选择出生年月")}
        </DatePicker>
      </Form.Item>
      <Form.Item name="work_type" label="工作单位">
        <Input placeholder="请输入工作单位" />
      </Form.Item>
      <Form.Item name="contact_way" label="联系电话">
        <Input placeholder="请输入联系电话" />
      </Form.Item>
      <Form.Item name="is_emergency_contact" label="紧急联系人">
        <Radio.Group>
          <Radio value="true">是</Radio>
          <Radio value="false">否</Radio>
        </Radio.Group>
      </Form.Item>
    </>
  );

  return (
    <div className="app-container">
      <div className="form-wrapper">
        <h1 className="form-title">入职登记表</h1>
        <Tabs activeKey={activeKey} onChange={setActiveKey}>
          <Tabs.Tab title="基本信息" key="1"></Tabs.Tab>
          <Tabs.Tab title="联系信息" key="2"></Tabs.Tab>
          <Tabs.Tab title="教育背景" key="3"></Tabs.Tab>
          <Tabs.Tab title="工作履历" key="4"></Tabs.Tab>
          <Tabs.Tab title="家庭信息" key="5"></Tabs.Tab>
        </Tabs>
        <Form
          form={form}
          onFinish={onFinish}
          footer={
            <Button block type="submit" color="primary" size="large">
              提交
            </Button>
          }
          className="app-form"
        >
          <div className="tab-content">
            {activeKey === "1" && renderBasicInfo()}
            {activeKey === "2" && renderContactInfo()}
            {activeKey === "3" && renderEducationInfo()}
            {activeKey === "4" && renderWorkExperience()}
            {activeKey === "5" && renderFamilyInfo()}
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ApplicationForm;
