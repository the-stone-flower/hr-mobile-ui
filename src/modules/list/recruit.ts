import request from "../../utils/request";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { formatFormValue } from "../../utils/format";

export interface IRecruit {
  id: number;
  enterprise_name: string;
  social_credit: string;
  legal_person: string;
  account_id: string;
  signature_id: string;
  operator: number;
  operator_name: string;
  created_at: string;
  updated_at: string;
  auth_url?: string; // 假设认证 URL 是可选的
  edu_info_list: any;
  workexp_info_list: any;
  social_info_list: any;
}

interface IInitialState {
  search: string;
  loading: boolean;
  current: number;
  pageSize: number;
  total: number;
  dataList: IRecruit[];
  searchForm: IRecruit | undefined;
}

type IRecruitFilterParams = Partial<IRecruit> & {
  current?: number;
  pageSize?: number;
  search?: string;
  user_list?: (string | number)[];
};

const initialState: IInitialState = {
  search: "",
  loading: true,
  current: 1,
  pageSize: 10,
  total: 0,
  dataList: [],
  searchForm: undefined,
};

const namespace = "list/eaccount";

export const getList = createAsyncThunk(
  `${namespace}/getList`,
  async (params: IRecruitFilterParams, { getState }) => {
    const { current, pageSize, ...reset } = params;
    const state = getState() as RootState;
    const {
      current: cacheCurrent,
      pageSize: cachePageSize,
      searchForm,
    } = state.listRecruit;
    const payload = {
      ...searchForm,
      ...reset,
      page: current || cacheCurrent,
      page_size: pageSize || cachePageSize,
    };
    const { data } = await request.get("/recruit/ext/create_from_mobile/", {
      params: payload,
    });

    return {
      list: data?.results,
      total: data?.count,
      pageSize: payload.page_size,
      current: payload.page,
    };
  }
);

export const addListItem = createAsyncThunk(
  `${namespace}/addListItem`,
  async (item: IRecruitFilterParams, {}) => {
    const { edu_info_list, workexp_info_list, social_info_list, ...other } =
      item;
    const otherForm = formatFormValue(other);
    const eduList = edu_info_list.map((item: any) => formatFormValue(item));
    const workList = workexp_info_list.map((item: any) =>
      formatFormValue(item)
    );
    const socialList = social_info_list.map((item: any) =>
      formatFormValue(item)
    );
    const payload = {
      ...otherForm,
      edu_info_list: eduList,
      workexp_info_list: workList,
      social_info_list: socialList,
    };
    const { data } = await request.post(
      `/recruit/ext/create_from_mobile/`,
      payload
    );
    // await dispatch(getList({}));
    return data;
  }
);

export const deleteListItem = createAsyncThunk(
  `${namespace}/deleteListItem`,
  async (id: number, {}) => {
    await request.delete(`/recruit/ext/create_from_mobile/${id}/`);
    // await dispatch(getList({}));
    return id;
  }
);

export const editListItem = createAsyncThunk(
  `${namespace}/editListItem`,
  async (item: IRecruitFilterParams, {}) => {
    const { id, ...payload } = item;
    const { data } = await request.patch(
      `/recruit/ext/create_from_mobile/${id}/`,
      payload
    );
    // await dispatch(getList({}));
    return data;
  }
);

export const getListItem = createAsyncThunk(
  `${namespace}/getListItem`,
  async (item: IRecruitFilterParams, { dispatch }) => {
    const { data } = await request.get(
      `/recruit/ext/create_from_mobile/${item.id}/`,
      { params: item }
    );
    return data;
  }
);

export const getListItemFromId = createAsyncThunk(
  `${namespace}/getListItem`,
  async (item: IRecruitFilterParams, { dispatch }) => {
    const { data } = await request.get("/recruit/ext/detail_from_mobile/", {
      params: item,
    });
    return data;
  }
);

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

export const listState = (state: RootState) => state.listRecruit;

export default listSelectSlice.reducer;
