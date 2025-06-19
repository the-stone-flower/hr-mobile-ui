// src/components/Job/JobDetail.tsx
import React, { useState, useEffect } from 'react';
import { NavBar, Card, Space, Tag, Button, Toast, Empty, DotLoading } from 'antd-mobile';
import {
  EnvironmentOutline,
  CollectMoneyOutline,
  TeamOutline,
  GiftOutline,
  UserOutline,
  ClockCircleOutline,
  CheckCircleOutline,
} from 'antd-mobile-icons';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobPositionDetail } from '../../api/job';
import { JobPosition } from './JobTypes';
import jiayouzhan from '../../assets/jiayouzhan.png'; // 引入公司Logo
import './JobDetail.css'; // 稍后创建CSS文件

const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [jobDetail, setJobDetail] = useState<JobPosition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      if (!id) {
        setError('职位ID缺失');
        setLoading(false);
        return;
      }
      try {
        const data = await getJobPositionDetail(Number(id));

        setJobDetail(data);
      } catch (err) {
        console.error('Failed to fetch job detail:', err);
        setError('加载招聘需求详情失败，请稍后再试。');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const getSalaryDisplay = () => {
    if (!jobDetail) return '';
    if (jobDetail.salary_type === 'talk') {
      return '面议';
    }
    if (jobDetail.salary_start && jobDetail.salary_end) {
      return `￥${jobDetail.salary_start}-${jobDetail.salary_end}`;
    }
    if (jobDetail.salary_start) {
      return `￥${jobDetail.salary_start}起`;
    }
    return '面议';
  };

  const handleApplyJob = () => {
    // Toast.show({
    //   icon: 'success',
    //   content: '投递成功！',
    // });
    navigate('/apply');
    // 这里可以进一步处理投递逻辑，例如弹窗提示，或者跳转到我的投递页面
  };

  if (loading) {
    return (
      <div className='loading-container'>
        <DotLoading />
        <span>加载中...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className='error-container'>
        <Empty description={error} imageStyle={{ width: '96px', height: '96px' }} />
        <Button onClick={() => navigate(-1)} color='primary' fill='outline' style={{ marginTop: '20px' }}>
          返回列表
        </Button>
      </div>
    );
  }

  if (!jobDetail) {
    return (
      <div className='empty-container'>
        <Empty description='未找到该职位信息' imageStyle={{ width: '96px', height: '96px' }} />
        <Button onClick={() => navigate(-1)} color='primary' fill='outline' style={{ marginTop: '20px' }}>
          返回列表
        </Button>
      </div>
    );
  }

  return (
    <div className='job-detail-container'>
      <NavBar onBack={() => navigate(-1)} back='返回'>
        职位详情
      </NavBar>

      <div className='content-area'>
        <Card className='job-header-card'>
          <div className='job-detail-title'>{jobDetail.name}</div>
          <div className='company-detail-info'>
            <img src={jiayouzhan} alt='公司Logo' className='company-detail-logo' />
            <div>
              <div className='company-detail-name'>{jobDetail.client_name}</div>
              <small className='text-muted'>互联网/软件开发</small>{' '}
              {/* 这部分信息目前API未提供，暂时硬编码 */}
            </div>
          </div>
          {/* 薪资展示区域的修改开始 */}
          {jobDetail.salary_type_cn === '面议' ? (
            <div className='salary-negotiable-badge'>
              <CollectMoneyOutline className='icon' />
              面议
            </div>
          ) : (
            <div className='salary-highlight'>{getSalaryDisplay()}</div>
          )}
          {/* <div className='salary-highlight'>{getSalaryDisplay()}</div> */}
          <div className='job-tags detail-tags'>
            <Space wrap>
              {jobDetail.education_cn && (
                <Tag round color='default'>
                  {jobDetail.education_cn}
                </Tag>
              )}
              {jobDetail.work_years_cn && (
                <Tag round color='default'>
                  {jobDetail.work_years_cn}
                </Tag>
              )}
              {jobDetail.work_location && (
                <Tag round color='primary' className='location-tag flex'>
                  <EnvironmentOutline className='icon' />
                  {jobDetail.work_location}
                </Tag>
              )}
            </Space>
          </div>
        </Card>

        <Card className='content-section'>
          <div className='section-header'>
            <UserOutline className='icon' />
            基本信息
          </div>
          <div className='section-content info-grid'>
            <div className='info-item'>
              <div className='info-label'>招聘人数</div>
              <div className='info-value'>{jobDetail.count || '若干'}</div>
            </div>
            <div className='info-item'>
              <div className='info-label'>工作经验</div>
              <div className='info-value'>{jobDetail.work_years_cn || '不限'}</div>
            </div>
            <div className='info-item'>
              <div className='info-label'>学历要求</div>
              <div className='info-value'>{jobDetail.education_cn || '不限'}</div>
            </div>
            <div className='info-item'>
              <div className='info-label'>年龄要求</div>
              <div className='info-value'>不限</div> {/* API未提供年龄，暂时硬编码 */}
            </div>
          </div>
        </Card>

        <Card className='content-section'>
          <div className='section-header'>
            <ClockCircleOutline className='icon' />
            招聘简述
          </div>
          <div className='section-content job-description-content'>
            {/* description 可能包含换行符，使用 pre-wrap 保留格式 */}
            <p style={{ whiteSpace: 'pre-wrap' }}>{jobDetail.description}</p>
          </div>
        </Card>

        <Card className='content-section'>
          <div className='section-header'>
            <GiftOutline className='icon' />
            福利待遇
          </div>
          <div className='section-content benefits-grid'>
            {/* 福利待遇根据您之前的确认，如果API没有直接提供，暂时保留原型中的示例或根据description解析 */}
            <div className='benefit-item'>
              <div className='benefit-icon'>
                <CheckCircleOutline />
              </div>
              <div>五险一金</div>
            </div>
            <div className='benefit-item'>
              <div className='benefit-icon'>
                <EnvironmentOutline />
              </div>
              <div>带薪年假</div>
            </div>
            <div className='benefit-item'>
              <div className='benefit-icon'>
                <TeamOutline />
              </div>
              <div>培训机会</div>
            </div>

            {/* 更多福利项可以根据实际需求添加 */}
          </div>
        </Card>

        <Card className='content-section'>
          <div className='section-header'>
            <EnvironmentOutline className='icon' />
            工作地点
          </div>
          <div className='section-content'>
            <div className='mb-3'>
              <strong>{jobDetail.work_location}</strong>
              <br />
              {/* <small className='text-muted'>详细地址（如果API提供可以显示）</small> */}
            </div>
          </div>
        </Card>
      </div>

      <div className='bottom-actions'>
        <Button block color='primary' size='large' onClick={handleApplyJob}>
          立即投递
        </Button>
      </div>
    </div>
  );
};

export default JobDetail;
