import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Radio,
  Picker,
  CascadePicker,
  Toast,
  TextArea,
  Tabs,
} from "antd-mobile";
import { useAppDispatch, useAppSelector } from "./modules/store";
import { fetchOptions, optionsSelector } from "./modules/options/index";
import dayjs from "dayjs";
import { addListItem } from "./modules/list/recruit";

const ApplicationForm: React.FC = () => {
  const [form] = Form.useForm();
  const [activeKey, setActiveKey] = useState("1");
  const dispatch = useAppDispatch();
  const { allOptions } = useAppSelector(optionsSelector);

  useEffect(() => {
    dispatch(fetchOptions("create_ext_user_options"));
  }, [dispatch]);

  const fieldNames = {
    "1": [
      "name",
      "id_number",
      "contact_way",
      "employment",
      "gender",
      "birthday",
      "age",
      "nation",
      "native_place",
      "political",
      "join_party_date",
      "marital_status",
      "is_veteran",
      "physical_disability",
    ],
    "2": [
      "email",
      "wechat",
      "family_address",
      "post_code",
      "postal_address",
      "emergency_contact",
      "emergency_contact_relation",
      "emergency_contact_way",
      "emergency_address",
    ],
    "3": ["education", "graduated", "degree", "major", "graduated_date"],
    "4": [
      "company",
      "start_date",
      "end_date",
      "department",
      "job",
      "resp_achv",
      "referee",
      "referee_contact",
    ],
    "5": [
      "relative_name",
      "relation",
      "is_cnpc_staff",
      "work_desc",
      "birthday",
      "work_type",
      // "contact_way",
      "is_emergency_contact",
    ],
  };

  const handleTabChange = async (key: string) => {
    try {
      await form.validateFields(
        fieldNames[activeKey as keyof typeof fieldNames]
      );
      setActiveKey(key);
    } catch (errorInfo) {
      console.log("Validation Failed:", errorInfo);
      Toast.show({
        icon: "fail",
        content: "请填写当前页面的所有必填字段！",
      });
    }
  };

  const onFinish = async () => {
    try {
      // 验证所有字段
      const values = await form.validateFields();
      console.log("Form values:", values);

      const keys = Object.keys(values);
      let payload = values;
      if (keys.includes("physical_disability") && values.physical_disability) {
        payload = {
          ...values,
          physical_disability: values.physical_disability?.[1],
        };
      }

      await dispatch(addListItem({ ...payload })).unwrap();
      Toast.show({
        icon: "success",
        content: "提交成功！",
      });
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
      Toast.show({
        icon: "fail",
        content: "请填写所有必填字段！",
      });
    }
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
          {allOptions.gender_options?.options?.map((option) => (
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
              (item, index) => ({ ...item, value: String(index) })
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
        trigger="onConfirm"
        onClick={(e, pickerRef) => {
          pickerRef.current?.open();
        }}
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
      <Form.Item
        name="degree"
        label="学位"
        trigger="onConfirm"
        onClick={(e, pickerRef) => {
          pickerRef.current?.open();
        }}
      >
        <Picker columns={[allOptions.degree_options?.options || []]}>
          {(value) => (value ? value[0]?.label : "请选择学位")}
        </Picker>
      </Form.Item>
      <Form.Item name="major" label="专业">
        <Input placeholder="请输入专业" />
      </Form.Item>
      <Form.Item
        name="graduated_date"
        label="毕业时间"
        trigger="onConfirm"
        onClick={(e, datePickerRef) => {
          datePickerRef.current?.open();
        }}
      >
        <DatePicker>
          {(value) =>
            value ? dayjs(value).format("YYYY-MM-DD") : "请选择毕业时间"
          }
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
        name="end_date"
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
      <Form.Item
        name="birthday"
        label="出生年月"
        trigger="onConfirm"
        onClick={(e, datePickerRef) => {
          datePickerRef.current?.open();
        }}
      >
        <DatePicker>
          {(value) =>
            value ? dayjs(value).format("YYYY-MM-DD") : "请选择出生年月"
          }
        </DatePicker>
      </Form.Item>
      <Form.Item name="work_type" label="工作单位">
        <Input placeholder="请输入工作单位" />
      </Form.Item>
      {/* <Form.Item name="contact_way" label="联系电话">
        <Input placeholder="请输入联系电话" />
      </Form.Item> */}
      <Form.Item name="is_emergency_contact" label="紧急联系人">
        <Radio.Group>
          <Radio value="true">是</Radio>
          <Radio value="false">否</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item>
        <Button
          block
          type="submit"
          color="primary"
          size="large"
          onClick={onFinish}
        >
          提交
        </Button>
      </Form.Item>
    </>
  );

  return (
    <div className="app-container">
      <div className="form-wrapper">
        <h1 className="form-title">入职登记表</h1>
        <Form form={form}>
          <Tabs activeKey={activeKey} onChange={handleTabChange}>
            <Tabs.Tab title="基本信息" key="1">
              {renderBasicInfo()}
            </Tabs.Tab>
            <Tabs.Tab title="联系信息" key="2">
              {renderContactInfo()}
            </Tabs.Tab>
            <Tabs.Tab title="教育背景" key="3">
              {renderEducationInfo()}
            </Tabs.Tab>
            <Tabs.Tab title="工作履历" key="4">
              {renderWorkExperience()}
            </Tabs.Tab>
            <Tabs.Tab title="家庭信息" key="5">
              {renderFamilyInfo()}
            </Tabs.Tab>
          </Tabs>
        </Form>
      </div>
    </div>
  );
};

export default ApplicationForm;
