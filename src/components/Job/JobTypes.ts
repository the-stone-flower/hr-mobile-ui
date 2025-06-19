// src/components/Job/JobTypes.ts
export interface JobPosition {
  id: number;
  client_name: string;
  education: number;
  education_cn: string;
  work_years: number;
  work_years_cn: string;
  operator_name: string;
  name: string;
  salary_type: 'range' | 'talk';
  salary_start: number | null;
  salary_end: number | null;
  description: string;
  work_location: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  operator: number;
  client: number[];
  count?: string; // 招聘人数 (详情页的count字段)
  salary_type_cn?: string; // 薪资类型中文 (详情页的字段)
  published_at?: string; // 发布时间 (虽然在列表数据中，但用published_at表示更明确)
}

export interface JobPositionListResponse {
  data: {
    count: number;
    next: string | null;
    previous: string | null;
    results: JobPosition[];
  };
  status: number;
  statusText: string;
}

export interface JobFilterParams {
  search?: string;
  client?: number;
  education?: number;
  work_years?: number;
  work_location?: string; // 工作地点直接是字符串
  salary_start?: number;
  salary_end?: number;
  page?: number;
  page_size?: number;
}

export interface OptionItem {
  value: string | number;
  label: string;
}

// 示例：学历选项 (如果后端options接口提供了，可以用它)
export const educationOptions: OptionItem[] = [
  { value: '', label: '不限' },
  { value: 1, label: '小学' },
  { value: 2, label: '初中' },
  { value: 3, label: '高中' },
  { value: 4, label: '中专/中技' },
  { value: 5, label: '大专' },
  { value: 6, label: '本科' },
  { value: 7, label: '硕士' },
  { value: 8, label: '博士' },
];

// 示例：工作年限选项
export const workYearsOptions: OptionItem[] = [
  { value: '', label: '不限' },
  { value: 0, label: '应届生' }, // 通常用0或者特定值表示应届生
  { value: 1, label: '1年以下' },
  { value: 2, label: '1-3年' },
  { value: 3, label: '3-5年' },
  { value: 4, label: '5-10年' },
  { value: 5, label: '10年以上' },
];

// 示例：薪资范围选项
export const salaryRangeOptions: OptionItem[] = [
  { value: '', label: '不限' },
  { value: '0-5000', label: '5K以下' },
  { value: '5000-10000', label: '5K-10K' },
  { value: '10000-15000', label: '10K-15K' },
  { value: '15000-25000', label: '15K-25K' },
  { value: '25000-50000', label: '25K-50K' },
  { value: '50000+', label: '50K以上' },
];

// 示例：工作地点选项 (这里可能需要根据实际数据来填充)
export const workLocationOptions: OptionItem[] = [
  { value: '', label: '不限' },
  { value: '北京', label: '北京' },
  { value: '上海', label: '上海' },
  { value: '广州', label: '广州' },
  { value: '深圳', label: '深圳' },
  { value: '杭州', label: '杭州' },
  { value: '成都', label: '成都' },
  { value: '双流', label: '双流' },
  { value: '高新区', label: '高新区' },
];
