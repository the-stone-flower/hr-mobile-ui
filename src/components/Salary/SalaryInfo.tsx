import React from 'react';
import { List, Empty, Card } from 'antd-mobile';
import { ISalaryDetails } from 'modules/list/salary';

interface SalaryInfoProps {
  salaryDetails: ISalaryDetails | null;
}

const SalaryInfo: React.FC<SalaryInfoProps> = ({ salaryDetails }) => {
  if (!salaryDetails) {
    return <Empty description='本月暂无工资数据' />;
  }

  // 获取工资收入项（过滤掉0值项）
  const incomeItems = salaryDetails.extra_columns.columns.filter(
    (col) =>
      col.item !== '扣除小计' &&
      !col.item.includes('代扣') &&
      !['养老保险', '失业保险', '医疗保险', '工伤保险', '住房公积金'].includes(col.item),
  );

  // 获取扣除项（不包括扣除小计）
  const deductionItems = salaryDetails.extra_columns.columns.filter(
    (col) =>
      col.item !== '扣除小计' && // 排除扣除小计
      (col.item.includes('代扣') ||
        ['养老保险', '失业保险', '医疗保险', '工伤保险', '住房公积金'].includes(col.item)),
  );

  // 获取扣除小计
  const deductionTotal = salaryDetails.extra_columns.columns.find((col) => col.item === '扣除小计');

  // 格式化金额
  const formatAmount = (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <div className='space-y-3 pb-6'>
      {/* 工资总额卡片 */}

      <Card className='rounded-lg overflow-hidden'>
        <div className='relative text-center py-6'>
          {/* 背景渐变 */}

          <div className='absolute inset-0 bg-gradient-to-r from-transparent via-rose-50/50 to-transparent' />

          {/* 内容 */}
          <div className='relative'>
            <div className='text-gray-500 text-sm mb-2'>工资总计</div>
            <div className='text-2xl font-bold text-black-500'>
              ¥ {formatAmount(salaryDetails.after_tax_salary)}
            </div>
          </div>
        </div>
      </Card>

      {/* 工资总计卡片 */}
      <Card className='rounded-lg'>
        <div className='px-1 py-2'>
          <div className='text-base font-medium text-gray-700 mb-3 pl-3'>税前工资</div>
          <div className='flex justify-between items-center px-3 py-2 bg-gray-50 rounded-lg'>
            <span>税前总额</span>
            <span className='font-medium text-gray-900'>¥ {formatAmount(salaryDetails.pre_tax_salary)}</span>
          </div>
        </div>
      </Card>

      {/* 收入明细卡片 */}
      <Card className='rounded-lg'>
        <div className='px-1 py-2'>
          <div className='text-base font-medium text-gray-700 mb-3 pl-3'>收入明细</div>
          <div className='space-y-2'>
            {incomeItems.map((item, index) => (
              <div
                key={item.value_id}
                className={`flex justify-between items-center px-3 py-2 rounded-lg transition-colors hover:bg-gray-50
                  ${index % 2 === 1 ? 'bg-gray-100/50' : ''}`}
              >
                <span className='text-gray-600'>{item.item}</span>
                <span className='font-medium text-gray-900'>¥ {formatAmount(item.value)}</span>
              </div>
            ))}
            {/* 使用后端返回的税前工资作为收入合计 */}
            <div className='flex justify-between items-center px-3 py-3 border-t border-gray-100 mt-3'>
              <span className='font-medium text-gray-700'>收入合计</span>
              <span className='font-medium text-lg text-gray-900'>
                ¥ {formatAmount(salaryDetails.pre_tax_salary)}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* 扣除项目卡片 */}
      <Card className='rounded-lg'>
        <div className='px-1 py-2'>
          <div className='text-base font-medium text-gray-700 mb-3 pl-3'>扣除项目</div>
          <div className='space-y-2'>
            {/* 先显示具体扣除项 */}
            {deductionItems?.map((item, index) => (
              <div
                key={item.value_id}
                className={`flex justify-between items-center px-3 py-2 rounded-lg transition-colors hover:bg-gray-50
            ${index % 2 === 1 ? 'bg-gray-100/50' : ''}`}
              >
                <span className='text-gray-600'>{item.item}</span>
                <span className='font-medium text-black-500'>- ¥ {formatAmount(item.value)}</span>
              </div>
            ))}

            {/* 最后显示扣除小计 */}
            {deductionTotal && (
              <div className='flex justify-between items-center px-3 py-3 border-t border-gray-100 mt-3'>
                <span className='font-medium text-gray-700'>{deductionTotal.item}</span>
                <span className='font-medium text-lg text-black-500'>
                  - ¥ {formatAmount(deductionTotal.value)}
                </span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* 实发工资卡片 */}
      <Card className='rounded-lg'>
        <div className='px-1 py-2'>
          <div className='text-base font-medium text-gray-700 mb-3 pl-3'>实发工资</div>
          <div className='flex justify-between items-center px-3 py-3 bg-primary/5 rounded-lg'>
            <span className='font-medium'>实发金额</span>
            <span className='text-lg font-bold text-primary'>
              ¥ {formatAmount(salaryDetails.after_tax_salary)}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SalaryInfo;
