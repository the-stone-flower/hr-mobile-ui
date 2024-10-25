import React, { useState } from 'react';
import { Form, Input, Radio, Picker, DatePicker, ImageUploader, Toast, CascadePicker } from 'antd-mobile';
import { TabProps } from './types';
import { useAppDispatch } from 'modules/store';
import { uploadFile, validateFile } from 'modules/list/recruit';
import { ImageUploadItem } from 'antd-mobile/es/components/image-uploader';
import dayjs from 'dayjs';

interface PickerOption {
  label: string;
  value: string | number;
  children?: PickerOption[];
}

const BasicInfo: React.FC<TabProps> = ({ form, allOptions, onIdNumberChange }) => {
  const dispatch = useAppDispatch();

  const [showMilitaryFile, setShowMilitaryFile] = useState(true);

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

  // 获取个人照片的文件列表
  const getPhotoFileList = (): ImageUploadItem[] => {
    const photo = form.getFieldValue('pers_photo');
    const url = Array.isArray(photo) ? photo?.[0]?.url : photo;

    return url ? [{ url: url }] : [];
  };

  // 辅助函数：获取选择器显示文本
  const getPickerDisplayText = (
    value: any,
    options: PickerOption[],
    defaultText: string,
    formFieldName?: string,
  ) => {
    if (value?.[0]?.label) {
      return value[0].label;
    }

    const formValue = formFieldName ? form.getFieldValue(formFieldName) : value;

    if (formValue) {
      const actualValue = Array.isArray(formValue) ? formValue[0] : formValue;
      const option = options?.find((opt) => opt.value == actualValue);
      return option?.label || defaultText;
    }

    return defaultText;
  };

  // 辅助函数：获取日期显示文本
  const getDateDisplayText = (value: Date | null | undefined, formFieldName: string, defaultText: string) => {
    const dateValue = value || form.getFieldValue(formFieldName);
    return dateValue ? dayjs(dateValue).format('YYYY-MM-DD') : defaultText;
  };

  // 辅助函数：获取级联选择器显示文本
  const getCascadeDisplayText = (items: any[], formFieldName: string, defaultText: string) => {
    if (items?.length && items[1]) {
      return items.map((item) => item?.label).join(' - ');
    }

    const formValue = form.getFieldValue('physical_disability_cn');
    if (formValue) {
      return formValue;
    }

    return defaultText;
  };

  return (
    <>
      <Form.Item name='name' label='姓名' rules={[{ required: true, message: '请输入姓名' }]}>
        <Input placeholder='请输入姓名' />
      </Form.Item>

      <Form.Item
        name='id_number'
        label='身份证号码'
        rules={[{ required: true, message: '请输入身份证号码' }]}
      >
        <Input
          placeholder='请输入身份证号码'
          onChange={(value) => {
            if (value.length >= 18) {
              onIdNumberChange?.(value);
            }
          }}
        />
      </Form.Item>

      <Form.Item
        name='id_front_file'
        label='身份证正面'
        rules={[{ required: false, message: '请上传身份证正面' }]}
        extra='支持jpg、png格式，大小不超过10M'
      >
        <ImageUploader upload={handleUpload} maxCount={1} accept='image/*' />
      </Form.Item>

      <Form.Item
        name='id_back_file'
        label='身份证背面'
        rules={[{ required: false, message: '请上传身份证背面' }]}
        extra='支持jpg、png格式，大小不超过10M'
      >
        <ImageUploader upload={handleUpload} maxCount={1} accept='image/*' />
      </Form.Item>

      <Form.Item name='contact_way' label='手机号' rules={[{ required: true, message: '请输入手机号' }]}>
        <Input placeholder='请输入手机号' />
      </Form.Item>

      <Form.Item
        name='employment'
        label='应聘岗位'
        rules={[{ required: true, message: '请选择应聘岗位' }]}
        trigger='onConfirm'
        onClick={(e, pickerRef) => {
          pickerRef.current?.open();
        }}
      >
        <Picker columns={[allOptions.employment_options?.options || []]}>
          {(value) =>
            getPickerDisplayText(
              value,
              allOptions.employment_options?.options || [],
              '请选择应聘岗位',
              'employment',
            )
          }
        </Picker>
      </Form.Item>

      <Form.Item name='gender' label='性别'>
        <Radio.Group>
          {allOptions.gender_options?.options?.map((option: any) => (
            <Radio key={option.value} value={option.value} className='mt-2'>
              {option.label}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>

      <Form.Item
        name='birthday'
        label='出生日期'
        trigger='onConfirm'
        onClick={(e, datePickerRef) => {
          datePickerRef.current?.open();
        }}
      >
        <DatePicker min={new Date(1924, 0, 1)} max={new Date()} precision='day'>
          {(value) => getDateDisplayText(value, 'birthday', '请选择出生日期')}
        </DatePicker>
      </Form.Item>

      <Form.Item name='age' label='年龄'>
        <Input type='number' placeholder='请输入年龄' />
      </Form.Item>

      <Form.Item
        name='nation'
        label='民族'
        trigger='onConfirm'
        onClick={(e, pickerRef) => {
          pickerRef.current?.open();
        }}
      >
        <Picker columns={[allOptions.nation_options?.options || []]}>
          {(value) =>
            getPickerDisplayText(value, allOptions.nation_options?.options || [], '请选择民族', 'nation')
          }
        </Picker>
      </Form.Item>

      <Form.Item name='native_place' label='籍贯'>
        <Input placeholder='请输入籍贯' />
      </Form.Item>

      <Form.Item
        name='political'
        label='政治面貌'
        trigger='onConfirm'
        onClick={(e, pickerRef) => {
          pickerRef.current?.open();
        }}
      >
        <Picker columns={[allOptions.political_options?.options || []]}>
          {(value) =>
            getPickerDisplayText(
              value,
              allOptions.political_options?.options || [],
              '请选择政治面貌',
              'political',
            )
          }
        </Picker>
      </Form.Item>

      <Form.Item
        name='join_party_date'
        label='入党时间'
        trigger='onConfirm'
        onClick={(e, datePickerRef) => {
          datePickerRef.current?.open();
        }}
      >
        <DatePicker min={new Date(1924, 0, 1)} max={new Date()} precision='day'>
          {(value) => getDateDisplayText(value, 'join_party_date', '请选择入党时间')}
        </DatePicker>
      </Form.Item>

      <Form.Item
        name='marital_status'
        label='婚姻状况'
        trigger='onConfirm'
        onClick={(e, pickerRef) => {
          pickerRef.current?.open();
        }}
      >
        <Picker columns={[allOptions.marital_options?.options || []]}>
          {(value) =>
            getPickerDisplayText(
              value,
              allOptions.marital_options?.options || [],
              '请选择婚姻状况',
              'marital_status',
            )
          }
        </Picker>
      </Form.Item>

      <Form.Item name='is_veteran' label='是否退役军人'>
        <Radio.Group
          onChange={(value) => {
            setShowMilitaryFile(value === 'true' ? true : false);
          }}
        >
          <Radio value='true' className='mt-2'>
            是
          </Radio>
          <Radio value='false' className='mt-2'>
            否
          </Radio>
        </Radio.Group>
      </Form.Item>

      {showMilitaryFile ? (
        <Form.Item
          name='discharge_military_file'
          label='退伍证'
          rules={[{ required: false, message: '请上传退伍证' }]}
          extra='支持jpg、png格式，大小不超过10M'
        >
          <ImageUploader upload={handleUpload} maxCount={1} accept='image/*' />
        </Form.Item>
      ) : (
        ''
      )}

      {/* <Form.Item
        name='physical_disability'
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
          {(items) => getCascadeDisplayText(items, 'physical_disability', '请选择残疾类型')}
        </CascadePicker>
      </Form.Item> */}
    </>
  );
};

export default BasicInfo;
