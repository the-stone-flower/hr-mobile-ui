import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import request from '../../utils/request';

const namespace = 'options';

interface Option {
  label: string;
  value: number;
}

interface IOptions {
  key: string;
  name: string;
  type: string;
  api?: string;
  options: Option[];
}

export interface IAllOptions {
  org_type_options?: IOptions;
  client_type_options?: IOptions;
  handle_user_options?: IOptions;
  response_user_options?: IOptions;
  belong_humansource_comp_options?: IOptions;
  cost_type_options?: IOptions;
  business_response_options?: IOptions;
  staff_options?: IOptions;
  client_contract_options?: IOptions;
  sign_org_options?: IOptions;
  client_org_options?: IOptions;
  parent_options?: IOptions;
  director_options?: IOptions;
  staff_status_options?: IOptions;
  belong_company_options?: IOptions;
  org_options?: IOptions;
  group_list_options?: IOptions;
  contract_file_type_options?: IOptions;
  contract_term_options?: IOptions;
  sign_company_options?: IOptions;
  sign_type_options?: IOptions;
  contract_account_options?: IOptions;
  contract_temp_options?: IOptions;

  contract_term_type_options?: IOptions;
  contract_type_options?: IOptions;
  degree_options?: IOptions;
  duty_type_options?: IOptions;
  education_options?: IOptions;
  employee_type_options?: IOptions;
  employment_options?: IOptions;
  gender_options?: IOptions;
  health_type_options?: IOptions;
  id_type_options?: IOptions;
  is_veteran_options?: IOptions;
  job_title_level_options?: IOptions;
  job_type_options?: IOptions;
  marital_options?: IOptions;
  nation_options?: IOptions;
  native_place_options?: IOptions;
  organization_options?: IOptions;
  original_service_provider_options?: IOptions;
  physical_disability_options?: IOptions;
  political_options?: IOptions;
  position_change_options?: IOptions;
  position_options?: IOptions;
  probation_duration_options?: IOptions;
  professional_title_options?: IOptions;
  relation_options?: IOptions;
  rewards_punishment_options?: IOptions;
  second_degree_options?: IOptions;
  second_education_options?: IOptions;
  skill_levels_options?: IOptions;
  user_status_options?: IOptions;
  work_place_options?: IOptions;
  work_type_options?: IOptions;
  parent_org_options?: IOptions;
  child_org_list_options?: IOptions;

  // 薪酬管理的
  all_clients_options?: IOptions;
  salary_type_options?: IOptions;

  // 人员档案的
  client_options?: IOptions;
  // user_status_options?: IOptions;
}

interface IInitialState {
  allOptions: IAllOptions;
  loading: boolean;
}

const initialState: IInitialState = {
  allOptions: {},
  loading: true,
};

export const fetchOptions = createAsyncThunk(`${namespace}/fetchOptions`, async (name: string, { getState }) => {
  const { data } = await request.get(`/options/?name=${name}`);
  return data;
});

const optionsSlice = createSlice({
  name: namespace,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOptions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOptions.fulfilled, (state, action) => {
        state.allOptions = { ...state.allOptions, ...action.payload.data };
        state.loading = false;
      })
      .addCase(fetchOptions.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export const optionsSelector = (state: RootState) => state.options;

export default optionsSlice.reducer;
