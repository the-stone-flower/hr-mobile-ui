import React, { useState, useEffect, useCallback } from 'react';
import { Form, Button, Toast, Tabs, SpinLoading } from 'antd-mobile';
import { useAppDispatch, useAppSelector } from 'modules/store';
import { fetchOptions, optionsSelector } from 'modules/options/index';
import { addListItem, getListItemFromId } from 'modules/list/recruit';
import { tabConfigs } from './config';
import { CheckCircleFill } from 'antd-mobile-icons';
import { filterNullValues } from 'utils/index';
import { healthInfoFormDataProcessor, legalInfoFormDataProcessor } from 'utils/formDataProcessor';

const ApplicationForm: React.FC = () => {
  const [form] = Form.useForm();
  const [activeKey, setActiveKey] = useState('1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const dispatch = useAppDispatch();
  const { allOptions } = useAppSelector(optionsSelector);

  useEffect(() => {
    dispatch(fetchOptions('create_ext_user_options'));
  }, [dispatch]);

  const handleIdNumberChange = useCallback(
    async (idNumber: string) => {
      try {
        const { health_info, legal_info, recruit_info, ...res } = await dispatch(
          getListItemFromId({ id_number: idNumber }),
        ).unwrap();

        if (res) {
          const processedData = filterNullValues(res);
          form.setFieldsValue({
            ...processedData,
            recruit_info,
            health_info: healthInfoFormDataProcessor(health_info).toInput(),
            legal_info: legalInfoFormDataProcessor(legal_info).toInput(),
          });

          Toast.show({
            icon: 'success',
            content: '已自动填充历史数据',
          });
        }
      } catch (error) {
        console.log('未找到历史数据');
      }
    },
    [dispatch],
  );
  const handleNext = async () => {
    try {
      const currentTabConfig = tabConfigs.find((config) => config.key === activeKey);
      if (currentTabConfig) {
        await form.validateFields(currentTabConfig.fields);
      }
      const currentIndex = tabConfigs.findIndex((config) => config.key === activeKey);
      if (currentIndex < tabConfigs.length - 1) {
        setActiveKey(tabConfigs[currentIndex + 1].key);
      }
    } catch (errorInfo) {
      console.log('Validation Failed:', errorInfo);
      Toast.show({
        icon: 'fail',
        content: '请填写当前页面的所有必填字段！',
      });
    }
  };

  const handlePrevious = () => {
    const currentIndex = tabConfigs.findIndex((config) => config.key === activeKey);
    if (currentIndex > 0) {
      setActiveKey(tabConfigs[currentIndex - 1].key);
    }
  };

  const onFinish = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();
      console.log('Raw Form values:', values);

      const processedValues = {
        ...values,
        edu_info_list: values.edu_info_list || [],
        workexp_info_list: values.workexp_info_list || [],
        social_info_list: values.social_info_list || [],
        health_info: values.health_info || {},
        legal_info: values.legal_info || {},
      };
      // 特殊处理残疾类型
      if (processedValues.physical_disability) {
        processedValues.physical_disability = processedValues.physical_disability[1];
      }
      console.log('Processed Form values:', processedValues);

      await dispatch(addListItem(processedValues)).unwrap();
      setIsSubmitted(true);
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
      Toast.show({
        icon: 'fail',
        content: '请填写所有必填字段！',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderNavigationButtons = () => {
    const currentIndex = tabConfigs.findIndex((config) => config.key === activeKey);
    const isFirstTab = currentIndex === 0;
    const isLastTab = currentIndex === tabConfigs.length - 1;

    return (
      <div className='flex justify-between mt-6 mb-10 mx-4 gap-4'>
        {!isFirstTab && (
          <Button className='flex-grow' onClick={handlePrevious}>
            上一步
          </Button>
        )}
        {!isLastTab && (
          <Button className='flex-grow' onClick={handleNext}>
            下一步
          </Button>
        )}
        {isLastTab && (
          <Button
            color='primary'
            onClick={onFinish}
            loading={isSubmitting}
            loadingText='提交中'
            className='flex-grow'
          >
            {isSubmitting ? <SpinLoading /> : '提交'}
          </Button>
        )}
      </div>
    );
  };

  if (isSubmitted) {
    return (
      <div className='flex flex-col items-center justify-center h-screen'>
        <CheckCircleFill className='text-green-500 text-6xl mb-4' />
        <p className='text-xl'>登记提交成功</p>
      </div>
    );
  }

  return (
    <div className='app-container'>
      <div className='form-wrapper mb-4'>
        <h1 className='form-title'>应聘登记表</h1>
        <Form form={form} mode='card'>
          <Tabs activeKey={activeKey} onChange={setActiveKey}>
            {tabConfigs.map(({ key, title, component: TabComponent }) => (
              <Tabs.Tab title={title} key={key}>
                <TabComponent
                  form={form}
                  allOptions={allOptions}
                  onIdNumberChange={key === '1' ? handleIdNumberChange : undefined}
                />
              </Tabs.Tab>
            ))}
          </Tabs>
          {renderNavigationButtons()}
        </Form>
      </div>
    </div>
  );
};

export default ApplicationForm;
