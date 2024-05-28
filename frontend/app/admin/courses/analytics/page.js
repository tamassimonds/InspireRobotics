"use client"

import CourseDropDown from "/components/dropDown/specific/CourseDropDown.js";

export default function Home() {
    
    const courseSelected = (course) => {
      console.log(course)
    }

    return (
      <div>
        <h1>Analytics</h1>
        <CourseDropDown valueUpdated={courseSelected}></CourseDropDown>
        <h1>Data</h1>
      </div>
     
    )
  }
  