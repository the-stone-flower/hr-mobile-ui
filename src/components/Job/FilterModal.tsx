// src/components/Job/FilterModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal, Form, Selector, Button, Space, Input } from 'antd-mobile';
import {
  JobFilterParams,
  educationOptions,
  workYearsOptions,
  salaryRangeOptions,
  workLocationOptions,
} from './JobTypes';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  initialFilters: JobFilterParams;
  onApply: (filters: JobFilterParams) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  initialFilters,
  onApply,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    // 当 modal 显示或 initialFilters 改变时，更新表单
    form.setFieldsValue({
      education: initialFilters.education?.toString() || '',
      work_years: initialFilters.work_years?.toString() || '',
      salary_range: getSalaryRangeValue(initialFilters.salary_start, initialFilters.salary_end),
      work_location: initialFilters.work_location || '',
    });
  }, [visible, initialFilters, form]);

  const getSalaryRangeValue = (start?: number | null, end?: number | null) => {
    if (start === null && end === null) {
      return ''; // 面议或不限
    }
    // 假设薪资范围选项的value是 "start-end" 格式
    if (start !== undefined && end !== undefined && start !== null && end !== null) {
      const matchedOption = salaryRangeOptions.find(opt => {
        if (opt.value === '50000+') {
          return start >= 50000;
        }
        const [s, e] = (opt.value as string).split('-').map(Number);
        return start === s && end === e;
      });
      return matchedOption?.value || '';
    }
    return '';
  };

  const parseSalaryRange = (salaryRangeValue: string) => {
    if (!salaryRangeValue) {
      return { salary_start: undefined, salary_end: undefined };
    }
    if (salaryRangeValue === '50000+') {
      return { salary_start: 50000, salary_end: undefined };
    }
    const [start, end] = salaryRangeValue.split('-').map(Number);
    return { salary_start: start, salary_end: end };
  };

  const handleApply = () => {
    const values = form.getFieldsValue();
    const { salary_range, ...rest } = values;
    const { salary_start, salary_end } = parseSalaryRange(salary_range);

    const filters: JobFilterParams = {
      ...rest,
      education: values.education ? Number(values.education) : undefined,
      work_years: values.work_years ? Number(values.work_years) : undefined,
      salary_start,
      salary_end,
    };
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    form.resetFields();
    onApply({}); // 应用空筛选，相当于重置
    onClose();
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      bodyStyle={{ padding: '20px' }}
      title="筛选条件"
      showCloseButton
      content={
        <Form form={form} layout="vertical">
          <Form.Item label="学历要求" name="education">
            <Selector
              options={educationOptions}
              columns={3}
              multiple={false}
              onChange={val => {
                form.setFieldValue('education', val[0]);
              }}
            />
          </Form.Item>

          <Form.Item label="工作经验" name="work_years">
            <Selector
              options={workYearsOptions}
              columns={3}
              multiple={false}
              onChange={val => {
                form.setFieldValue('work_years', val[0]);
              }}
            />
          </Form.Item>

          <Form.Item label="薪资范围" name="salary_range">
            <Selector
              options={salaryRangeOptions}
              columns={3}
              multiple={false}
              onChange={val => {
                form.setFieldValue('salary_range', val[0]);
              }}
            />
          </Form.Item>

          <Form.Item label="工作地点" name="work_location">
            <Selector
              options={workLocationOptions}
              columns={3}
              multiple={false}
              onChange={val => {
                form.setFieldValue('work_location', val[0]);
              }}
            />
          </Form.Item>
        </Form>
      }
      actions={[
        {
          key: 'reset',
          text: '重置',
          onClick: handleReset,
        },
        {
          key: 'apply',
          text: '确定',
          primary: true,
          onClick: handleApply,
        },
      ]}
    />
  );
};

export default FilterModal;
