import dayjs from "dayjs";

export const formatTime = (
  time: string | number | Date | dayjs.Dayjs,
  pattern: string = "YYYY-MM-DD HH:mm:ss"
) => {
  if (!time) {
    return "";
  }
  return dayjs(time).format(pattern);
};
export const formatDate = (
  time: string | number | Date | dayjs.Dayjs,
  pattern: string = "YYYY-MM-DD"
) => {
  if (!time) {
    return "";
  }
  return dayjs(time).format(pattern);
};

export const formatMoney = (money: string) => {
  return money;
};

export const formatRangeValue = (value: any) => {
  if (Array.isArray(value)) {
    return value.join(",");
  }
  return "";
};

export const formatFormValue = (form: any) => {
  if (!form) return {};
  const newForm: any = {};
  Object.keys(form).forEach((key) => {
    let value = form[key];
    if (Array.isArray(value)) {
      if (typeof value[0] === 'object' && value[0].url) {
        value = value[0].url
      } else {
        value = value.join(",");
      }
    }
    if (value instanceof Date) {
      value = formatDate(value);
    }
    if (value !== "" && value !== undefined && value !== null) {
      newForm[key] = value;
    }
  });
  return newForm;
};
