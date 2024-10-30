import request from 'utils/request';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { formatFormValue } from 'utils/format';

// types/salary.ts
interface SalaryColumn {
  value_id: number;
  item: string;
  value: number;
}

interface SalaryTemplate {
  id: number;
  name: string;
}

export interface ISalaryDetails {
  id: number;
  employee_name: string;
  employee_client: string;
  employee_org: string;
  employee_belong_hc: string;
  salary_date: string;
  salary_pay_date: string | null;
  salary_type_cn: string;
  salary_status_cn: string;
  extra_columns: {
    templates: SalaryTemplate[];
    columns: SalaryColumn[];
  };
  salary_type: number;
  salary_status: number;
  remarks: string;
  pre_tax_salary: string;
  taxable_salary: string;
  personal_income_tax: string;
  after_tax_salary: string;
  salary_template: any;
}

interface IInitialState {
  ext_user: string;
  loading: boolean;
  current: number;
  pageSize: number;
  total: number;
  dataList: ISalaryDetails[];
  searchForm: ISalaryDetails | undefined;
}

type ISalaryDetailsFilterParams = Partial<ISalaryDetails> & {
  current?: number;
  pageSize?: number;
  // ext_user?: string;
};

const initialState: IInitialState = {
  ext_user: '',
  loading: true,
  current: 1,
  pageSize: 10,
  total: 0,
  dataList: [],
  searchForm: undefined,
};

const namespace = 'list/salaryRecord';

export const getList = createAsyncThunk(
  `${namespace}/getList`,
  async (params: ISalaryDetailsFilterParams, { getState }) => {
    const { current, pageSize, ...reset } = params;
    const state = getState() as RootState;
    const { current: cacheCurrent, pageSize: cachePageSize, searchForm } = state.listISalaryDetails;
    const payload = {
      ...formatFormValue(searchForm),
      ...reset,
      page: current || cacheCurrent,
      page_size: pageSize || cachePageSize,
    };
    const { data } = await request.get('salary/mobile/slip/', {
      params: payload,
    });

    return {
      list: data?.results,
      total: data?.count,
      pageSize: payload.page_size,
      current: payload.page,
    };
  },
);

export const getListItem = createAsyncThunk(
  `${namespace}/getListItem`,
  async (item: ISalaryDetailsFilterParams, { dispatch }) => {
    const { data } = await request.get(`salary/mobile/slip/${item.id}/`, { params: item });
    return data;
  },
);

export const addListItem = createAsyncThunk(`${namespace}/addListItem`, async (item: any, { dispatch }) => {
  const { data } = await request.post(`salary/mobile/slip/`, item);
  return data;
});

export const getSalaryDetails = createAsyncThunk(
  `${namespace}/getSalaryDetails`,
  async (item: any, { dispatch }) => {
    const { data } = await request.post(`salary/mobile/slip/`, item);
    return data;
  },
);

export const deleteListItem = createAsyncThunk(
  `${namespace}/deleteListItem`,
  async (id: number, { dispatch }) => {
    await request.delete(`salary/mobile/slip/${id}/`);

    return id;
  },
);

export const editListItem = createAsyncThunk(`${namespace}/editListItem`, async (item: any, { dispatch }) => {
  const { id, ...payload } = item;
  const { data } = await request.patch(`salary/mobile/slip/${id}/`, payload);
  return data;
});

const listSelectSlice = createSlice({
  name: namespace,
  initialState,
  reducers: {
    clearPageState: () => initialState,
    setSearchForm: (state, action) => {
      state.searchForm = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getList.fulfilled, (state, action) => {
        state.loading = false;
        state.dataList = action.payload?.list;
        state.total = action.payload?.total;
        state.pageSize = action.payload?.pageSize;
        state.current = action.payload?.current;
      })
      .addCase(getList.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { clearPageState, setSearchForm } = listSelectSlice.actions;

export const listState = (state: RootState) => state.listISalaryDetails;

export default listSelectSlice.reducer;
