import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ChartsContainer from "../../components/ChartsContainer/ChartsContainer";
import Loading from "../../components/Loading/Loading";
import SearchableDropdown from "../../components/SearchableDropdown/SearchableDropdown";
import { locales } from "../../constants";
import type { Count, Municipality } from "../../types";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./HomePage.module.css";

const dataUrl =
  import.meta.env.VITE_DATA_URL?.trim() || "http://localhost:8000/data.json";

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState<{
    date: string;
    municipalities: Municipality[];
  } | null>(null);

  const [selectedMunicipality, setSelectedMunicipality] = useState<{
    mileageCount: Count | null;
    drivingForce: Count | null;
    color: Count | null;
    registrationYear: Count | null;
    maker: Count | null;
  }>({
    mileageCount: null,
    drivingForce: null,
    color: null,
    registrationYear: null,
    maker: null,
  });

  const [initialOption, setInitialOption] = useState<{
    code: string;
    name: string;
  } | null>(null);

  const [translatedInitialOption, setTranslatedInitialOption] = useState<{
    code: string;
    name: string;
  } | null>(null);

  const [searchOptions, setSearchOptions] = useState<
    { code: string; name: string }[]
  >([]);

  const [translatedSearchOptions, setTranslatedSearchOptions] = useState<
    { code: string; name: string }[]
  >([]);

  const [errorMessage, setErrorMessage] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    fetch(dataUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("My error");
        }
        return response.json();
      })
      .then((content) => {
        setData(content);
        const municipalities = content.municipalities;
        municipalities.sort((a: Municipality, b: Municipality) =>
          a.code.localeCompare(b.code)
        );

        const initialMunicipality = municipalities[0];

        if (initialMunicipality) {
          setInitialOption({
            code: initialMunicipality.code,
            name: initialMunicipality.name,
          });
          setSelectedMunicipality({
            mileageCount: initialMunicipality.mileageCount,
            drivingForce: initialMunicipality.drivingForceCount,
            color: initialMunicipality.colorCount,
            registrationYear: initialMunicipality.registrationYearCount,
            maker: initialMunicipality.makerCount,
          });
        }

        const options = [
          initialMunicipality,
          ...municipalities
            .slice(1, -1)
            .sort((a: Municipality, b: Municipality) =>
              a.name.localeCompare(b.name, locales.fi)
            ),
          municipalities[municipalities.length - 1],
        ];

        setSearchOptions(options);
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage("Error.Fetch");
      });
  }, []);

  useEffect(() => {
    if (errorMessage) {
      navigate("/error", {
        state: { message: t(errorMessage) },
      });
    }
  }, [errorMessage, navigate, t]);

  useEffect(() => {
    if (initialOption) {
      setTranslatedInitialOption({
        code: initialOption.code,
        name: t(`Areas.${initialOption.name}`),
      });
    }
  }, [t, initialOption]);

  useEffect(() => {
    setTranslatedSearchOptions(
      searchOptions.map((option) => ({
        code: option.code,
        name:
          option.name === "Finland" || option.name === "Unknown"
            ? t(`Areas.${option.name}`)
            : option.name,
      }))
    );
  }, [t, searchOptions]);

  if (!data) {
    return <Loading size="6x" />;
  }

  const date: Date = new Date(data.date);
  const municipalities: Municipality[] = data.municipalities;

  const handleSelect = (
    selectedOption: { code: string; name: string } | null
  ) => {
    if (selectedOption) {
      const municipality = municipalities.find(
        (m) => m.code === selectedOption.code
      );
      if (municipality) {
        setSelectedMunicipality({
          mileageCount: municipality.mileageCount,
          drivingForce: municipality.drivingForceCount,
          color: municipality.colorCount,
          registrationYear: municipality.registrationYearCount,
          maker: municipality.makerCount,
        });
      }
    }
  };

  const totalCount = selectedMunicipality.drivingForce
    ? Object.values(selectedMunicipality.drivingForce).reduce(
        (sum, count) => (sum ?? 0) + (count ?? 0),
        0
      )
    : 0;

  return (
    <div
      data-testid="homepage"
      className={styles.homeContainer}
      aria-label="Home Page"
    >
      <h1 className={styles.homeTitle}>{t("Common.Title")}</h1>
      <div data-testid="datadate" className={styles.dataDate}>
        {t("Common.DataUpdatedOn")}{" "}
        {date.toLocaleDateString(locales[i18n.language], {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>
      <div className={styles.controlsContainer}>
        <SearchableDropdown
          options={translatedSearchOptions}
          onSelect={handleSelect}
          initialValue={translatedInitialOption}
        />
        <div>
          {t("Labels.Count")}: {totalCount}
        </div>
      </div>
      {selectedMunicipality.mileageCount &&
        selectedMunicipality.drivingForce &&
        selectedMunicipality.color &&
        selectedMunicipality.registrationYear &&
        selectedMunicipality.maker && (
          <ChartsContainer selectedMunicipality={selectedMunicipality} />
        )}
    </div>
  );
};

export default HomePage;
