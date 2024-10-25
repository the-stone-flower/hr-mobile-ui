import React, { useState, useEffect } from 'react';
import { Form, Input, Picker, DatePicker, CascadePicker, ImageUploader, Toast } from 'antd-mobile';
import { AddCircleOutline } from 'antd-mobile-icons';
import { useAppDispatch } from 'modules/store';
import { uploadFile, validateFile } from 'modules/list/recruit';
import { ImageUploadItem } from 'antd-mobile/es/components/image-uploader';
import dayjs from 'dayjs';

import type { TabProps } from './types';

interface PickerOption {
  label: string;
  value: string | number;
  children?: PickerOption[];
}

const FORM_SPACE = 'health_info';

const HealthInfo: React.FC<TabProps> = ({ form, allOptions }) => {
  const dispatch = useAppDispatch();

  const [showDisFile, setShowDisFile] = useState(true);
  const [showMilitaryDisFile, setShowMilitaryDisFile] = useState(true);

  // 处理文件上传
  const handleUpload = async (file: File) => {
    if (!validateFile(file)) return null;

    try {
      const fileObject = {
        raw: file,
        name: file.name,
      };

      const result = await dispatch(uploadFile(fileObject)).unwrap();
      return {
        url: result.file,
      };
    } catch (error) {
      Toast.show({
        icon: 'fail',
        content: '文件上传失败',
      });
      return null;
    }
  };

  const getDateDisplayText = (value: Date | null | undefined, formFieldName: string, defaultText: string) => {
    // FIXME 深层桥套类型，需要 formFieldName 可以是数组
    const dateValue = value || form.getFieldValue([FORM_SPACE, formFieldName]);
    return dateValue ? dayjs(dateValue).format('YYYY-MM-DD') : defaultText;
  };

  const getPickerDisplayText = (
    value: any,
    options: PickerOption[],
    defaultText: string,
    formFieldName?: string,
  ) => {
    if (value?.[0]?.label) {
      return value[0].label;
    }

    const formValue = formFieldName ? form.getFieldValue([FORM_SPACE, formFieldName]) : value;

    if (formValue) {
      const actualValue = Array.isArray(formValue) ? formValue[0] : formValue;
      const option = options?.find((opt) => opt.value == actualValue);
      return option?.label || defaultText;
    }

    return defaultText;
  };

  // 辅助函数：获取级联选择器显示文本
  const getPhysicalDisabilityDisplayText = (items: any[], formFieldName: string, defaultText: string) => {
    if (items?.length && items[1]) {
      return items.map((item) => item?.label).join(' - ');
    }

    const formValue = form.getFieldValue('physical_disability_cn');
    if (formValue) {
      return formValue;
    }

    return defaultText;
  };

  // 辅助函数：获取级联选择器显示文本
  const getMilitaryDisabilityDisplayText = (items: any[], formFieldName: string, defaultText: string) => {
    if (items?.length && items[1]) {
      return items.map((item) => item?.label).join(' - ');
    }

    const formValue = form.getFieldValue('military_physical_disability_cn');
    if (formValue) {
      return formValue;
    }

    return defaultText;
  };

  return (
    <>
      <Form.Item name={[FORM_SPACE, 'height']} label='身高/米'>
        <Input placeholder='请输入身高' />
      </Form.Item>
      <Form.Item name={[FORM_SPACE, 'weight']} label='体重/公斤'>
        <Input placeholder='请输入体重' />
      </Form.Item>
      <Form.Item name={[FORM_SPACE, 'vision']} label='视力'>
        <Input placeholder='请输入视力' />
      </Form.Item>
      <Form.Item
        name={[FORM_SPACE, 'health_type']}
        label='健康状态'
        trigger='onConfirm'
        onClick={(e, pickerRef) => {
          pickerRef.current?.open();
        }}
      >
        <Picker columns={[allOptions.health_type_options?.options || []]}>
          {(items) =>
            getPickerDisplayText(
              items,
              allOptions.health_type_options?.options || [],
              '请选择健康状态',
              'health_type',
            )
          }
        </Picker>
      </Form.Item>

      <Form.Item
        name={[FORM_SPACE, 'physical_disability']}
        label='残疾类型'
        trigger='onConfirm'
        onClick={(e, pickerRef) => {
          pickerRef.current?.open();
        }}
      >
        <CascadePicker
          title='残疾类型'
          options={
            allOptions.physical_disability_options?.options?.map((item: any, index: number) => ({
              ...item,
              value: String(index),
            })) || []
          }
        >
          {(items) => getPhysicalDisabilityDisplayText(items, 'physical_disability', '请选择残疾类型')}
        </CascadePicker>
      </Form.Item>

      <Form.Item
        name={[FORM_SPACE, 'disability_file']}
        label='残疾证'
        rules={[{ required: false, message: '请上传残疾证' }]}
        extra='支持jpg、png格式，大小不超过10M'
      >
        <ImageUploader upload={handleUpload} maxCount={1} accept='image/*' />
      </Form.Item>

      <Form.Item
        name={[FORM_SPACE, 'military_physical_disability']}
        label='军人残疾类型'
        trigger='onConfirm'
        onClick={(e, pickerRef) => {
          pickerRef.current?.open();
        }}
      >
        <CascadePicker
          title='军人残疾类型'
          options={
            allOptions.military_physical_disability_options?.options?.map((item: any, index: number) => ({
              ...item,
              value: String(index),
            })) || []
          }
        >
          {(items) =>
            getMilitaryDisabilityDisplayText(items, 'military_physical_disability', '请选择军人残疾类型')
          }
        </CascadePicker>
      </Form.Item>

      <Form.Item
        name={[FORM_SPACE, 'military_disability_file']}
        label='军人残疾证'
        rules={[{ required: false, message: '请上传军人残疾证' }]}
        extra='支持jpg、png格式，大小不超过10M'
      >
        <ImageUploader upload={handleUpload} maxCount={1} accept='image/*' />
      </Form.Item>

      <div className='adm-list-item'>
        <h4 className='font-medium' style={{ fontSize: '15px' }}>
          既往病史
        </h4>
        <Form.Array
          name={[FORM_SPACE, 'past_medical_history']}
          onAdd={(operation) => operation.add({})}
          renderAdd={() => (
            <div className='flex justify-center items-center'>
              <AddCircleOutline className='mr-2' /> 添加既往病史
            </div>
          )}
          renderHeader={({ index }, { remove }) => (
            <>
              <span>既往病史{index + 1}</span>
              <a onClick={() => remove(index)} className='float-right text-blue-500'>
                删除
              </a>
            </>
          )}
        >
          {(fields) =>
            fields.map(({ index }) => (
              <>
                <Form.Item name={[index, 'name']} label='疾病名称'>
                  <Input placeholder='请出入疾病名称' />
                </Form.Item>
                <Form.Item name={[index, 'desc']} label='病情描述'>
                  <Input placeholder='请输入病情描述' />
                </Form.Item>
                <Form.Item
                  name={[index, 'start_time']}
                  label='开始时间'
                  trigger='onConfirm'
                  onClick={(e, datePickerRef) => {
                    datePickerRef.current?.open();
                  }}
                >
                  <DatePicker min={new Date(1924, 0, 1)} max={new Date()} precision='day'>
                    {(value) => getDateDisplayText(value, 'end_time', '请选择结束时间')}
                  </DatePicker>
                </Form.Item>
                <Form.Item
                  name={[index, 'end_time']}
                  label='结束时间'
                  trigger='onConfirm'
                  onClick={(e, datePickerRef) => {
                    datePickerRef.current?.open();
                  }}
                >
                  <DatePicker min={new Date(1924, 0, 1)} max={new Date()} precision='day'>
                    {(value) => getDateDisplayText(value, 'end_time', '请选择结束时间')}
                  </DatePicker>
                </Form.Item>
              </>
            ))
          }
        </Form.Array>
      </div>

      <div className='adm-list-item'>
        <h4 className='font-medium' style={{ fontSize: '15px' }}>
          过敏史
        </h4>
        <Form.Array
          name={[FORM_SPACE, 'allergy_history']}
          onAdd={(operation) => operation.add({})}
          renderAdd={() => (
            <div className='flex justify-center items-center'>
              <AddCircleOutline className='mr-2' /> 添加过敏史
            </div>
          )}
          renderHeader={({ index }, { remove }) => (
            <>
              <span>过敏史{index + 1}</span>
              <a onClick={() => remove(index)} className='float-right text-blue-500'>
                删除
              </a>
            </>
          )}
        >
          {(fields) =>
            fields.map(({ index }) => (
              <>
                <Form.Item name={[index, 'name']} label='过敏源'>
                  <Input placeholder='请出入疾病名称' />
                </Form.Item>
                <Form.Item name={[index, 'desc']} label='病情描述'>
                  <Input placeholder='请输入病情描述' />
                </Form.Item>
                <Form.Item
                  name={[index, 'start_time']}
                  label='开始时间'
                  trigger='onConfirm'
                  onClick={(e, datePickerRef) => {
                    datePickerRef.current?.open();
                  }}
                >
                  <DatePicker min={new Date(1924, 0, 1)} max={new Date()} precision='day'>
                    {(value) => getDateDisplayText(value, 'start_time', '请选择开始时间')}
                  </DatePicker>
                </Form.Item>
                <Form.Item
                  name={[index, 'end_time']}
                  label='结束时间'
                  trigger='onConfirm'
                  onClick={(e, datePickerRef) => {
                    datePickerRef.current?.open();
                  }}
                >
                  <DatePicker min={new Date(1924, 0, 1)} max={new Date()} precision='day'>
                    {(value) => getDateDisplayText(value, 'end_time', '请选择结束时间')}
                  </DatePicker>
                </Form.Item>
              </>
            ))
          }
        </Form.Array>
      </div>
    </>
  );
};

export default HealthInfo;
