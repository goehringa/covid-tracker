import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";

function InfoBox({ title, todayCases, active, total, isRed, ...props }) {
  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${active && "selected"} ${isRed && "red"}`}
    >
      <CardContent>
        <Typography className="title" color="textSecondary">
          {title}
        </Typography>
        <h2 className={`cases ${!isRed && "cases--green"}`}>{todayCases}</h2>
        <Typography className="total" color="textSecondary">
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
