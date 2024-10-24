import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, TextArea, Button } from 'antd-mobile';
import { TabProps } from './types';
import dayjs from 'dayjs';

interface WorkRecord {
  company: string;
  start_date: string;
  end_date: string;
  department: string;
  position: string;
  resp_achv: string;
  referee: string;
  referee_contact: string;
}

const WorkExperience: React.FC<TabProps> = ({ form }) => {
  const [localWorkList, setLocalWorkList] = useState<WorkRecord[]>([]);

  // 监听表单值变化，设置初始值
  useEffect(() => {
    const formWorkList = form.getFieldValue('workexp_info_list');

    if (formWorkList && Array.isArray(formWorkList)) {
      setLocalWorkList(formWorkList);
    }
  }, [form.getFieldValue('workexp_info_list')]);

  // 处理添加工作经历
  const handleAddWork = () => {
    setLocalWorkList([...localWorkList, {}]);
  };

  // 处理删除工作经历
  const handleRemoveWork = (index: number) => {
    const newList = localWorkList.filter((_: any, i: number) => i !== index);
    setLocalWorkList(newList);
  };

  // 辅助函数：获取日期显示文本
  const getDateDisplayText = (
    value: Date | null | undefined,
    formFieldPath: string[],
    defaultText: string,
  ) => {
    const dateValue = value || form.getFieldValue(formFieldPath);
    return dateValue ? dayjs(dateValue).format('YYYY-MM-DD') : defaultText;
  };

  return (
    <>
      {localWorkList.map((_: any, index: number) => (
        <div key={index}>
          <h4 className='font-bold ml-2 my-2'>工作经历 {index + 1}</h4>
          <Form.Item
            name={['workexp_info_list', String(index), 'work_unit']}
            label='工作单位'
            rules={[{ required: true, message: '请输入工作单位' }]}
          >
            <Input placeholder='请输入工作单位' />
          </Form.Item>

          <Form.Item
            name={['workexp_info_list', String(index), 'start_date']}
            label='开始日期'
            rules={[{ required: true, message: '请选择开始日期' }]}
            trigger='onConfirm'
            onClick={(e, datePickerRef) => {
              datePickerRef.current?.open();
            }}
          >
            <DatePicker min={new Date(1924, 0, 1)} max={new Date()} precision='day'>
              {(value) =>
                getDateDisplayText(
                  value,
                  ['workexp_info_list', String(index), 'start_date'],
                  '请选择开始日期',
                )
              }
            </DatePicker>
          </Form.Item>

          <Form.Item
            name={['workexp_info_list', String(index), 'end_date']}
            label='结束日期'
            trigger='onConfirm'
            onClick={(e, datePickerRef) => {
              datePickerRef.current?.open();
            }}
          >
            <DatePicker min={new Date(1924, 0, 1)} max={new Date()} precision='day'>
              {(value) =>
                getDateDisplayText(value, ['workexp_info_list', String(index), 'end_date'], '请选择结束日期')
              }
            </DatePicker>
          </Form.Item>

          <Form.Item name={['workexp_info_list', String(index), 'department']} label='部门'>
            <Input placeholder='请输入部门' />
          </Form.Item>

          <Form.Item name={['workexp_info_list', String(index), 'position']} label='职位'>
            <Input placeholder='请输入职位' />
          </Form.Item>

          <Form.Item name={['workexp_info_list', String(index), 'resp_achv']} label='主要职责'>
            <TextArea placeholder='请输入主要职责' />
          </Form.Item>

          <Form.Item name={['workexp_info_list', String(index), 'referee']} label='证明人'>
            <Input placeholder='请输入证明人' />
          </Form.Item>

          <Form.Item name={['workexp_info_list', String(index), 'referee_contact']} label='证明人联系方式'>
            <Input placeholder='请输入证明人联系方式' />
          </Form.Item>

          <div className='flex justify-end mb-4'>
            <Button color='danger' size='small' onClick={() => handleRemoveWork(index)}>
              删除此工作经历
            </Button>
          </div>
        </div>
      ))}
      <div className='flex justify-center mt-2'>
        <Button color='success' onClick={handleAddWork}>
          + 添加工作经历
        </Button>
      </div>
    </>
  );
};

export default WorkExperience;
