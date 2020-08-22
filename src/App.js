import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Card, CardContent } from "@material-ui/core";

import { InfoBox, Table, Navigation, Dropdown, MapGl } from "./components";
import { sortData, prettyPrintStat, getGeoJson } from "./util";
import { covidApi, statesCoordinates } from "./constants";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("US");
  const [tableTitle, setTableTitle] = useState("Top Cases By State");
  const [infoBoxTodayCases, setInfoBoxTodayCases] = useState();
  const [infoBoxTotalCases, setInfoBoxTotalCases] = useState();
  const [infoBoxTodayRecovered, setInfoBoxTodayRecovered] = useState();
  const [infoBoxTotalRecovered, setInfoBoxTotalRecovered] = useState();
  const [infoBoxTodayDeaths, setInfoBoxTodayDeaths] = useState();
  const [infoBoxTotalDeaths, setInfoBoxTotalDeaths] = useState();
  const [state, setState] = useState("all");
  const [states, setStates] = useState([]);
  const [tableInfo, setTableInfo] = useState({
    type: "state",
    data: [],
  });
  const [mapData, setMapData] = useState({
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [-98.5795, 39.8283],
        },
        properties: {
          cases: 0,
        },
      },
    ],
  });
  const [caseType, setCaseType] = useState("cases");
  const [viewport, setViewport] = useState({
    latitude: 39.8283, // Middle of US coordinates
    longitude: -98.5795,
    zoom: 4,
  });

  // Get US data for default card stats
  useEffect(() => {
    const getUSData = async () => {
      const USResponse = await fetch(`${covidApi}/countries/US`);
      const USData = await USResponse.json();

      setInfoBoxTodayCases(USData.todayCases);
      setInfoBoxTotalCases(USData.cases);
      setInfoBoxTodayRecovered(USData.todayRecovered);
      setInfoBoxTotalRecovered(USData.recovered);
      setInfoBoxTodayDeaths(USData.todayDeaths);
      setInfoBoxTotalDeaths(USData.deaths);
    };
    getUSData();
  }, []);

  // Get all countries data for default map and country dropdown
  useEffect(() => {
    const getCountriesData = async () => {
      try {
        const countriesResponse = await fetch(`${covidApi}/countries`);
        const countriesData = await countriesResponse.json();
        const countries = countriesData.map((country) => ({
          name: country.country,
          value: country.countryInfo.iso2,
        }));

        const mapData = countriesData.map((country) => ({
          latitude: country.countryInfo.lat,
          longitude: country.countryInfo.long,
          cases: country.cases,
          deaths: country.deaths,
          recovered: country.recovered,
        }));

        const mapGeoData = getGeoJson(mapData);
        setMapData(mapGeoData);
        setCountries(countries);
      } catch (error) {
        console.log(error);
      }
    };
    getCountriesData();
  }, []);

  // Get US data for default state dropdown and Table data
  useEffect(() => {
    const getStatesData = async () => {
      try {
        const statesResponse = await fetch(`${covidApi}/states`);
        const statesData = await statesResponse.json();
        const states = statesData
          .map((state) => state.state)
          .sort()
          .map((state) => ({
            name: state,
            value: state,
          }));

        const sortedStates = sortData(statesData);

        setTableInfo({
          type: "state",
          data: sortedStates,
        });
        setStates(states);
      } catch (error) {
        console.log(error);
      }
    };
    getStatesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const url =
      countryCode === "worldwide"
        ? `${covidApi}/all`
        : `${covidApi}/countries/${countryCode}`;

    try {
      const countryResponse = await fetch(url);
      const countryData = await countryResponse.json();

      setCountry(countryCode);
      setInfoBoxTodayCases(countryData.todayCases);
      setInfoBoxTotalCases(countryData.cases);
      setInfoBoxTodayRecovered(countryData.todayRecovered);
      setInfoBoxTotalRecovered(countryData.recovered);
      setInfoBoxTodayDeaths(countryData.todayDeaths);
      setInfoBoxTotalDeaths(countryData.deaths);

      const countriesResponse = await fetch(`${covidApi}/countries`);
      const countriesData = await countriesResponse.json();
      const mapData = countriesData.map((country) => ({
        latitude: country.countryInfo.lat,
        longitude: country.countryInfo.long,
        cases: country.cases,
        deaths: country.deaths,
        recovered: country.recovered,
      }));

      const mapGeoData = getGeoJson(mapData);
      setMapData(mapGeoData);

      if (countryCode === "worldwide") {
        setViewport({
          ...viewport,
          latitude: 40.4168,
          longitude: -3.7038,
          zoom: 2,
        });
      } else {
        setViewport({
          ...viewport,
          latitude: countryData.countryInfo.lat,
          longitude: countryData.countryInfo.long,
          zoom: 4,
        });
      }

      if (countryCode === "US") {
        setState("all");

        const statesResponse = await fetch(`${covidApi}/states`);
        const statesData = await statesResponse.json();
        const sortedStates = sortData(statesData);
        setTableTitle("Top Cases By State");
        setTableInfo({
          type: "state",
          data: sortedStates,
        });
      } else {
        const worldTableResponse = await fetch(`${covidApi}/countries`);
        const worldtableData = await worldTableResponse.json();
        const sortedCountries = sortData(worldtableData);

        setTableInfo({
          type: "country",
          data: sortedCountries,
        });
        setTableTitle("Top Cases By Country");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onStateChange = async (event) => {
    const state = event.target.value;

    try {
      setState(state);

      if (state === "all") {
        const USResponse = await fetch(`${covidApi}/countries/US`);
        const USData = await USResponse.json();

        setInfoBoxTodayCases(USData.todayCases);
        setInfoBoxTotalCases(USData.cases);
        setInfoBoxTodayRecovered(USData.todayRecovered);
        setInfoBoxTotalRecovered(USData.recovered);
        setInfoBoxTodayDeaths(USData.todayDeaths);
        setInfoBoxTotalDeaths(USData.deaths);

        const statesResponse = await fetch(`${covidApi}/states`);
        const statesData = await statesResponse.json();
        const sortedStates = sortData(statesData);

        setTableTitle("Top Cases By State");

        setTableInfo({
          type: "state",
          data: sortedStates,
        });

        setViewport({
          ...viewport,
          latitude: 39.8283,
          longitude: -98.5795,
          zoom: 4,
        });
      } else {
        const stateResponse = await fetch(`${covidApi}/states/${state}`);
        const stateData = await stateResponse.json();

        setInfoBoxTodayCases(stateData.todayCases);
        setInfoBoxTotalCases(stateData.cases);
        setInfoBoxTodayRecovered(stateData.todayRecovered);
        setInfoBoxTotalRecovered(stateData.recovered);
        setInfoBoxTodayDeaths(stateData.todayDeaths);
        setInfoBoxTotalDeaths(stateData.deaths);

        const countiesResponse = await fetch(`${covidApi}/jhucsse/counties`);
        const allCountiesData = await countiesResponse.json();
        const countiesData = allCountiesData.filter(
          (county) => county.province === state
        );
        const mapData = countiesData.map((county) => ({
          latitude: county.coordinates.latitude,
          longitude: county.coordinates.longitude,
          cases: county.stats.confirmed * 20,
          deaths: county.stats.deaths * 20,
          recovered: county.stats.recovered * 20,
        }));

        const sortedCounties = sortData(countiesData, true);
        const mapGeoData = getGeoJson(mapData);
        setMapData(mapGeoData);
        setViewport({
          ...viewport,
          latitude: statesCoordinates[state].latitude,
          longitude: statesCoordinates[state].longitude,
          zoom: 5,
        });
        setTableTitle("Top Cases By County");

        setTableInfo({
          type: "county",
          data: sortedCounties,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Router>
      <div className="app">
        <Navigation />
        <div className="main-container">
          <div className="left-container">
            <div className="dropdown-container">
              <Dropdown
                menuItems={countries}
                item={country}
                onChange={onCountryChange}
                topItem={{ value: "worldwide", name: "World" }}
              />
              {country === "US" && (
                <Dropdown
                  menuItems={states}
                  item={state}
                  onChange={onStateChange}
                  topItem={{ value: "all", name: "All States" }}
                />
              )}
            </div>

            <div className="stats-container">
              <InfoBox
                isRed
                active={caseType === "cases"}
                onClick={(e) => setCaseType("cases")}
                title="Today Cases"
                todayCases={prettyPrintStat(infoBoxTodayCases)}
                total={prettyPrintStat(infoBoxTotalCases)}
              />
              <>
                <InfoBox
                  active={caseType === "recovered"}
                  onClick={(e) => setCaseType("recovered")}
                  title="Today Recovered"
                  todayCases={prettyPrintStat(infoBoxTodayRecovered)}
                  total={prettyPrintStat(infoBoxTotalRecovered)}
                />
                <InfoBox
                  isRed
                  active={caseType === "deaths"}
                  onClick={(e) => setCaseType("deaths")}
                  title="Today Deaths"
                  todayCases={prettyPrintStat(infoBoxTodayDeaths)}
                  total={prettyPrintStat(infoBoxTotalDeaths)}
                />
              </>
            </div>

            <MapGl
              viewport={viewport}
              setViewport={setViewport}
              mapData={mapData}
              caseType={caseType}
            />
          </div>

          <div className="right-container">
            <Card>
              <CardContent>
                <h3>{tableTitle}</h3>
                <Table tableData={tableInfo} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
