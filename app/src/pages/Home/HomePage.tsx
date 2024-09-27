import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Loading from "../../components/Loading/Loading"
import PieChart from "../../components/PieChart/PieChart"
import BarChart from "../../components/BarChart/BarChart"
import LineChart from "../../components/LineChart/LineChart"
import TopList from "../../components/TopList/TopList"
import SearchableDropdown from "../../components/SearchableDropdown/SearchableDropdown"
import { Count, Municipality } from "../../types"
import { colors, drivingForcesColors } from "../../constants"
import "./HomePage.modules.css"

const HomePage = () => {
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

  const navigate = useNavigate()

  const [initialValue, setInitialValue] = useState<{
    code: string
    name: string
  } | null>(null)

  useEffect(() => {
    fetch(import.meta.env.VITE_DATA_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("My error")
        }
        return response.json()
      })
      .then((content) => {
        setData(content)
        const initialMunicipality = content.municipalities.find(
          (m: { name: string }) => m.name === "Finland"
        )
        if (initialMunicipality) {
          setInitialValue({
            code: initialMunicipality.code,
            name: initialMunicipality.name,
          })
          setSelectedMunicipality({
            drivingForce: initialMunicipality.countByDrivingForce,
            color: initialMunicipality.countByColor,
            registrationYear: initialMunicipality.countByRegistrationYear,
            maker: initialMunicipality.countByMaker,
          })
        }
      })
      .catch((error) => {
        console.error(error)
        navigate("/error", {
          state: { message: "Failed to fetch data" },
        })
      })
  }, [navigate])

  if (!data) {
    return <Loading size="4x" />
  }

  const date: Date = new Date(data.date)
  const municipalities: Municipality[] = data.municipalities
  const unknownMunicipality = municipalities.find((m) => m.name === "Unknown")

  const handleSelect = (
    selectedOption: { code: string; name: string } | null
  ) => {
    if (selectedOption) {
      const municipality = municipalities.find(
        (m) => m.code === selectedOption.code
      )
      if (municipality) {
        setSelectedMunicipality({
          drivingForce: municipality.countByDrivingForce,
          color: municipality.countByColor,
          registrationYear: municipality.countByRegistrationYear,
          maker: municipality.countByMaker,
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

  const searchOptions = [
    municipalities.find((m) => m.name === "Finland"),
    ...municipalities
      .filter(
        (x) =>
          x !== municipalities.find((m) => m.name === "Finland") &&
          x !== unknownMunicipality
      )
      .map((m) => ({
        code: m.code,
        name: m.name,
      })),
    unknownMunicipality,
  ].filter((x) => x !== undefined)

  return (
    <div>
      <h1 className="title">Registered passenger cars in Finland</h1>
      <div className="data-date">
        Data updated on{" "}
        {date.toLocaleDateString("en-FI", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>
      <div className="search-container">
        <div>Choose municipality:</div>
        <SearchableDropdown
          options={searchOptions}
          onSelect={handleSelect}
          initialValue={initialValue}
        />
      </div>
      {totalCount && (
        <div className="total-count-label">
          Total car count: <span className="total-count">{totalCount}</span>
        </div>
      )}
      {selectedMunicipality.drivingForce &&
        selectedMunicipality.color &&
        selectedMunicipality.registrationYear &&
        selectedMunicipality.maker && (
          <div className="chart-grid">
            <PieChart
              data={selectedMunicipality.drivingForce}
              colorMap={drivingForcesColors}
              title={"Driving forces"}
              style={{ gridArea: "a" }}
            />
            <BarChart
              data={selectedMunicipality.color}
              colorMap={colors}
              title={"Colors"}
              style={{ gridArea: "b" }}
            />
            <LineChart
              data={selectedMunicipality.registrationYear}
              title={"Registration years"}
              firstXAxisLabelText="<1980"
              style={{ gridArea: "c" }}
            />
            <TopList
              data={selectedMunicipality.maker}
              topX={15}
              title="Top 15 makers"
              style={{ gridArea: "d" }}
            />
          </div>
        )}
    </div>
  )
}

export default HomePage
