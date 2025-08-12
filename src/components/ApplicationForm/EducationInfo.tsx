import React, { useState, useEffect } from 'react';
import { Form, Input, Picker, DatePicker, ImageUploader, Toast, Button } from 'antd-mobile';
import { TabProps } from './types';
import { useAppDispatch } from 'modules/store';
import { uploadFile, validateFile } from 'modules/list/recruit';
import { ImageUploadItem } from 'antd-mobile/es/components/image-uploader';
import dayjs from 'dayjs';

interface EducationRecord {
  education_type: string;
  education: string;
  graduated: string;
  degree: string;
  major: string;
  graduate_date: string;
}

interface PickerOption {
  label: string;
  value: string | number;
  children?: PickerOption[];
}

const EducationInfo: React.FC<TabProps> = ({ form, allOptions }) => {
  const [localEduList, setLocalEduList] = useState<EducationRecord[]>([]);

  const dispatch = useAppDispatch();

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

  // 监听表单值变化，设置初始值
  useEffect(() => {
    const formEduList = form.getFieldValue('edu_info_list');
    if (formEduList && Array.isArray(formEduList)) {
      setLocalEduList(formEduList);
    }
  }, [form.getFieldValue('edu_info_list')]);

  // 处理添加教育经历
  const handleAddEducation = () => {
    setLocalEduList([...localEduList, {}]);
  };

  // 处理删除教育经历
  const handleRemoveEducation = (index: number) => {
    const newList = localEduList.filter((_: any, i: number) => i !== index);
    setLocalEduList(newList);
  };

  // 辅助函数：获取选择器显示文本
  const getPickerDisplayText = (
    value: any,
    options: PickerOption[],
    defaultText: string,
    formFieldPath?: string[],
  ) => {
    if (value?.[0]?.label) {
      return value[0].label;
    }

    const formValue = formFieldPath ? form.getFieldValue(formFieldPath) : value;
    if (formValue) {
      const actualValue = Array.isArray(formValue) ? formValue[0] : formValue;
      const option = options?.find((opt) => opt.value == actualValue);
      return option?.label || defaultText;
    }

    return defaultText;
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
      {localEduList.map((_: any, index: number) => (
        <div key={index}>
          <h4 className='font-bold ml-2 my-2'>教育经历 {index + 1}</h4>

          <Form.Item
            name={['edu_info_list', String(index), 'education']}
            label='学历'
            rules={[{ required: true, message: '请选择学历' }]}
            trigger='onConfirm'
            onClick={(e, pickerRef) => {
              pickerRef.current?.open();
            }}
          >
            <Picker columns={[allOptions.education_options?.options || []]}>
              {(value) =>
                getPickerDisplayText(value, allOptions.education_options?.options || [], '请选择学历', [
                  'edu_info_list',
                  String(index),
                  'education',
                ])
              }
            </Picker>
          </Form.Item>

          <Form.Item
            name={['edu_info_list', String(index), 'education_type']}
            label='学历类型'
            rules={[{ required: true, message: '请选择学历类型' }]}
            trigger='onConfirm'
            onClick={(e, pickerRef) => {
              pickerRef.current?.open();
            }}
          >
            <Picker columns={[allOptions.education_type_options?.options || []]}>
              {(value) =>
                getPickerDisplayText(
                  value,
                  allOptions.education_type_options?.options || [],
                  '请选择学历类型',
                  ['edu_info_list', String(index), 'education_type'],
                )
              }
            </Picker>
          </Form.Item>

          <Form.Item
            name={['edu_info_list', String(index), 'graduated']}
            label='毕业学校'
            rules={[{ required: true, message: '请输入毕业学校' }]}
          >
            <Input placeholder='请输入毕业学校' />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, curValues) => prevValues.edu_info_list !== curValues.edu_info_list}
          >
            {({ getFieldValue }) => {
              console.log(getFieldValue('edu_info_list')?.[index]?.education?.[0]);
              return Number(getFieldValue('edu_info_list')?.[index]?.education?.[0]) > 4 ? (
                <Form.Item
                  name={['edu_info_list', String(index), 'degree']}
                  label='学位'
                  rules={[{ required: true, message: '请选择学位' }]}
                  trigger='onConfirm'
                  onClick={(e, pickerRef) => {
                    pickerRef.current?.open();
                  }}
                >
                  <Picker columns={[allOptions.degree_options?.options || []]}>
                    {(value) =>
                      getPickerDisplayText(value, allOptions.degree_options?.options || [], '请选择学位', [
                        'edu_info_list',
                        String(index),
                        'degree',
                      ])
                    }
                  </Picker>
                </Form.Item>
              ) : (
                <Form.Item
                  name={['edu_info_list', String(index), 'degree']}
                  label='学位'
                  rules={[{ required: false, message: '请选择学位' }]}
                  trigger='onConfirm'
                  onClick={(e, pickerRef) => {
                    pickerRef.current?.open();
                  }}
                >
                  <Picker columns={[allOptions.degree_options?.options || []]}>
                    {(value) =>
                      getPickerDisplayText(value, allOptions.degree_options?.options || [], '请选择学位', [
                        'edu_info_list',
                        String(index),
                        'degree',
                      ])
                    }
                  </Picker>
                </Form.Item>
              );
            }}
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, curValues) => prevValues.edu_info_list !== curValues.edu_info_list}
          >
            {({ getFieldValue }) => {
              return Number(getFieldValue('edu_info_list')?.[index]?.education?.[0]) > 2 ? (
                <Form.Item
                  name={['edu_info_list', String(index), 'major']}
                  label='专业'
                  rules={[{ required: true, message: '请输入专业' }]}
                >
                  <Input placeholder='请输入专业' />
                </Form.Item>
              ) : (
                <Form.Item
                  name={['edu_info_list', String(index), 'major']}
                  label='专业'
                  rules={[{ required: false, message: '请输入专业' }]}
                >
                  <Input placeholder='请输入专业' />
                </Form.Item>
              );
            }}
          </Form.Item>

          <Form.Item
            name={['edu_info_list', String(index), 'graduate_date']}
            label='毕业时间'
            rules={[{ required: true, message: '请选择毕业时间' }]}
            trigger='onConfirm'
            onClick={(e, datePickerRef) => {
              datePickerRef.current?.open();
            }}
          >
            <DatePicker min={new Date(1924, 0, 1)} max={new Date()} precision='day'>
              {(value) =>
                getDateDisplayText(value, ['edu_info_list', String(index), 'graduate_date'], '请选择毕业时间')
              }
            </DatePicker>
          </Form.Item>

          <Form.Item
            name={['edu_info_list', String(index), 'graduated_attach_file']}
            label='毕业证'
            rules={[{ required: true, message: '请上传毕业证' }]}
            extra='支持jpg、png格式，大小不超过10M'
          >
            <ImageUploader upload={handleUpload} maxCount={1} accept='image/*' />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, curValues) => prevValues.edu_info_list !== curValues.edu_info_list}
          >
            {({ getFieldValue }) => {
              return Number(getFieldValue('edu_info_list')?.[index]?.education?.[0]) > 4 ? (
                <Form.Item
                  name={['edu_info_list', String(index), 'degree_attach_file']}
                  label='学位证'
                  rules={[{ required: true, message: '请上传学位证' }]}
                  extra='支持jpg、png格式，大小不超过10M'
                >
                  <ImageUploader upload={handleUpload} maxCount={1} accept='image/*' />
                </Form.Item>
              ) : (
                <Form.Item
                  name={['edu_info_list', String(index), 'degree_attach_file']}
                  label='学位证'
                  rules={[{ required: false, message: '请上传学位证' }]}
                  extra='支持jpg、png格式，大小不超过10M'
                >
                  <ImageUploader upload={handleUpload} maxCount={1} accept='image/*' />
                </Form.Item>
              );
            }}
          </Form.Item>

          <div className='flex justify-end mb-4'>
            <Button color='danger' size='small' onClick={() => handleRemoveEducation(index)}>
              删除此教育经历
            </Button>
          </div>
        </div>
      ))}
      <div className='flex justify-center mt-2'>
        <Button color='success' onClick={handleAddEducation}>
          + 添加教育经历
        </Button>
      </div>
    </>
  );
};

export default EducationInfo;
