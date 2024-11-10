// import { debounce, DebouncedFunc } from "lodash";

interface MatchItem {
  label: string;
  value: string | string[] | null;
}

export const ADDRESS_REGEX =
  /(?<province>[^省]+省|[^自治区]+自治区|.+市)(?<city>[^自治州]+自治州|.+区划|[^市]+市|.+区)?(?<county>[^市]+市|[^县]+县|[^旗]+旗|.+区)?(?<town>[^区]+区|.+镇)?(?<village>.*)/;

export function flattenMatchMap(match_map: MatchItem[]): string[] {
  return match_map
    .filter((item): item is MatchItem & { value: string | string[] } => item.value !== null)
    .flatMap((item) => (Array.isArray(item.value) ? item.value : [item.value]));
}

//
// export function debounceSearch<T extends (...args: any[]) => any>(
//   func: T,
//   wait: number = 500
// ): DebouncedFunc<T> {
//   return debounce(func, wait);
// }

export function filterNullValues(obj: any) {
  const result: any = {};
  Object.entries(obj).forEach(([key, value]: [any, any]) => {
    // 处理级联选择器
    if (key === 'physical_disability' && value) {
      result[key] = ['', value];
      return;
    }

    // 处理基础信息中的日期字段
    if (['birthday', 'join_party_date'].includes(key) && value) {
      result[key] = new Date(value);
      return;
    }

    // 处理基础信息中的选择器
    if (['nation', 'political', 'marital_status', 'employment', 'degree'].includes(key)) {
      result[key] = [value];
      return;
    }

    // 处理基础信息中的照片
    if (['pers_photo', 'id_front_file', 'id_back_file', 'discharge_military_file'].includes(key)) {
      result[key] = [
        {
          url: value,
        },
      ];
      return;
    }

    // 处理教育经历列表
    if (key === 'edu_info_list' && Array.isArray(value)) {
      result[key] = value.map((item) => {
        const processedItem: any = {};
        Object.entries(item).forEach(([itemKey, itemValue]: [any, any]) => {
          if (!itemValue && itemValue !== false) return;

          // 处理日期
          if (itemKey === 'graduate_date') {
            processedItem[itemKey] = new Date(itemValue);
            return;
          }

          // 处理选择器字段
          if (['education_type', 'education', 'degree'].includes(itemKey)) {
            processedItem[itemKey] = [itemValue];
            return;
          }

          // 处理图片字段
          if (['graduated_attach_file', 'degree_attach_file'].includes(itemKey)) {
            processedItem[itemKey] = itemValue ? [{ url: itemValue }] : [];
            return;
          }

          // 其他字段直接赋值
          processedItem[itemKey] = itemValue;
        });
        return processedItem;
      });
      return;
    }

    // 处理工作经历列表
    if (key === 'workexp_info_list' && Array.isArray(value)) {
      result[key] = value.map((item) => {
        const processedItem: any = {};
        Object.entries(item).forEach(([itemKey, itemValue]: [any, any]) => {
          if (!itemValue && itemValue !== false) return;

          // 处理日期字段
          if (['start_date', 'end_date'].includes(itemKey)) {
            processedItem[itemKey] = new Date(itemValue);
            return;
          }

          // 其他字段直接赋值
          processedItem[itemKey] = itemValue;
        });
        return processedItem;
      });
      return;
    }

    // 处理家庭成员列表
    if (key === 'social_info_list' && Array.isArray(value)) {
      result[key] = value.map((item) => {
        const processedItem: any = {};
        Object.entries(item).forEach(([itemKey, itemValue]: [any, any]) => {
          if (!itemValue && itemValue !== false) return;

          // 处理日期字段
          if (itemKey === 'birthday') {
            processedItem[itemKey] = new Date(itemValue);
            return;
          }

          // 处理选择器字段
          if (itemKey === 'relation') {
            processedItem[itemKey] = [itemValue];
            return;
          }

          // 处理布尔值字段
          if (['is_client_staff', 'is_emergency_contact'].includes(itemKey)) {
            processedItem[itemKey] = String(itemValue);
            return;
          }

          // 其他字段直接赋值
          processedItem[itemKey] = itemValue;
        });
        return processedItem;
      });
      return;
    }

    // 处理技能记录列表
    if (key === 'skill_info_list' && Array.isArray(value)) {
      result[key] = value.map((item) => {
        const processedItem: any = {};
        Object.entries(item).forEach(([itemKey, itemValue]: [any, any]) => {
          if (!itemValue && itemValue !== false) return;

          // 处理日期字段
          if (itemKey === 'skill_date') {
            processedItem[itemKey] = new Date(itemValue);
            return;
          }

          // 处理选择器字段
          if (['skill_level_dir', 'skill_level'].includes(itemKey)) {
            processedItem[itemKey] = [itemValue];
            return;
          }

          // 处理附件
          if (itemKey === 'attach_file') {
            processedItem[itemKey] = itemValue ? [{ url: itemValue }] : [];
            return;
          }

          // 其他字段直接赋值
          processedItem[itemKey] = itemValue;
        });
        return processedItem;
      });
      return;
    }

    // 处理职业资格列表
    if (key === 'pro_title_list' && Array.isArray(value)) {
      result[key] = value.map((item) => {
        const processedItem: any = {};
        Object.entries(item).forEach(([itemKey, itemValue]: [any, any]) => {
          if (!itemValue && itemValue !== false) return;

          // 处理日期字段
          if (itemKey === 'evaluate_date') {
            processedItem[itemKey] = new Date(itemValue);
            return;
          }

          // 处理选择器字段
          if (itemKey === 'nvq') {
            processedItem[itemKey] = [itemValue];
            return;
          }

          // 处理附件
          if (itemKey === 'attach_file') {
            processedItem[itemKey] = itemValue ? [{ url: itemValue }] : [];
            return;
          }

          // 其他字段直接赋值（如 title_desc）
          processedItem[itemKey] = itemValue;
        });
        return processedItem;
      });
      return;
    }

    // 处理其他非空值
    if (value !== null && value !== undefined && value !== '') {
      result[key] = String(value);
      if (key === 'gender') {
        result[key] = Number(value);
      }
    }
    // 为null的直接删掉
    if (value === null) {
      delete result[key];
    }
  });
  return result;
}
