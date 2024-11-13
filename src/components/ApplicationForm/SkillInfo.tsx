import React, { useState, useEffect } from 'react';
import { Form, Picker, DatePicker, Button, ImageUploader, Toast } from 'antd-mobile';
import { TabProps } from './types';
import { useAppDispatch } from 'modules/store';
import { uploadFile, validateFile } from 'modules/list/recruit';
import { ImageUploadItem } from 'antd-mobile/es/components/image-uploader';
import dayjs from 'dayjs';

interface SkillRecord {
  skill_level_dir: string;
  skill_level: string;
  skill_date: string;
  attach_file: string;
}

interface PickerOption {
  label: string;
  value: string | number;
  children?: PickerOption[];
}

const SkillInfo: React.FC<TabProps> = ({ form, allOptions }) => {
  const dispatch = useAppDispatch();
  const [localSkillList, setLocalSkillList] = useState<SkillRecord[]>([]);
  const [skillLevelOptions, setSkillLevelOptions] = useState<PickerOption[]>([
    {
      label: '1',
      value: '1',
    },
    {
      label: '2',
      value: '2',
    },
    {
      label: '3',
      value: '3',
    },
    {
      label: '4',
      value: '4',
    },
    {
      label: '5',
      value: '5',
    },
  ]);

  // 监听表单值变化，设置初始值
  useEffect(() => {
    const formSkillList = form.getFieldValue('skill_info_list');
    if (formSkillList && Array.isArray(formSkillList)) {
      setLocalSkillList(formSkillList);
    }
  }, [form.getFieldValue('skill_info_list')]);

  // 处理添加技能记录
  const handleAddSkill = () => {
    setLocalSkillList([...localSkillList, {}]);
  };

  // 处理删除技能记录
  const handleRemoveSkill = (index: number) => {
    const newList = localSkillList.filter((_: any, i: number) => i !== index);
    setLocalSkillList(newList);
  };

  // 处理技能名称变化
  const handleSkillChange = (_: number, val: any) => {
    const selectedSkill = allOptions.skill_options?.options.find((option: any) => option.id === val[0]);

    if (selectedSkill?.level) {
      setSkillLevelOptions(
        selectedSkill.level.map((item: string) => ({
          label: item,
          value: item,
        })),
      );
    } else {
      setSkillLevelOptions([]);
    }
  };

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

  // 获取当前索引的文件列表
  const getFileList = (index: number): ImageUploadItem[] => {
    const attach_file = form.getFieldValue(['skill_info_list', String(index), 'attach_file']);
    const url = Array.isArray(attach_file) ? attach_file?.[0]?.url : attach_file;
    return url ? [{ url }] : [];
  };

  // 辅助函数：获取选择器显示文本
  const getPickerDisplayText = (
    value: any,
    options: any[],
    defaultText: string,
    formFieldPath?: string[],
  ) => {
    if (value?.[0]?.label) {
      return value[0].label;
    }

    const formValue = formFieldPath ? form.getFieldValue(formFieldPath) : value;
    if (formValue) {
      const actualValue = Array.isArray(formValue) ? formValue[0] : formValue;
      const option = options?.find((opt) => opt.id === actualValue || opt.value === actualValue);
      return option?.name || option?.label || defaultText;
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
      {localSkillList.map((_: any, index: number) => (
        <div key={index}>
          <h4 className='font-bold ml-2 my-2'>技能记录 {index + 1}</h4>
          <Form.Item
            name={['skill_info_list', String(index), 'skill_level_dir']}
            label='技能名称'
            rules={[{ required: true, message: '请选择技能名称' }]}
            trigger='onConfirm'
            onClick={(e, pickerRef) => {
              pickerRef.current?.open();
            }}
          >
            <Picker
              columns={[
                allOptions.skill_options?.options.map((item: any) => ({
                  label: item.name,
                  value: item.id,
                })) || [],
              ]}
              onConfirm={(val) => handleSkillChange(index, val)}
            >
              {(value) =>
                getPickerDisplayText(
                  value,
                  allOptions.skill_options?.options.map((item: any) => ({
                    label: item.name,
                    value: item.id,
                    ...item,
                  })) || [],
                  '请选择技能名称',
                  ['skill_info_list', String(index), 'skill_level_dir'],
                )
              }
            </Picker>
          </Form.Item>

          <Form.Item
            name={['skill_info_list', String(index), 'skill_level']}
            label='技能等级'
            rules={[{ required: true, message: '请选择技能等级' }]}
            trigger='onConfirm'
            onClick={(e, pickerRef) => {
              pickerRef.current?.open();
            }}
            dependencies={[['skill_info_list', String(index), 'skill_level_dir']]}
          >
            <Picker columns={[skillLevelOptions]}>
              {(value) =>
                getPickerDisplayText(value, skillLevelOptions, '请选择技能等级', [
                  'skill_info_list',
                  String(index),
                  'skill_level',
                ])
              }
            </Picker>
          </Form.Item>

          <Form.Item
            name={['skill_info_list', String(index), 'skill_date']}
            label='鉴定时间'
            rules={[{ required: true, message: '请选择鉴定时间' }]}
            trigger='onConfirm'
            onClick={(e, datePickerRef) => {
              datePickerRef.current?.open();
            }}
          >
            <DatePicker min={new Date(1924, 0, 1)} max={new Date()} precision='day'>
              {(value) =>
                getDateDisplayText(value, ['skill_info_list', String(index), 'skill_date'], '请选择鉴定时间')
              }
            </DatePicker>
          </Form.Item>

          <Form.Item name={['skill_info_list', String(index), 'attach_file']} label='附件'>
            <ImageUploader
              // value={getFileList(index)}
              upload={handleUpload}
              maxCount={1}
              accept='image/*,.pdf,.doc,.docx'
            />
          </Form.Item>

          <div className='flex justify-end mb-4'>
            <Button color='danger' size='small' onClick={() => handleRemoveSkill(index)}>
              删除此技能记录
            </Button>
          </div>
        </div>
      ))}
      <div className='flex justify-center mt-2'>
        <Button color='success' onClick={handleAddSkill}>
          + 添加技能记录
        </Button>
      </div>
    </>
  );
};

export default SkillInfo;
