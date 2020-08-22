import React from "react";
import ReactMapGL, { Layer, Source } from "react-map-gl";

import { caseTypeColors } from "../util";

function MapGl({ viewport, setViewport, mapData, caseType }) {
  return (
    <div className="map-gl">
      <ReactMapGL
        {...viewport}
        height={"100%"}
        width={"100%"}
        mapStyle={"mapbox://styles/zingstah/ckdwj99at012219mlu8m8ouyl"}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
      >
        <Source id="my-data" type="geojson" data={mapData}>
          <Layer
            id="point"
            type="circle"
            paint={{
              "circle-radius": [
                "/",
                ["get", caseType],
                caseTypeColors[caseType].multiplier,
              ],
              "circle-color": caseTypeColors[caseType].color,
              "circle-opacity": 0.3,
            }}
          />
        </Source>
      </ReactMapGL>
    </div>
  );
}

export default MapGl;
