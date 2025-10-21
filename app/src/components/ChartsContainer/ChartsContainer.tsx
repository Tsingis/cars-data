import { useTranslation } from "react-i18next";
import { colors, drivingForceColors } from "../../constants";
import type { Count, DrivingForces } from "../../types";
import { formatMileageLabel } from "../../utility";
import BarChart from "../BarChart/BarChart";
import Carousel from "../Carousel/Carousel";
import LineChart from "../LineChart/LineChart";
import PieChart from "../PieChart/PieChart";
import TopList from "../TopList/TopList";
import TreeMapChart from "../TreeMapChart/TreeMapChart";
import styles from "./ChartsContainer.module.css";

const ChartsContainer = ({
  selectedMunicipality,
}: {
  selectedMunicipality: {
    mileageCount: Count | null;
    drivingForce: Count | null;
    color: Count | null;
    registrationYear: Count | null;
    maker: Count | null;
  };
}) => {
  const { t } = useTranslation();

  const dfLabels = Object.keys(selectedMunicipality.drivingForce ?? {}).reduce(
    (acc, key) => {
      acc[key] = t(($) => $.drivingForces[key as DrivingForces]);
      return acc;
    },
    {} as { [key: string]: string }
  );

  const mileageLabels = selectedMunicipality.mileageCount
    ? Object.keys(selectedMunicipality.mileageCount).reduce(
        (acc, key) => {
          acc[key] = formatMileageLabel(key);
          return acc;
        },
        {} as { [key: string]: string }
      )
    : {};

  if (
    !selectedMunicipality.mileageCount ||
    !selectedMunicipality.drivingForce ||
    !selectedMunicipality.color ||
    !selectedMunicipality.registrationYear ||
    !selectedMunicipality.maker
  ) {
    return null;
  }

  return (
    <Carousel
      infinite={true}
      dots={true}
      speed={500}
      swipeToSlide={true}
      adaptiveHeight={true}
    >
      <PieChart
        data={selectedMunicipality.drivingForce}
        colorMap={drivingForceColors}
        labelMap={dfLabels}
        title={t(($) => $.labels.drivingForce)}
        className={styles.chartContainer}
      />
      <BarChart
        data={selectedMunicipality.mileageCount}
        xAxisLabelMap={mileageLabels}
        title={t(($) => $.labels.mileage)}
        yAxisText={t(($) => $.labels.count)}
        className={styles.chartContainer}
      />
      <LineChart
        data={selectedMunicipality.registrationYear}
        title={t(($) => $.labels.registrationYear)}
        yAxisText={t(($) => $.labels.count)}
        firstXAxisLabelText="<1980"
        className={styles.chartContainer}
      />
      <TreeMapChart
        data={selectedMunicipality.color}
        colorMap={colors}
        title={t(($) => $.labels.color)}
        className={styles.chartContainer}
      />
      <TopList
        data={selectedMunicipality.maker}
        topX={30}
        title={t(($) => $.labels.topNMakers, { count: 30 })}
        className={styles.chartContainer}
      />
    </Carousel>
  );
};

export default ChartsContainer;
