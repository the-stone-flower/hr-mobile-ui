import React, { useState, useEffect } from 'react';
import { Form, Input, Radio, DatePicker, ImageUploader, Toast } from 'antd-mobile';
import { uploadFile, validateFile } from 'modules/list/recruit';
import { AddCircleOutline } from 'antd-mobile-icons';
import { useAppDispatch } from 'modules/store';
import dayjs from 'dayjs';

import type { TabProps } from './types';

enum HadCriminalRecord {
  Yes = 'true',
  No = 'false',
}

const FORM_SPACE = 'legal_info';

const getDateDisplayText = (
  form,
  value: Date | null | undefined,
  formFieldName: string,
  defaultText: string,
) => {
  // FIXME 深层桥套类型，需要 formFieldName 可以是数组
  const dateValue = value || form.getFieldValue([FORM_SPACE, formFieldName]);
  return dateValue ? dayjs(dateValue).format('YYYY-MM-DD') : defaultText;
};

const CriminalRecord: React.FC<TabProps> = ({ form, allOptions }) => {
  return (
    <div className='adm-list-item'>
      <h4 className='font-medium' style={{ fontSize: '15px' }}>
        犯罪记录
      </h4>
      <Form.Array
        name={[FORM_SPACE, 'criminal_record']}
        onAdd={(operation) => operation.add({})}
        renderAdd={() => (
          <div className='flex justify-center items-center'>
            <AddCircleOutline className='mr-2' /> 添加犯罪记录
          </div>
        )}
        renderHeader={({ index }, { remove }) => (
          <>
            <span>犯罪记录{index + 1}</span>
            <a onClick={() => remove(index)} className='float-right text-blue-500'>
              删除
            </a>
          </>
        )}
      >
        {(fields) =>
          fields.map(({ index }) => (
            <>
              <Form.Item name={[index, 'name']} label='记录名称'>
                <Input placeholder='请出入犯罪记录名称' />
              </Form.Item>
              <Form.Item name={[index, 'desc']} label='记录描述'>
                <Input placeholder='请输入记录描述' />
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
                  {(value) => getDateDisplayText(form, value, 'start_time', '请选择开始时间')}
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
                  {(value) => getDateDisplayText(form, value, 'end_time', '请选择结束时间')}
                </DatePicker>
              </Form.Item>
            </>
          ))
        }
      </Form.Array>
    </div>
  );
};

const LegalInfo: React.FC<TabProps> = ({ form, allOptions }) => {
  const dispatch = useAppDispatch();
  const [toggleRecord, setToggleRecord] = useState(false);

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

  useEffect(() => {
    const isCri = form.getFieldValue([FORM_SPACE, 'is_criminal_record']);
    setToggleRecord(isCri === HadCriminalRecord.Yes);
  }, [form.getFieldValue([FORM_SPACE, 'is_criminal_record'])]);

  return (
    <>
      <Form.Item
        name={[FORM_SPACE, 'is_criminal_record']}
        label='有无犯罪记录'
        rules={[{ required: true, message: '请选择有无犯罪记录' }]}
      >
        <Radio.Group
          onChange={(value) => {
            setToggleRecord(value === HadCriminalRecord.Yes);
          }}
        >
          <Radio value={HadCriminalRecord.No}>无</Radio>
          <Radio value={HadCriminalRecord.Yes}>有</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item name={[FORM_SPACE, 'attach_file']} label='附件'>
        <ImageUploader
          // value={getFileList(index)}
          upload={handleUpload}
          maxCount={1}
          accept='image/*,.pdf'
        />
      </Form.Item>

      {toggleRecord && <CriminalRecord form={form} allOptions={allOptions} />}

      <Form.Item
        name={[FORM_SPACE, 'credit_report，']}
        label='征信记录'
        rules={[{ required: true, message: '请上传征信记录' }]}
      >
        <ImageUploader
          // value={getFileList(index)}
          upload={handleUpload}
          maxCount={1}
          accept='image/*,.pdf'
        />
      </Form.Item>

      <div className='adm-list-item'>
        <h4 className='font-medium' style={{ fontSize: '15px' }}>
          其他法律记录
        </h4>
        <Form.Array
          name={[FORM_SPACE, 'other_legal_record']}
          onAdd={(operation) => operation.add({})}
          renderAdd={() => (
            <div className='flex justify-center items-center'>
              <AddCircleOutline className='mr-2' /> 添加法律记录
            </div>
          )}
          renderHeader={({ index }, { remove }) => (
            <>
              <span>法律记录{index + 1}</span>
              <a onClick={() => remove(index)} className='float-right text-blue-500'>
                删除
              </a>
            </>
          )}
        >
          {(fields) =>
            fields.map(({ index }) => (
              <>
                <Form.Item name={[index, 'name']} label='记录名称'>
                  <Input placeholder='请出入法律记录名称' />
                </Form.Item>
                <Form.Item name={[index, 'desc']} label='记录描述'>
                  <Input placeholder='请输入记录描述' />
                </Form.Item>
                <Form.Item
                  name={[index, 'start_time']}
                  label='开始时间'
                  trigger='onConfirm'
                  onClick={(e, pickerRef) => {
                    pickerRef.current?.open();
                  }}
                >
                  <DatePicker min={new Date(1924, 0, 1)} max={new Date()} precision='day'>
                    {(value) => getDateDisplayText(form, value, 'start_time', '请选择开始时间')}
                  </DatePicker>
                </Form.Item>
                <Form.Item
                  name={[index, 'end_time']}
                  label='结束时间'
                  trigger='onConfirm'
                  onClick={(e, pickerRef) => {
                    pickerRef.current?.open();
                  }}
                >
                  <DatePicker min={new Date(1924, 0, 1)} max={new Date()} precision='day'>
                    {(value) => getDateDisplayText(form, value, 'end_time', '请选择结束时间')}
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

export default LegalInfo;
