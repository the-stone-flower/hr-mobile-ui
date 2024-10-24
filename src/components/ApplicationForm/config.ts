import BasicInfo from "./BasicInfo";
import ContactInfo from "./ContactInfo";
import EducationInfo from "./EducationInfo";
import WorkExperience from "./WorkExperience";
import FamilyInfo from "./FamilyInfo";
import SkillInfo from "./SkillInfo";
import OtherInfo from './OtherInfo'
import { TabConfig } from "./types";

export const tabConfigs: TabConfig[] = [
  {
    key: "1",
    title: "基本信息",
    component: BasicInfo,
    fields: [
      "name",
      "id_number",
      "contact_way",
      "employment",
      "gender",
      "birthday",
      "age",
      "nation",
      "native_place",
      "political",
      "join_party_date",
      "marital_status",
      "is_veteran",
      "physical_disability",
    ],
  },
  {
    key: "2",
    title: "联系信息",
    component: ContactInfo,
    fields: [
      "email",
      "wechat",
      "family_address",
      "post_code",
      "postal_address",
      "emergency_contact",
      "emergency_contact_relation",
      "emergency_contact_way",
      "emergency_address",
    ],
  },
  {
    key: "3",
    title: "教育背景",
    component: EducationInfo,
    fields: ["edu_info_list"],
  },
  {
    key: "4",
    title: "工作履历",
    component: WorkExperience,
    fields: ["workexp_info_list"],
  },
  {
    key: "5",
    title: "家庭信息",
    component: FamilyInfo,
    fields: ["social_info_list"],
  },
  {
    key: "6",
    title: "技能信息",
    component: SkillInfo,
    fields: ["skill_info_list"],
  },
  {
    key: "7",
    title: "其他信息",
    component: OtherInfo,
    fields: ["pers_profile", 'social_media_account', 'pers_photo'],
  },
];
