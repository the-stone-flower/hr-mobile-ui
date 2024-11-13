const serArray = (value) => (Array.isArray(value) ? value : [value]);
const deserArray = (value) => (Array.isArray(value) ? value.join('') : value);
const serBoolean = (value) => value === 'true';
const deserBoolean = (value) => (value === true ? 'true' : 'false');
const serDate = (value) => (value ? new Date(value) : new Date());
const serCascade = (value) => (value ? ['', value] : []);
const serPhoto = (value) => (value ? [{ url: value }] : []);
const deserCascade = (value) => (value && value.length ? value[1] : null);
const deserPhoto = (value) => (value && value.length ? value[0].url : null);

export const healthInfoFormDataProcessor = (formData) => {
  function toInput() {
    const health_type = serArray(formData.health_type || '');
    const physical_disability = serCascade(formData.physical_disability);
    const military_physical_disability = serCascade(formData.military_physical_disability);
    const disability_file = serPhoto(formData.disability_file);
    const military_disability_file = serPhoto(formData.military_disability_file);
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
    return {
      ...formData,
      health_type,
      allergy_history,
      past_medical_history,
      physical_disability,
      military_physical_disability,
      disability_file,
      military_disability_file,
    };
  }

  function toPayload() {
    const health_type = deserArray(formData.health_type);
    const physical_disability = deserCascade(formData.physical_disability);
    const military_physical_disability = deserCascade(formData.military_physical_disability);
    const disability_file = deserPhoto(formData.disability_file);
    const military_disability_file = deserPhoto(formData.military_disability_file);

    return {
      ...formData,
      health_type: health_type || null,
      physical_disability,
      military_physical_disability,
      disability_file,
      military_disability_file,
    };
  }

  return { toInput, toPayload };
};

export const legalInfoFormDataProcessor = (formData) => {
  function toInput() {
    const is_criminal_record = deserBoolean(formData.is_criminal_record);
    const attach_file = serPhoto(formData.attach_file);
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
    return { ...formData, is_criminal_record, criminal_record, other_legal_record, attach_file };
  }

  function toPayload() {
    const is_criminal_record = serBoolean(formData.is_criminal_record);
    const attach_file = deserPhoto(formData.attach_file);
    if (!is_criminal_record) {
      formData.criminal_record = [];
    }
    return { ...formData, is_criminal_record, attach_file };
  }

  return { toInput, toPayload };
};
