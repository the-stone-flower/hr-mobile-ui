const serArray = (value) => (Array.isArray(value) ? value : [value]);
const deserArray = (value) => (Array.isArray(value) ? value.join('') : value);
const serBoolean = (value) => value === 'true';
const deserBoolean = (value) => (value === true ? 'true' : 'false');
const serDate = (value) => value ? new Date(value) : new Date();

export const healthInfoFormDataProcessor = (formData) => {
  function toInput() {
    const health_type = serArray(formData.health_type);
    const allergy_history = formData.allergy_history?.map((item) => ({
      ...item,
      start_time: serDate(item.start_time),
      end_time: serDate(item.end_time),
    }));
    const past_medical_history = formData.past_medical_history?.map((item) => ({
      ...item,
      start_time: serDate(item.start_time),
      end_time: serDate(item.end_time),
    }));
    return { ...formData, health_type, allergy_history, past_medical_history };
  }

  function toPayload() {
    const health_type = deserArray(formData.health_type);
    return { ...formData, health_type };
  }

  return { toInput, toPayload };
};

export const legalInfoFormDataProcessor = (formData) => {
  function toInput() {
    const is_criminal_record = deserBoolean(formData.is_criminal_record);
    const criminal_record = formData.criminal_record?.map((item) => ({
      ...item,
      start_time: serDate(item.start_time),
      end_time: serDate(item.end_time),
    }));
    const other_legal_record = formData.other_legal_record?.map((item) => ({
      ...item,
      start_time: serDate(item.start_time),
      end_time: serDate(item.end_time),
    }));
    return { ...formData, is_criminal_record, criminal_record, other_legal_record };
  }

  function toPayload() {
    const is_criminal_record = serBoolean(formData.is_criminal_record);
    if (!is_criminal_record) {
      formData.criminal_record = [];
    }
    return { ...formData, is_criminal_record };
  }

  return { toInput, toPayload };
};
