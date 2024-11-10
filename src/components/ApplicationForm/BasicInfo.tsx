import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Radio,
  Picker,
  DatePicker,
  ImageUploader,
  Toast,
  CascadePicker,
  Space,
  Button,
  TextArea,
} from 'antd-mobile';
import { DeleteOutline } from 'antd-mobile-icons';
import type { PickerValue, PickerValueExtend } from 'antd-mobile/es/components/picker';
import { TabProps } from './types';
import { useAppDispatch } from 'modules/store';
import { uploadFile, validateFile } from 'modules/list/recruit';
import dayjs from 'dayjs';
interface PickerOption {
  label: string;
  value: string | number;
  children?: PickerOption[];
}

const BasicInfo: React.FC<TabProps> = ({ form, allOptions, onIdNumberChange }) => {
  const dispatch = useAppDispatch();
  const [showMilitaryFile, setShowMilitaryFile] = useState(true);
  const [areaCount, setAreaCount] = useState(1);
  const [salaryRange, setSalaryRange] = useState<number[]>([]);
  const areaData = allOptions?.work_place_options?.options || [];

  // 意向地区选择器的显示状态
  const [intentionVisible1, setIntentionVisible1] = useState(false);
  const [intentionVisible2, setIntentionVisible2] = useState(false);
  const [intentionVisible3, setIntentionVisible3] = useState(false);

  // 前端管理的地址字段
  const [intentionRegion1, setIntentionRegion1] = useState<string[]>(['四川省', '成都市', '锦江区']);
  const [intentionRegion2, setIntentionRegion2] = useState<string[]>(['四川省', '成都市', '锦江区']);
  const [intentionRegion3, setIntentionRegion3] = useState<string[]>(['四川省', '成都市', '锦江区']);

  // 监听现居地址变化

  // useEffect(() => {
  //   handleAreaInitChange();
  // }, [form.getFieldValue('recruit_info')]);

  const handleAreaInitChange = () => {
    console.log('inti');
    const salary_range = form.getFieldValue(['recruit_info', 'salary_range']);
    const intention_area = form.getFieldValue(['recruit_info', 'intention_area']);

    if (salary_range) {
      setSalaryRange(salary_range);
    }
    if (intention_area && intention_area.length) {
      if (typeof intention_area[0] === 'string') {
        setIntentionRegion1(intention_area[0]?.split(','));
      }
      if (typeof intention_area[1] === 'string') {
        setIntentionRegion2(intention_area[1]?.split(','));
      }
      if (typeof intention_area[2] === 'string') {
        setIntentionRegion3(intention_area[2]?.split(','));
      }

      setAreaCount(intention_area.length);
    }
  };
  // 验证薪资范围
  const validateSalaryRange = (rule: any, value: number[]) => {
    if (!value || !Array.isArray(value)) {
      return Promise.reject('请输入薪资范围');
    }

    const [min, max] = value;

    if (!min || !max) {
      return Promise.reject('请完整填写薪资范围');
    }

    if (min >= max) {
      return Promise.reject('最低薪资不能大于或等于最高薪资');
    }

    return Promise.resolve();
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

  // 处理添加意向地区
  const handleAddArea = () => {
    if (areaCount < 3) {
      setAreaCount(areaCount + 1);
    } else {
      Toast.show({
        content: '最多添加3个意向地区',
      });
    }
  };

  // 处理删除意向地区
  const handleDeleteArea = (index: number) => {
    // 获取当前所有意向地区
    const currentAreas = form.getFieldValue(['recruit_info', 'intention_area']) || [];

    // 删除指定位置的地区
    currentAreas.splice(index, 1);

    // 更新表单数据
    form.setFieldValue(['recruit_info', 'intention_area'], currentAreas);

    // 重置对应的状态
    if (index === 1) {
      setIntentionRegion2(['四川省', '成都市', '锦江区']);
    } else if (index === 2) {
      setIntentionRegion3(['四川省', '成都市', '锦江区']);
    }

    setAreaCount(areaCount - 1);
  };

  // 处理意向地区选择
  const handleIntentionRegionChange = (index: number) => (val: PickerValue[], extend: PickerValueExtend) => {
    const currentAreas = form.getFieldValue(['recruit_info', 'intention_area']) || [];

    currentAreas[index] = val;

    // 更新对应的状态和表单数据
    switch (index) {
      case 0:
        setIntentionRegion1(val as string[]);
        break;
      case 1:
        setIntentionRegion2(val as string[]);
        break;
      case 2:
        setIntentionRegion3(val as string[]);
        break;
    }

    form.setFieldValue(['recruit_info', 'intention_area'], currentAreas);
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

  return (
    <>
      {/* 前面的表单项保持不变 */}
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
              setTimeout(() => {
                handleAreaInitChange();
              }, 2500);
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
        <DatePicker
          defaultValue={new Date(Date.now() - 30 * 365 * 24 * 60 * 60 * 1000)}
          min={new Date(1924, 0, 1)}
          max={new Date()}
          precision='day'
        >
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

      {showMilitaryFile && (
        <Form.Item
          name='discharge_military_file'
          label='退伍证'
          rules={[{ required: false, message: '请上传退伍证' }]}
          extra='支持jpg、png格式，大小不超过10M'
        >
          <ImageUploader upload={handleUpload} maxCount={1} accept='image/*' />
        </Form.Item>
      )}

      <Form.Item
        name={['recruit_info', 'salary_range']}
        label='意向薪酬范围'
        // rules={[{ required: true, message: '请输入薪酬范围' }, { validator: validateSalaryRange }]}
      >
        <Space direction='horizontal' className='w-full justify-between items-center'>
          <Input
            className='flex-1'
            type='number'
            placeholder='最低薪资'
            value={String(salaryRange[0])}
            onChange={(value) => {
              const range = form.getFieldValue(['recruit_info', 'salary_range']) || [];
              range[0] = value ? parseInt(value) : undefined;
              setSalaryRange([range[0], salaryRange[1] || 0]);
              form.setFieldValue(['recruit_info', 'salary_range'], range);
            }}
          />
          <span className='text-gray-400 px-2'>至</span>
          <Input
            className='flex-1'
            type='number'
            value={String(salaryRange[1])}
            placeholder='最高薪资'
            onChange={(value) => {
              const range = form.getFieldValue(['recruit_info', 'salary_range']) || [];
              range[1] = value ? parseInt(value) : undefined;
              setSalaryRange([salaryRange[0] || 0, range[1]]);
              form.setFieldValue(['recruit_info', 'salary_range'], range);
            }}
          />
          <span className='text-gray-400 pl-2'>元/月</span>
        </Space>
      </Form.Item>

      <Form.Item label='意向地区'>
        <div className='space-y-4'>
          {/* 第一个意向地区 */}

          <Form.Item
            label='意向地区1'
            trigger='onConfirm'
            onClick={() => {
              setIntentionVisible1(true);
            }}
          >
            <CascadePicker
              options={areaData}
              visible={intentionVisible1}
              onClose={() => {
                setIntentionVisible1(false);
              }}
              value={intentionRegion1}
              onConfirm={handleIntentionRegionChange(0)}
            >
              {(items) => {
                if (items.every((item) => item === null)) {
                  return '请选择意向地区1';
                }
                return intentionRegion1.join('/') || '请选择意向地区1';
              }}
            </CascadePicker>
          </Form.Item>

          {/* 第二个意向地区 */}
          {areaCount >= 2 && (
            <div className='flex items-center gap-2'>
              <DeleteOutline className='text-red-500 flex-grow-0' onClick={() => handleDeleteArea(1)} />
              <Form.Item
                label='意向地区2'
                className='flex-grow'
                trigger='onConfirm'
                onClick={() => {
                  setIntentionVisible2(true);
                }}
              >
                <CascadePicker
                  options={areaData}
                  visible={intentionVisible2}
                  onClose={() => {
                    setIntentionVisible2(false);
                  }}
                  value={intentionRegion2}
                  onConfirm={handleIntentionRegionChange(1)}
                >
                  {(items) => {
                    if (items.every((item) => item === null)) {
                      return '请选择意向地区2';
                    }
                    return intentionRegion2.join('/') || '请选择意向地区2';
                  }}
                </CascadePicker>
              </Form.Item>
            </div>
          )}

          {/* 第三个意向地区 */}
          {areaCount >= 3 && (
            <div className='flex items-center gap-2'>
              <DeleteOutline className='text-red-500 flex-grow-0' onClick={() => handleDeleteArea(2)} />
              <Form.Item
                label='意向地区3'
                className='flex-grow'
                trigger='onConfirm'
                onClick={() => {
                  setIntentionVisible3(true);
                }}
              >
                <CascadePicker
                  options={areaData}
                  visible={intentionVisible3}
                  onClose={() => {
                    setIntentionVisible3(false);
                  }}
                  value={intentionRegion3}
                  onConfirm={handleIntentionRegionChange(2)}
                >
                  {(items) => {
                    if (items.every((item) => item === null)) {
                      return '请选择意向地区3';
                    }
                    return intentionRegion3.join('/') || '请选择意向地区3';
                  }}
                </CascadePicker>
              </Form.Item>
            </div>
          )}

          {areaCount < 3 && (
            <Button className='mt-2' block onClick={handleAddArea} size='small'>
              + 添加意向地区
            </Button>
          )}
        </div>
      </Form.Item>

      {/* 隐藏的意向地区数据 */}
      <Form.Item name={['recruit_info', 'intention_area']} hidden>
        <input type='hidden' />
      </Form.Item>
    </>
  );
};

export default BasicInfo;
