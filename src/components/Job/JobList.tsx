// src/components/Job/JobList.tsx
import React, { useState, useEffect } from 'react';
import { NavBar, SearchBar, PullToRefresh, List, Empty, DotLoading, InfiniteScroll } from 'antd-mobile';
import { FilterOutline } from 'antd-mobile-icons';
import { useNavigate } from 'react-router-dom';
import JobCard from './JobCard';
import FilterModal from './FilterModal';
import { getJobPositions } from '../../api/job';
import { JobPosition, JobFilterParams, JobPositionListResponse } from './JobTypes';
import './JobList.css'; // 稍后创建CSS文件

const JobList: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobPosition[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10); // 每页数量
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<JobFilterParams>({});

  const fetchJobs = async (
    pageNum: number,
    isRefresh: boolean = false,
    filters: JobFilterParams = currentFilters,
    search: string = searchKeyword,
  ) => {
    if (loading) return;
    setLoading(true);
    try {
      const params: JobFilterParams = {
        ...filters,
        search: search || undefined, // 如果搜索关键词为空，则不传 search 参数
        page: pageNum,
        page_size: pageSize,
      };

      const res: JobPositionListResponse = await getJobPositions(params);
      const { data } = res
      const newJobs = data.results || [];
      if (isRefresh) {
        setJobs(newJobs);
      } else {
        setJobs(prevJobs => [...prevJobs, ...newJobs]);
      }
      setHasMore(data.next !== null); // 根据 next 字段判断是否有更多数据
      setPage(pageNum);
    } catch (error) {
      console.error('Failed to fetch job positions:', error);
      // Toast.show({
      //   content: '加载失败',
      //   icon: 'fail',
      // });
      setHasMore(false); // 加载失败则没有更多数据
    } finally {
      setLoading(false);
    }
  };

  // 初次加载和筛选、搜索变化时
  useEffect(() => {
    setJobs([]); // 清空现有数据
    setPage(1); // 重置页码
    setHasMore(true); // 重置有更多数据状态
    fetchJobs(1, true, currentFilters, searchKeyword);
  }, [currentFilters, searchKeyword]); // 依赖筛选条件和搜索关键词

  const onRefresh = async () => {
    setJobs([]);
    setPage(1);
    setHasMore(true);
    await fetchJobs(1, true, currentFilters, searchKeyword);
  };

  const loadMore = async () => {
    if (!hasMore || loading) return;
    await fetchJobs(page + 1, false, currentFilters, searchKeyword);
  };

  const handleSearch = (val: string) => {
    setSearchKeyword(val);
  };

  const handleFilterApply = (filters: JobFilterParams) => {
    setCurrentFilters(filters);
    setFilterVisible(false);
  };

  const goToJobDetail = (id: number) => {
    navigate(`/job/${id}`);
  };

  return (
    <div className="job-list-container">
      <NavBar
        backArrow={false}
        right={
          <FilterOutline
            style={{ fontSize: 24 }}
            onClick={() => setFilterVisible(true)}
          />
        }
      >
        招聘岗位
      </NavBar>

      <div className="search-sticky-container">
        <SearchBar
          placeholder="搜索职位、公司..."
          value={searchKeyword}
          onChange={handleSearch}
          className="job-search-bar"
        />
      </div>

      <PullToRefresh onRefresh={onRefresh}>
        {jobs.length === 0 && !loading && !hasMore ? (
          <Empty
            description="暂无匹配的职位"
            imageStyle={{ width: '64px', height: '64px' }}
          />
        ) : (
          <List className="job-cards-list">
            {jobs.map(job => (
              <JobCard key={job.id} job={job} onClick={goToJobDetail} />
            ))}
            <InfiniteScroll loadMore={loadMore} hasMore={hasMore}>
              {hasMore ? (
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                  <DotLoading />
                  <span> 加载中...</span>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '10px 0', color: '#999' }}>
                  {jobs.length > 0 ? '到底了' : ''}
                </div>
              )}
            </InfiniteScroll>
          </List>
        )}
      </PullToRefresh>

      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        initialFilters={currentFilters}
        onApply={handleFilterApply}
      />
    </div>
  );
};

export default JobList;
