import * as React from 'react';
import SearchableDropDown from '../SearchableDropDown';

export default function SearchableCourseDropDown({ valueUpdated, defaultOption = null, placeHolder= "" }) {
  const [value, setValue] = React.useState({ label: defaultOption });

  // Define your options and labels
  
  const labels = ["Commute", "Pack Up","Other"];

  // Create a mapping from labels to options
  const labelToOptionMap = {
    "Commute": "commute",
    "Class Preparation": "classPrep",
    "Pack Up": "packUp",
    "Other": "other",

  };

  const valueSelected = (label) => {
    // Find the corresponding option for the label
    const option = labelToOptionMap[label];
    valueUpdated(option);
  };

  return (
    <SearchableDropDown options={labels} valueUpdated={valueSelected} placeHolder={placeHolder} />
  );
}