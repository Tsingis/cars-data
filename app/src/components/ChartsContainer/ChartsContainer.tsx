import React from "react"
import { useTranslation } from "react-i18next"
import Slider from "react-slick"
import { type Count } from "../../types"
import PieChart from "../PieChart/PieChart"
import BarChart from "../BarChart/BarChart"
import LineChart from "../LineChart/LineChart"
import TreeMapChart from "../TreeMapChart/TreeMapChart"
import TopList from "../TopList/TopList"
import { colors, drivingForceColors, drivingForceLabels } from "../../constants"
import { formatMileageLabel } from "../../utility"
import "./ChartsContainer.modules.css"

const ChartsContainer = ({
  selectedMunicipality,
}: {
  selectedMunicipality: {
    mileageCount: Count | null
    drivingForce: Count | null
    color: Count | null
    registrationYear: Count | null
    maker: Count | null
  }
}) => {
  const { t } = useTranslation()

  const dfLabels = Object.keys(drivingForceLabels).reduce(
    (acc, key) => {
      acc[key] = t(drivingForceLabels[key])
      return acc
    },
    {} as { [key: string]: string }
  )

  const mileageLabels = selectedMunicipality.mileageCount
    ? Object.keys(selectedMunicipality.mileageCount).reduce(
        (acc, key) => {
          acc[key] = formatMileageLabel(key)
          return acc
        },
        {} as { [key: string]: string }
      )
    : {}

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    adaptiveHeight: true,
    swipeToSlide: true,
  }

  if (
    !selectedMunicipality.mileageCount ||
    !selectedMunicipality.drivingForce ||
    !selectedMunicipality.color ||
    !selectedMunicipality.registrationYear ||
    !selectedMunicipality.maker
  ) {
    return null
  }

  return (
    <Slider {...settings}>
      <PieChart
        data={selectedMunicipality.drivingForce}
        colorMap={drivingForceColors}
        labelMap={dfLabels}
        title={t("Labels.DrivingForce")}
      />
      <BarChart
        data={selectedMunicipality.mileageCount}
        xAxisLabelMap={mileageLabels}
        title={t("Labels.Mileage")}
        yAxisText={t("Labels.Count")}
      />
      <LineChart
        data={selectedMunicipality.registrationYear}
        title={t("Labels.RegistrationYear")}
        yAxisText={t("Labels.Count")}
        firstXAxisLabelText="<1980"
      />
      <TreeMapChart
        data={selectedMunicipality.color}
        colorMap={colors}
        title={t("Labels.Color")}
      />
      <TopList
        data={selectedMunicipality.maker}
        topX={30}
        title={t("Labels.TopNMakers", { count: 30 })}
      />
    </Slider>
  )
}

export default ChartsContainer
