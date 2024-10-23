// import { debounce, DebouncedFunc } from "lodash";

interface MatchItem {
  label: string;
  value: string | string[] | null;
}

export function flattenMatchMap(match_map: MatchItem[]): string[] {
  return match_map
    .filter(
      (item): item is MatchItem & { value: string | string[] } =>
        item.value !== null
    )
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
    if (key === "physical_disability" && value) {
      result[key] = ["", value];
      return;
    }

    // 处理基础信息中的日期字段
    if (["birthday", "join_party_date"].includes(key) && value) {
      if (value) {
        result[key] = new Date(value);
      } else {
        return new Date();
      }
      return;
    }

    // 处理基础信息中的选择器
    if (
      [
        "nation",
        "political",
        "marital_status",
        "employment",
        "degree",
      ].includes(key)
    ) {
      result[key] = [value];
      return;
    }

    // 处理教育经历列表
    if (key === "edu_info_list" && Array.isArray(value)) {
      result[key] = value.map((item) => {
        const processedItem: any = {};
        Object.entries(item).forEach(([itemKey, itemValue]: [any, any]) => {
          if (!itemValue) return;

          // 处理日期
          if (itemKey === "graduated_date") {
            processedItem[itemKey] = new Date(itemValue);
            return;
          }

          // 处理选择器字段
          if (["education_type", "education", "degree"].includes(itemKey)) {
            processedItem[itemKey] = [itemValue];
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
    if (key === "workexp_info_list" && Array.isArray(value)) {
      result[key] = value.map((item) => {
        const processedItem: any = {};
        Object.entries(item).forEach(([itemKey, itemValue]: [any, any]) => {
          if (!itemValue) return;

          // 处理日期字段
          if (["start_date", "end_date"].includes(itemKey)) {
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
    if (key === "social_info_list" && Array.isArray(value)) {
      result[key] = value.map((item) => {
        const processedItem: any = {};
        Object.entries(item).forEach(([itemKey, itemValue]: [any, any]) => {
          if (!itemValue) return;

          // 处理日期字段
          if (itemKey === "birthday") {
            processedItem[itemKey] = new Date(itemValue);
            return;
          }

          // 处理选择器字段
          if (itemKey === "relation") {
            processedItem[itemKey] = [itemValue];
            return;
          }

          // 处理布尔值字段
          if (["is_client_staff", "is_emergency_contact"].includes(itemKey)) {
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

    // 处理其他非空值
    if (value !== null && value !== undefined && value !== "") {
      result[key] = String(value);
      if (key === "gender") {
        result[key] = Number(value);
      }
    }
  });
  return result;
}
