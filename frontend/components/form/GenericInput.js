// Import all the input components based on the provided image
import AgeInput from "/components/inputs/AgeInput.js";
import CheckBox from "/components/inputs/CheckBox.js";
import DateInput from "/components/inputs/DateInput.js";
import MoneyInput from "/components/inputs/MoneyInput.js";
import NumberInput from "/components/inputs/NumberInput.js";
import RadioButton from "/components/inputs/RadioButton.js";
import StartEndTimeInput from "/components/inputs/StartEndTimeInput.js";
import TextInput from "/components/inputs/TextInput.js";
import TimeInput from "/components/inputs/TimeInput.js";
import UneditableTagInput from "/components/inputs/UneditableTagInput.js";
import ImageInput from "/components/inputs/imageInput.js";
import Boolean from "/components/inputs/Boolean.js";
import MultipleCourseInput from "/components/inputs/specific/MultipleCourseInput.js";
import ProgramsDropDown from "/components/dropDown/specific/ProgramsDropDown.js";

import CourseDropDown from "/components/dropDown/specific/CourseDropDown.js";
import HolidayProgramModuleDropDown from "/components/dropDown/specific/HolidayProgramModuleDropDown.js";
import ItemsDropDown from "/components/dropDown/specific/ItemsDropDown.js";
import KitDropDown from "/components/dropDown/specific/KitDropDown.js";
import SchoolDropDown from "/components/dropDown/specific/SchoolDropDown.js";
import TeacherDropDown from "/components/dropDown/specific/TeacherDropDown.js";
import UnitOwnerDropDown from "/components/dropDown/specific/UnitOwnerDropDown.js";
import TicketReasonDropdown from "/components/dropDown/specific/TicketReasonDropdown.js";
import CanHandleEquipmentDropDown from "/components/dropDown/specific/CanHandleEquipmentDropDown.js";

import HolidayProgramModuleInCourseDropDown from "/components/dropDown/specific/HolidayProgramModuleInCourseDropDown.js";

import AddTutorials from "/components/inputs/specific/AddTutorials.js";

export default function GenericInput({ type, value, valueUpdated, ...props }) {
  switch (type) {
    case "text" || "str":
      return <TextInput value={value} valueUpdated={valueUpdated} {...props} />;
    case "email":
      return <TextInput value={value} valueUpdated={valueUpdated} {...props} />;
    case "phone":
      return <TextInput value={value} valueUpdated={valueUpdated} {...props} />;
    case "boolean":
      return <Boolean value={value} valueUpdated={valueUpdated} {...props} />;
    case "checkbox":
      return <CheckBox checked={value} valueUpdated={valueUpdated} {...props} />;
    case "date":
      return <DateInput value={value} valueUpdated={valueUpdated} {...props} />;
    case "money":
      return <MoneyInput value={value} valueUpdated={valueUpdated} {...props} />;
    case "number":
      return <NumberInput value={value} valueUpdated={valueUpdated} {...props} />;
    case "radio":
      return <RadioButton selected={value} valueUpdated={valueUpdated} {...props} />;
    case "startendtime":
      return <StartEndTimeInput value={value} valueUpdated={valueUpdated} {...props} />;
    case "time":
      return <TimeInput value={value} valueUpdated={valueUpdated} {...props} />;
    case "age":
      return <AgeInput value={value} valueUpdated={valueUpdated} {...props} />;
    case "uneditabletag":
      return <UneditableTagInput value={value} {...props} />;
    case "image":
      return <ImageInput value={value} valueUpdated={valueUpdated} {...props} />;
    case "course":
      return <CourseDropDown value={value} valueUpdated={valueUpdated} {...props} />;
    case "holidayProgram":
      return <HolidayProgramModuleDropDown value={value} valueUpdated={valueUpdated} {...props} />;
    case "holidayProgramInCourse":
      return <HolidayProgramModuleInCourseDropDown value={value} valueUpdated={valueUpdated} {...props} />;
    case "items":
      return <ItemsDropDown value={value} valueUpdated={valueUpdated} {...props} />;
    case "kit":
      return <KitDropDown value={value} valueUpdated={valueUpdated} {...props} />;
    case "school":
      return <SchoolDropDown value={value} valueUpdated={valueUpdated} {...props} />;
    case "programs":
      return <ProgramsDropDown value={value} valueUpdated={valueUpdated} {...props} />;
    case "teacher":
      return <TeacherDropDown value={value} valueUpdated={valueUpdated} {...props} />;
    case "handleEquipment":
      return <CanHandleEquipmentDropDown value={value} valueUpdated={valueUpdated} {...props} />;
    case "unitOwner":
      return <UnitOwnerDropDown value={value} valueUpdated={valueUpdated} {...props} />;
    case "ticketReason":
      return <TicketReasonDropdown value={value} valueUpdated={valueUpdated} {...props} />;
    case "multipleCourse":
      return <MultipleCourseInput value={value} valueUpdated={valueUpdated} {...props} />;
    case "addTutorials":
      return <AddTutorials value={value} valueUpdated={valueUpdated} {...props} />;
    // ... add other input types as needed
    default:
      return null;
  }
};