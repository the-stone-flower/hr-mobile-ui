import request from "../../utils/request";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { formatFormValue } from "../../utils/format";
import { Toast } from 'antd-mobile';
import { TOKEN_NAME } from 'configs';

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
  auth_url?: string;
  edu_info_list: any;
  workexp_info_list: any;
  social_info_list: any;
  skill_info_list: any;
}

interface IInitialState {
  search: string;
  loading: boolean;
  current: number;
  pageSize: number;
  total: number;
  dataList: IRecruit[];
  searchForm: IRecruit | undefined;
  uploadLoading: boolean;
  uploadError: string | null;
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
  uploadLoading: false,
  uploadError: null,
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

export const uploadFile = createAsyncThunk(
  `${namespace}/uploadFile`,
  async (file: { raw: File, name: string }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      if (file.raw instanceof File) {
        formData.append('file', file.raw, file.name);
      } else {
        throw new Error('Invalid file object');
      }

      const { data } = await request.post('/file_upload/free_resource/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Content-Disposition': `attachment; filename="${encodeURIComponent(file.name || '')}"`
        },
      });

      return data;
    } catch (error: any) {
      Toast.show({
        icon: 'fail',
        content: '文件上传失败'
      });
      return rejectWithValue(error.message || '文件上传失败');
    }
  }
);

const formateListInfo = (listInfo: any) => {
  if (!listInfo) return []
  const infoList = Array.isArray(listInfo)
    ? listInfo
    : Object.values(listInfo);
  return infoList?.map((item: any) => formatFormValue(item))
}

export const addListItem = createAsyncThunk(
  `${namespace}/addListItem`,
  async (items: any, { }) => {
    const {
      edu_info_list,
      workexp_info_list,
      social_info_list,
      skill_info_list,
      ...other
    } = items;
    const payload = {
      ...formatFormValue(other),
    };
    // 是列表的字段需要在这加上，进行列表里面的字段格式化
    const listInfo = ['edu_info_list', 'workexp_info_list', 'social_info_list', 'skill_info_list']
    listInfo.forEach((key) => {
      if (items[key] && items[key].length) {
        payload[key] = formateListInfo(items[key])
      }
    })

    const { data } = await request.post(
      `/recruit/ext/create_from_mobile/`,
      payload
    );
    return data;
  }
);

export const deleteListItem = createAsyncThunk(
  `${namespace}/deleteListItem`,
  async (id: number, { }) => {
    await request.delete(`/recruit/ext/create_from_mobile/${id}/`);
    return id;
  }
);

export const editListItem = createAsyncThunk(
  `${namespace}/editListItem`,
  async (item: IRecruitFilterParams, { }) => {
    const { id, ...payload } = item;
    const { data } = await request.patch(
      `/recruit/ext/create_from_mobile/${id}/`,
      payload
    );
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
  async (payload: any, { dispatch }) => {
    const { data } = await request.post(
      "/recruit/ext/detail_from_mobile/",
      payload
    );
    return data;
  }
);

export const validateFile = (file: File, options: {
  maxSize?: number;
  acceptedTypes?: string[];
} = {}) => {
  const {
    maxSize = 10 * 1024 * 1024,
    acceptedTypes = ['image/*', '.pdf', '.doc', '.docx']
  } = options;

  if (file.size > maxSize) {
    Toast.show({
      icon: 'fail',
      content: `文件大小不能超过 ${Math.floor(maxSize / 1024 / 1024)}MB`
    });
    return false;
  }

  const fileType = file.type;
  const fileName = file.name.toLowerCase();
  const isValidType = acceptedTypes.some(type => {
    if (type.includes('*')) {
      return fileType.includes(type.replace('*', ''));
    }
    return fileName.endsWith(type);
  });

  if (!isValidType) {
    Toast.show({
      icon: 'fail',
      content: '不支持的文件类型'
    });
    return false;
  }

  return true;
};

const listSelectSlice = createSlice({
  name: namespace,
  initialState,
  reducers: {
    clearPageState: () => initialState,
    setSearchForm: (state, action) => {
      state.searchForm = action.payload;
    },
    clearUploadError: (state) => {
      state.uploadError = null;
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
      })
      .addCase(uploadFile.pending, (state) => {
        state.uploadLoading = true;
        state.uploadError = null;
      })
      .addCase(uploadFile.fulfilled, (state) => {
        state.uploadLoading = false;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.uploadLoading = false;
        state.uploadError = action.payload as string;
      })
  },
});

export const { clearPageState, setSearchForm, clearUploadError } = listSelectSlice.actions;

export const listState = (state: RootState) => state.listRecruit;
export const uploadState = (state: RootState) => ({
  loading: state.listRecruit.uploadLoading,
  error: state.listRecruit.uploadError,
});

export default listSelectSlice.reducer;
