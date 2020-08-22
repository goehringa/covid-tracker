import React from "react";
import { FormControl, MenuItem, Select } from "@material-ui/core";

function Dropdown({ menuItems, item, onChange, ...props }) {
  return (
    <FormControl className="dropdown">
      <Select variant="outlined" onChange={onChange} value={item}>
        {props.topItem && (
          <MenuItem value={props.topItem.value}>{props.topItem.name}</MenuItem>
        )}
        {menuItems.map((country, index) => (
          <MenuItem value={country.value} key={index}>
            {country.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default Dropdown;
