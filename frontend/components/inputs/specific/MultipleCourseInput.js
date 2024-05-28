"use client"
import React, { useState } from 'react';
import CourseDropDown from "/components/dropDown/specific/CourseDropDown.js";
import UneditableTagInput from "/components/inputs/UneditableTagInput.js";

export default function MultipleCourseInput({ value, valueUpdated }) {
  const [coursesSelected, setCoursesSelected] = useState(value || []); 
  const initializeCourseNames = (courses) => {
    return Array.isArray(courses) ? courses.map(course => course?.name || '').filter(name => name) : [];
  };
  const [courseNameSelected, setCourseNameSelected] = useState(initializeCourseNames(coursesSelected)); 

  const handleCourseRemoved = (remainingCourseNames) => {
    let updatedCoursesSelected = [];

    if (remainingCourseNames.length > 0) {
      updatedCoursesSelected = coursesSelected.filter(course => 
        remainingCourseNames.includes(course.name)
      );
    }

    setCoursesSelected(updatedCoursesSelected);
    setCourseNameSelected(remainingCourseNames);

    const courseIDs = updatedCoursesSelected.map(course => course.id);
    console.log(courseIDs);
    valueUpdated(courseIDs);
  };

  const handleCourseAdded = (course) => {

    if(!course)
      return;
    const updatedCoursesSelected = [...coursesSelected, course];
    setCoursesSelected(updatedCoursesSelected);
    setCourseNameSelected(updatedCoursesSelected.map(course => course.name));
    console.log(updatedCoursesSelected);
  
    const courseIDs = updatedCoursesSelected.map(course => course.id);
    console.log(courseIDs);
    valueUpdated(courseIDs);
    
  };

  return (
    <>
      <label htmlFor="">Course</label>
      <CourseDropDown valueUpdated={handleCourseAdded} />
      <UneditableTagInput value={courseNameSelected} valueUpdated={handleCourseRemoved} />
    </>
  );
}