import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import Loading from "../../components/Loading/Loading"
import PieChart from "../../components/PieChart/PieChart"
import BarChart from "../../components/BarChart/BarChart"
import LineChart from "../../components/LineChart/LineChart"
import TopList from "../../components/TopList/TopList"
import SearchableDropdown from "../../components/SearchableDropdown/SearchableDropdown"
import LanguageSwitch from "../../components/LanguageSwitch/LanguageSwitch"
import { Count, Municipality } from "../../types"
import {
  colors,
  drivingForceColors,
  drivingForceLabels,
  colorLabels,
} from "../../constants"
import { getLocale } from "../../i18n"
import "./HomePage.modules.css"

const HomePage = () => {
  const { t, i18n } = useTranslation()
  const [data, setData] = useState<{
    date: string
    municipalities: Municipality[]
  } | null>(null)

  const [selectedMunicipality, setSelectedMunicipality] = useState<{
    drivingForce: Count | null
    color: Count | null
    registrationYear: Count | null
    maker: Count | null
  }>({
    drivingForce: null,
    color: null,
    registrationYear: null,
    maker: null,
  })

  const [initialOption, setInitialOption] = useState<{
    code: string
    name: string
  } | null>(null)

  const [translatedInitialOption, setTranslatedInitialOption] = useState<{
    code: string
    name: string
  } | null>(null)

  const [searchOptions, setSearchOptions] = useState<
    { code: string; name: string }[]
  >([])

  const [translatedSearchOptions, setTranslatedSearchOptions] = useState<
    { code: string; name: string }[]
  >([])

  const navigate = useNavigate()

  const locale = getLocale(i18n.language)

  const dataUrl =
    import.meta.env.VITE_DATA_URL && import.meta.env.VITE_DATA_URL.trim()
      ? import.meta.env.VITE_DATA_URL
      : "http://localhost:8000/data/data.json"

  useEffect(() => {
    fetch(dataUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("My error")
        }
        return response.json()
      })
      .then((content) => {
        setData(content)
        const municipalities = content.municipalities
        municipalities.sort((a: Municipality, b: Municipality) =>
          a.code.localeCompare(b.code)
        )

        const initialMunicipality = municipalities[0]

        if (initialMunicipality) {
          setInitialOption({
            code: initialMunicipality.code,
            name: initialMunicipality.name,
          })
          setSelectedMunicipality({
            drivingForce: initialMunicipality.drivingForceCount,
            color: initialMunicipality.colorCount,
            registrationYear: initialMunicipality.registrationYearCount,
            maker: initialMunicipality.makerCount,
          })
        }

        const options = [
          initialMunicipality,
          ...municipalities
            .slice(1, -1)
            .sort((a: Municipality, b: Municipality) =>
              a.name.localeCompare(b.name, "fi")
            ),
          municipalities[municipalities.length - 1],
        ]

        setSearchOptions(options)
      })
      .catch((error) => {
        console.error(error)
        navigate("/error", {
          state: { message: "Failed to fetch data" },
        })
      })
  }, [navigate, dataUrl])

  useEffect(() => {
    if (initialOption) {
      setTranslatedInitialOption({
        code: initialOption.code,
        name: t(`Areas.${initialOption.name}`),
      })
    }
  }, [i18n.language, t, initialOption])

  useEffect(() => {
    setTranslatedSearchOptions(
      searchOptions.map((option) => ({
        code: option.code,
        name:
          option.name === "Finland" || option.name === "Unknown"
            ? t(`Areas.${option.name}`)
            : option.name,
      }))
    )
  }, [i18n.language, t, searchOptions])

  if (!data) {
    return <Loading size="4x" />
  }

  const date: Date = new Date(data.date)
  const municipalities: Municipality[] = data.municipalities

  const handleSelect = (
    selectedOption: { code: string; name: string } | null
  ) => {
    if (selectedOption) {
      const municipality = municipalities.find(
        (m) => m.code === selectedOption.code
      )
      if (municipality) {
        setSelectedMunicipality({
          drivingForce: municipality.drivingForceCount,
          color: municipality.colorCount,
          registrationYear: municipality.registrationYearCount,
          maker: municipality.makerCount,
        })
      }
    }
  }

  const totalCount = selectedMunicipality.drivingForce
    ? Object.values(selectedMunicipality.drivingForce).reduce(
        (sum, count) => (sum ?? 0) + (count ?? 0),
        0
      )
    : 0

  const dfLabels = Object.keys(drivingForceLabels).reduce(
    (acc, key) => {
      acc[key] = t(drivingForceLabels[key])
      return acc
    },
    {} as { [key: string]: string }
  )

  const colLabels = Object.keys(colorLabels).reduce(
    (acc, key) => {
      acc[key] = t(colorLabels[key])
      return acc
    },
    {} as { [key: string]: string }
  )

  return (
    <div>
      <h1 className="title">{t("Common.Title")}</h1>
      <div className="data-date">
        {t("Common.DataUpdatedOn")}{" "}
        {date.toLocaleDateString(locale, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>
      <div className="controls-container">
        <div className="language-container">
          <div>{t("Labels.Language")}:</div>
          <LanguageSwitch />
        </div>
        <div className="search-container">
          <div>{t("Labels.Area")}:</div>
          <SearchableDropdown
            options={translatedSearchOptions}
            onSelect={handleSelect}
            initialValue={translatedInitialOption}
          />
        </div>
      </div>
      {totalCount && (
        <div>
          {t("Common.TotalCount")}:{" "}
          <span className="total-count">{totalCount}</span>
        </div>
      )}
      {selectedMunicipality.drivingForce &&
        selectedMunicipality.color &&
        selectedMunicipality.registrationYear &&
        selectedMunicipality.maker && (
          <div className="chart-grid">
            <PieChart
              data={selectedMunicipality.drivingForce}
              colorMap={drivingForceColors}
              labelMap={dfLabels}
              title={t("Labels.DrivingForce")}
              style={{ gridArea: "a" }}
            />
            <BarChart
              data={selectedMunicipality.color}
              colorMap={colors}
              xAxisLabelMap={colLabels}
              title={t("Labels.Color")}
              yAxisText={t("Labels.Amount")}
              style={{ gridArea: "b" }}
            />
            <LineChart
              data={selectedMunicipality.registrationYear}
              title={t("Labels.RegistrationYear")}
              yAxisText={t("Labels.Amount")}
              firstXAxisLabelText="<1980"
              style={{ gridArea: "c" }}
            />
            <TopList
              data={selectedMunicipality.maker}
              topX={15}
              title={t("Labels.TopNMakers", { amount: 15 })}
              style={{ gridArea: "d" }}
            />
          </div>
        )}
    </div>
  )
}

export default HomePage
