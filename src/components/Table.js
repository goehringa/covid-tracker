import React from "react";
import numeral from "numeral";

function Table({ tableData: { type, data } }) {
  return (
    <div className="table">
      <table>
        <tbody>
          {type === "country" &&
            data.map(({ country, cases }) => (
              <React.Fragment key={country}>
                <tr>
                  <td>{country}</td>
                  <td>
                    <strong>{numeral(cases).format()}</strong>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          {type === "state" &&
            data.map(({ state, cases }) => (
              <React.Fragment key={state}>
                <tr>
                  <td>{state}</td>
                  <td>
                    <strong>{numeral(cases).format()}</strong>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          {type === "county" &&
            data.map(({ county, stats: { confirmed } }) => (
              <React.Fragment key={county}>
                <tr>
                  <td>{county}</td>
                  <td>
                    <strong>{numeral(confirmed).format()}</strong>
                  </td>
                </tr>
              </React.Fragment>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
