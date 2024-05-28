"use client"
import Card from "@mui/joy/Card";
import ProgramsDropDown from "/components/dropDown/specific/ProgramsDropDown.js";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProgramSearch from "/components/search/ProgramSearch.js";
import DropDownTable from "/components/table/DropDownTable.js";

import {getAllEmployeeFeedback} from "lib/firebase/handleFeedback"
import {getProgramWithID} from "lib/firebase/library"

export default function Home() {

  const [tableData, setTableData] = useState([]);

  const tableStructure = {
    mainFields: [
      { name: 'programName', label: 'Program Name', alignRight: false },
      { name: 'course', label: 'Course', alignRight: false },
      { name: 'date', label: 'Date', alignRight: false },
     
    ],
    subFields: [
      { name: 'label', label: 'Label', alignRight: false },
      { name: 'Question', label: 'Question', alignRight: false },
      { name: 'Answer', label: 'Answer', alignRight: false },
    ],
  };
  function parseFeedbackForTable(feedbacks) {
    let tableData = [];
  
    feedbacks.forEach(feedback => {
      const programInfo = feedback.programInfo[0] || {};
      const mainData = {
        programName: programInfo.name || '',
        course: programInfo.courseName || '',
        date: feedback.date || ''
      };
  
      // Create a row for each question within the same feedback entry
      const subFieldRows = feedback.feedback.map(fbItem => ({
        label: fbItem.label || '',
        Question: fbItem.question || '',
        Answer: fbItem.response || ''
      }));
  
      // Add the main data and the subfield rows to the table data
      tableData.push({
        ...mainData,
        subField: subFieldRows // Array of subfield rows for this feedback entry
      });
    });
  
    return tableData;
  }
  
  const [feedbackData, setFeedbackData] = useState([]);

  useEffect(() => {
    const fetchFeedbackAndPrograms = async () => {
      try {
        const feedbacks = await getAllEmployeeFeedback();
        const updatedFeedbacks = [];

        for (const feedback of feedbacks) {
          

          // Assuming shiftID is in the format "date_programID"
          const [date, programID] = feedback.shiftID.split('_');

          // Fetch program details for each feedback
          const programInfo = await getProgramWithID(programID);

          // Construct a new feedback object with additional details
          const updatedFeedback = {
            ...feedback,
            date: date,
            programID: programID,
            programInfo: programInfo // Add program info to the feedback
          };

          updatedFeedbacks.push(updatedFeedback);
        }
        console.log("updatedFeedbacks",updatedFeedbacks)
        setFeedbackData(updatedFeedbacks); // Update state with enriched feedback data
        const parsedData = parseFeedbackForTable(updatedFeedbacks);
        setTableData(parsedData);
        console.log(parsedData)

      } catch (error) {
        console.error("Error fetching feedback and program data:", error);
      }
    };

    fetchFeedbackAndPrograms();
  }, []);

  // Render logic...
  return (
    <div>
      <Card>
        <ProgramSearch/>
        <DropDownTable structure={tableStructure} data={tableData} /> {/* Assuming DropDownTable accepts data prop */}
      </Card>
    </div>
  );
}