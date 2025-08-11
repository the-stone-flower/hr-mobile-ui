import React, { useState, useEffect } from "react";
import { Form, Picker, DatePicker, Button, ImageUploader, Toast, Input } from "antd-mobile";
import { TabProps } from "./types";
import { useAppDispatch } from "modules/store";
import { uploadFile, validateFile } from "modules/list/recruit";
import { ImageUploadItem } from "antd-mobile/es/components/image-uploader";
import dayjs from "dayjs";

interface TitleRecord {
  nvq: string;
  title_desc: string;
  evaluate_date: string;
  attach_file: string;
}

const TitleExperience: React.FC<TabProps> = ({ form, allOptions }) => {
  const dispatch = useAppDispatch();
  const [localTitleList, setLocalTitleList] = useState<TitleRecord[]>([]);

  // 监听表单值变化，设置初始值
  useEffect(() => {
    const formTitleList = form.getFieldValue("pro_title_list");
    if (formTitleList && Array.isArray(formTitleList)) {
      setLocalTitleList(formTitleList);
    }
  }, [form.getFieldValue("pro_title_list")]);

  // 处理添加职业资格记录
  const handleAddTitle = () => {
    setLocalTitleList([...localTitleList, {}]);
  };

  // 处理删除职业资格记录
  const handleRemoveTitle = (index: number) => {
    const newList = localTitleList.filter((_: any, i: number) => i !== index);
    setLocalTitleList(newList);
  };

  // 处理文件上传
  const handleUpload = async (file: File) => {
    if (!validateFile(file)) return null;

    try {
      const fileObject = {
        raw: file,
        name: file.name
      };

      const result = await dispatch(uploadFile(fileObject)).unwrap();
      return {
        url: result.file
      };
    } catch (error) {
      Toast.show({
        icon: 'fail',
        content: '文件上传失败'
      });
      return null;
    }
  };

  // 获取当前索引的文件列表
  const getFileList = (index: number): ImageUploadItem[] => {
    const attach_file = form.getFieldValue(["pro_title_list", String(index), "attach_file"]);
    const url = Array.isArray(attach_file) ? attach_file?.[0]?.url : attach_file
    return url ? [{url}] : [];
  };

  // 辅助函数：获取选择器显示文本
  const getPickerDisplayText = (
    value: any,
    options: any[],
    defaultText: string,
    formFieldPath?: string[]
  ) => {
    if (value?.[0]?.label) {
      return value[0].label;
    }

    const formValue = formFieldPath ? form.getFieldValue(formFieldPath) : value;
    if (formValue) {
      const actualValue = Array.isArray(formValue) ? formValue[0] : formValue;
      const option = options?.find((opt) =>
        opt.id === actualValue || opt.value === actualValue || opt.value === formValue
      );
      return option?.name || option?.label || defaultText;
    }

    return defaultText;
  };

  // 辅助函数：获取日期显示文本
  const getDateDisplayText = (
    value: Date | null | undefined,
    formFieldPath: string[],
    defaultText: string
  ) => {
    const dateValue = value || form.getFieldValue(formFieldPath);
    return dateValue ? dayjs(dateValue).format("YYYY-MM-DD") : defaultText;
  };

  return (
    <>
      {localTitleList.map((_: any, index: number) => (
        <div key={index}>
          <h4 className="font-bold ml-2 my-2">职业资格记录 {index + 1}</h4>
          <Form.Item
            name={["pro_title_list", String(index), "nvq"]}
            label="职业资格类型"
            rules={[{ required: true, message: "请选择职业资格类型" }]}
            trigger="onConfirm"
            onClick={(e, pickerRef) => {
              pickerRef.current?.open();
            }}
          >
            <Picker
              columns={[allOptions.nvq_options?.options.map((item: any) => ({
                label: item.label || item.name,
                value: item.value || item.id
              })) || []]}
            >
              {(value) =>
                getPickerDisplayText(
                  value,
                  allOptions.nvq_options?.options || [],
                  "请选择职业资格类型",
                  ["pro_title_list", String(index), "nvq"]
                )
              }
            </Picker>
          </Form.Item>

          <Form.Item
            name={["pro_title_list", String(index), "title_desc"]}
            label="资质资格描述"
            rules={[{ required: true, message: "请输入资质资格描述" }]}
          >
            <Input placeholder="请输入资质资格描述" />
          </Form.Item>

          <Form.Item
            name={["pro_title_list", String(index), "evaluate_date"]}
            label="评定时间"
            rules={[{ required: true, message: "请选择评定时间" }]}
            trigger="onConfirm"
            onClick={(e, datePickerRef) => {
              datePickerRef.current?.open();
            }}
          >
            <DatePicker
              min={new Date(1924, 0, 1)}
              max={new Date()}
              precision="day"
            >
              {(value) =>
                getDateDisplayText(
                  value,
                  ["pro_title_list", String(index), "evaluate_date"],
                  "请选择评定时间"
                )
              }
            </DatePicker>
          </Form.Item>

          <Form.Item
            name={["pro_title_list", String(index), "attach_file"]}
            label="附件"
            rules={[{ required: true, message: "请选择附件" }]}
          >
            <ImageUploader
              // value={getFileList(index)}
              upload={handleUpload}
              maxCount={1}
              accept="image/*,.pdf,.doc,.docx"
            />
          </Form.Item>

          <div className="flex justify-end mb-4">
            <Button
              color="danger"
              size="small"
              onClick={() => handleRemoveTitle(index)}
            >
              删除此职业资格
            </Button>
          </div>
        </div>
      ))}
      <div className="flex justify-center mt-2">
        <Button color="success" onClick={handleAddTitle}>
          + 添加职业资格
        </Button>
      </div>
    </>
  );
};

export default TitleExperience;
