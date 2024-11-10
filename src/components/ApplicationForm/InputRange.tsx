import React, { FC } from 'react';
import { Input, Space } from 'antd-mobile';
import type { InputRef } from 'antd-mobile/es/components/input'

interface RangeInputProps {
  minValue: string;
  maxValue: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
  placeholder?: [string, string];
}

const NumberRangeInput: FC<RangeInputProps> = ({
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  placeholder = ['最小值', '最大值'],
}) => {
  // 限制只能输入数字和小数点
  const handleInput = (value: string) => {
    return value.replace(/[^\d.]/g, '').replace(/^\./g, '').replace(/\.{2,}/g, '.').replace(/^(\-)*(\d+)\.(\d).*$/, '$1$2.$3');
  };

  // 验证并更新最小值
  const handleMinChange = (value: string) => {
    const formattedValue = handleInput(value);
    if (maxValue && Number(formattedValue) > Number(maxValue)) {
      return;
    }
    onMinChange(formattedValue);
  };

  // 验证并更新最大值
  const handleMaxChange = (value: string) => {
    const formattedValue = handleInput(value);
    if (minValue && Number(formattedValue) < Number(minValue)) {
      return;
    }
    onMaxChange(formattedValue);
  };

  return (
    <Space direction='horizontal' className='w-full justify-between items-center'>
      <Input
        className='flex-1'
        placeholder={placeholder[0]}
        value={minValue}
        onChange={handleMinChange}
        type='number'
      />
      <span className='text-gray-400 px-2'>至</span>
      <Input
        className='flex-1'
        placeholder={placeholder[1]}
        value={maxValue}
        onChange={handleMaxChange}
        type='number'
      />
    </Space>
  );
};
