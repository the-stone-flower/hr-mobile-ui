// src/api/job.ts
import request from '../utils/request';
import { JobPosition, JobPositionListResponse, JobFilterParams } from '../components/Job/JobTypes';

/**
 * 获取招聘岗位列表
 * @param params 筛选和搜索参数
 * @returns Promise<JobPositionListResponse>
 */
export const getJobPositions = (params?: JobFilterParams): Promise<JobPositionListResponse> => {
  return request.get('/recruit/mobile_recruit_request/', { params });
};

/**
 * 获取单个招聘岗位详情
 * @param id 岗位ID
 * @returns Promise<JobPosition>
 */
export const getJobPositionDetail = (id: number): Promise<JobPosition> => {
  // 注意：后端详情接口是 /recruit/mobile_recruit_request/?id=1
  return request.get(`/recruit/mobile_recruit_request/${id}`).then((response) => {
    // 后端返回的是一个列表，但详情是单条，取第一条
    return response.data;
  });
};

// 如果需要获取筛选选项的API，可以添加类似如下函数
// export const getJobOptions = (): Promise<any> => {
//   return request.get('/options/?name=create_job_position_options');
// };
