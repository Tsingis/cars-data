import type en from "./i18n/locales/en.json";

export type Mapping = Record<string, string>;

export type Count = Record<string, number | undefined>;

export type Municipality = {
  code: string;
  name: string;
  mileageCount: Count;
  drivingForceCount: Count;
  colorCount: Count;
  registrationYearCount: Count;
  makerCount: Count;
};

export type Areas = keyof typeof en.areas;
export type Colors = keyof typeof en.colors;
export type Common = keyof typeof en.common;
export type DrivingForces = keyof typeof en.drivingForces;
export type Dropdown = keyof typeof en.dropdown;
export type ErrorMessage = keyof typeof en.errorMessage;
export type Labels = keyof typeof en.labels;
