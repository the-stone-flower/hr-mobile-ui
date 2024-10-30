import React, { useState, useEffect } from 'react';
import { Form, Button, Toast, DatePicker, Input } from 'antd-mobile';
import { DownFill } from 'antd-mobile-icons';
import { useAppDispatch } from 'modules/store';
import { getSalaryDetails, ISalaryDetails } from 'modules/list/salary';
import SalaryInfo from './SalaryInfo';
import dayjs from 'dayjs';

const SalaryDetails: React.FC = () => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [salaryDetails, setSalaryDetails] = useState<ISalaryDetails | null>(null);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const dispatch = useAppDispatch();

  // 组件挂载时设置默认月份
  useEffect(() => {
    form.setFieldsValue({
      salary_date: dayjs().toDate(), // 设置当前月份为默认值
    });
  }, [form]);

  const onFinish = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();
      if (!values) return;

      const params = {
        ...values,
        salary_date: dayjs(values.salary_date).format('YYYY-MM-DD'),
      };

      const res = await dispatch(getSalaryDetails(params)).unwrap();
      setSalaryDetails(res);
      setIsSubmitted(true);
    } catch (errorInfo) {
      setSalaryDetails(null);
      Toast.show({
        icon: 'fail',
        content: '查询出错',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMonthChange = async (date: Date) => {
    const username = form.getFieldValue('username');
    const idNumber = form.getFieldValue('id_number');

    if (!username || !idNumber) {
      Toast.show({
        icon: 'fail',
        content: '请先填写姓名和身份证号！',
      });
      return;
    }

    setDatePickerVisible(false);
    form.setFieldValue('salary_date', date);

    const params = {
      ...form.getFieldsValue(true),
      salary_date: dayjs(date).format('YYYY-MM-DD'),
    };

    try {
      setIsSubmitting(true);
      const res = await dispatch(getSalaryDetails(params)).unwrap();
      setSalaryDetails(res);
    } catch (error) {
      setSalaryDetails(null);
      // Toast.show({
      //   icon: 'fail',
      //   content: '查询失败，请重试！',
      // });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='bg-gray-50 min-h-screen'>
      <div className='p-4'>
        {!isSubmitted ? (
          <>
            <h1 className='text-xl font-bold text-center mb-6'>工资查询</h1>
            <Form
              form={form}
              mode='card'
              onFinish={onFinish}
              initialValues={{
                salary_date: dayjs().toDate(), // 在Form层面也设置默认值
              }}
              footer={
                <Button
                  block
                  type='submit'
                  color='primary'
                  loading={isSubmitting}
                  size='large'
                  className='h-12'
                >
                  查询
                </Button>
              }
            >
              <Form.Header>请输入查询信息</Form.Header>
              <Form.Item name='username' label='姓名' rules={[{ required: true, message: '请输入姓名' }]}>
                <Input placeholder='请输入姓名' clearable />
              </Form.Item>

              <Form.Item
                name='id_number'
                label='身份证号'
                rules={[
                  { required: true, message: '请输入身份证号' },
                  { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入正确的身份证号' },
                ]}
              >
                <Input placeholder='请输入身份证号' clearable />
              </Form.Item>

              <Form.Item
                name='salary_date'
                label='工资月份'
                trigger='onConfirm'
                onClick={(e, datePickerRef) => {
                  datePickerRef.current?.open();
                }}
                rules={[{ required: true, message: '请选择工资月份' }]}
              >
                <DatePicker precision='month' max={new Date()}>
                  {(value) => (value ? dayjs(value).format('YYYY年MM月') : '请选择工资月份')}
                </DatePicker>
              </Form.Item>
            </Form>
          </>
        ) : (
          <div className='space-y-4'>
            <div className='flex items-center justify-between mb-[-8px]'>
              <div className='flex ml-2 justify-center items-center hover:bg-gray-100 cursor-pointer' onClick={() => setDatePickerVisible(true)}>
                <span className='text-md font-semibold'>
                  {dayjs(form.getFieldValue('salary_date')).format('YYYY年MM月')}
                </span>
                <DownFill className='text-gray-700 ml-1' />
              </div>

              <div className='flex justify-end mr-2 font-bold'>{salaryDetails?.employee_client}</div>
            </div>

            <DatePicker
              visible={datePickerVisible}
              onClose={() => setDatePickerVisible(false)}
              precision='month'
              value={form.getFieldValue('salary_date')}
              max={new Date()}
              onConfirm={handleMonthChange}
            />

            <SalaryInfo salaryDetails={salaryDetails} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SalaryDetails;
