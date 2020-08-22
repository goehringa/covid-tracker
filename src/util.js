import React from "react";
import numeral from "numeral";

export const caseTypeColors = {
  cases: {
    color: "#D70015",
    multiplier: 50000,
  },
  recovered: {
    color: "#248A3D",
    multiplier: 50000,
  },
  deaths: {
    color: "#2C2C2E",
    multiplier: 1250,
  },
};

export const sortData = (data, county = false) => {
  const sortedData = [...data];

  if (county) {
    return sortedData.sort((a, b) =>
      a.stats.confirmed > b.stats.confirmed ? -1 : 1
    );
  } else {
    return sortedData.sort((a, b) => (a.cases > b.cases ? -1 : 1));
  }
};

export const prettyPrintStat = (stat) =>
  stat ? `+${numeral(stat).format("0.0a")}` : "+0";

// DRAW circles on the map with interactive tooltip
// export const showDataOnMap = (data, caseType = "cases") =>
//   data.map((country) => (
//     <Circle
//       center={[country.countryInfo.lat, country.countryInfo.long]}
//       fillOpacity={0.4}
//       color={caseTypeColors[caseType].hex}
//       fillColor={caseTypeColors[caseType].hex}
//       radius={
//         Math.sqrt(country[caseType]) * caseTypeColors[caseType].multiplier
//         // Math.sqrt(country[caseType])
//       }
//     >
//       <Popup>
//         <div className="map-info-container">
//           <div
//             className="info-flag"
//             style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
//           ></div>
//           <div className="info-name">{country.country}</div>
//           <div className="info-confirmed">
//             Cases: {numeral(country.cases).format("0,0")}
//           </div>
//           <div className="info-recovered">
//             Recovered: {numeral(country.recovered).format("0,0")}
//           </div>
//           <div className="info-deaths">
//             Deaths: {numeral(country.deaths).format("0,0")}
//           </div>
//         </div>
//       </Popup>
//     </Circle>
//   ));

export const getGeoJson = (geoData) => {
  const dataPoints = geoData.map((data) => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [data.longitude, data.latitude],
    },
    properties: {
      cases: data.cases,
      recovered: data.recovered,
      deaths: data.deaths,
    },
  }));

  const geoJson = {
    type: "FeatureCollection",
    features: dataPoints,
  };

  return geoJson;
};
