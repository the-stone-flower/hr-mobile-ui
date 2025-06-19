// src/components/Job/JobCard.tsx
import React from 'react';
import { Card, Space, Tag } from 'antd-mobile';
import {
  EnvironmentOutline,
  CalendarOutline,
  TeamOutline,
} from 'antd-mobile-icons';
import { JobPosition } from './JobTypes';
import './JobCard.css'; // 稍后创建这个CSS文件

interface JobCardProps {
  job: JobPosition;
  onClick: (id: number) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onClick }) => {
  const getSalaryDisplay = () => {
    if (job.salary_type === 'talk') {
      return '面议';
    }
    if (job.salary_start && job.salary_end) {
      return `￥${job.salary_start}-${job.salary_end}`;
    }
    if (job.salary_start) {
      return `￥${job.salary_start}起`;
    }
    return '面议'; // Fallback
  };

  const getPublishedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN'); // 格式化日期
  };

  return (
    <Card className="job-card" onClick={() => onClick(job.id)}>
      <div className="job-card-header">
        <div className="job-title">{job.name}</div>
        <div className="company-name">
          <TeamOutline className="icon" />
          {job.client_name}
        </div>
      </div>
      <div className="job-tags">
        <Space wrap>
          {job.education_cn && <Tag round color="default">{job.education_cn}</Tag>}
          {job.work_years_cn && <Tag round color="default">{job.work_years_cn}</Tag>}
          <Tag round color="warning" className="salary-tag flex items-center mt-[5px]">
            <EnvironmentOutline className="icon" />
            {getSalaryDisplay()}
          </Tag>
          {job.work_location && (
            <Tag round color="primary" className="location-tag flex items-center mt-[5px]">
              <EnvironmentOutline className="icon" />
              {job.work_location}
            </Tag>
          )}
        </Space>
      </div>
      <div className="job-meta">
        <div className="job-date">
          <CalendarOutline className="icon" />
          {job.published_at ? `${getPublishedDate(job.published_at)} 发布` : '暂无发布日期'}
        </div>
        {/* 可以根据 is_active 或其他状态显示职位状态 */}
        {/* <div className="job-status">在招</div> */}
      </div>
    </Card>
  );
};

export default JobCard;
