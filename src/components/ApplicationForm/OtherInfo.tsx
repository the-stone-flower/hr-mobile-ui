import React from "react";
import { Form, TextArea, ImageUploader, Toast } from "antd-mobile";
import { TabProps } from "./types";
import { useAppDispatch } from "modules/store";
import { uploadFile, validateFile } from "modules/list/recruit";
import { ImageUploadItem } from "antd-mobile/es/components/image-uploader";

const OtherInfo: React.FC<TabProps> = ({ form }) => {
  const dispatch = useAppDispatch();

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

  // 获取个人照片的文件列表
  const getPhotoFileList = (): ImageUploadItem[] => {
    const photo = form.getFieldValue("pers_photo");
    const url = Array.isArray(photo) ? photo?.[0]?.url : photo;

    return url ? [{url: url}] : [];
  };

  return (
    <>
      <Form.Item
        name="pers_profile"
        label="个人简介"
        rules={[{ required: false, message: "请输入个人简介" }]}
      >
        <TextArea
          placeholder="请输入个人简介或自我评价"
          maxLength={500}
          autoSize={{ minRows: 3, maxRows: 5 }}
        />
      </Form.Item>

      <Form.Item
        name="social_media_account"
        label="社交媒体账号"
        rules={[{ required: false, message: "请输入社交媒体账号" }]}
      >
        <TextArea
          placeholder="请输入社交媒体账号"
          maxLength={100}
          autoSize={{ minRows: 1, maxRows: 3 }}
        />
      </Form.Item>

      <Form.Item
        name="pers_photo"
        label="个人照片"
        rules={[{ required: false, message: "请上传个人照片" }]}
        extra="支持jpg、png格式，大小不超过5M"
      >
        <ImageUploader
          value={getPhotoFileList()}
          upload={handleUpload}
          maxCount={1}
          accept="image/*"
          showUpload={getPhotoFileList().length === 0}
        />
      </Form.Item>
    </>
  );
};

export default OtherInfo;
