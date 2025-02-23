export type Mapping = Record<string, string>

export type Count = Record<string, number | undefined>

export type Municipality = {
  code: string
  name: string
  mileageCount: Count
  drivingForceCount: Count
  colorCount: Count
  registrationYearCount: Count
  makerCount: Count
}
