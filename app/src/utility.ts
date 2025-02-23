export const formatMileageLabel = (label: string): string => {
  if (label.startsWith("under")) {
    return `<${label.replace("under", "")}`
  }
  if (label.startsWith("over")) {
    return `>${label.replace("over", "")}`
  }
  const [start, end] = label.split("to")
  return `${start}-${end}`
}
