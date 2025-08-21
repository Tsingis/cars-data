import { t } from "i18next";

export const formatMileageLabel = (label: string): string => {
  if (label === "na") {
    return t(($) => $.labels.notAvailableAbbreviation);
  }
  if (label.startsWith("under")) {
    return `<${label.replace("under", "")}`;
  }
  if (label.startsWith("over")) {
    return `>${label.replace("over", "")}`;
  }
  const [start, end] = label.split("to");
  return `${start}-${end}`;
};
