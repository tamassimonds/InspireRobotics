"use client"
import React, {useEffect, useState} from 'react';
import Card from '@mui/joy/Card';
import GenericForm from '/components/form/GenericForm.js';
import { useSearchParams, useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { Tutorial, db_to_tutorial } from "library/lib/courses/tutorials/tutorial";
import { getCurriculumWithID } from "library/lib/courses/curriculum/services/fetchTutorialCurriculum.ts";
import { getTutorialWithID } from "library/lib/courses/tutorials/service/fetchTutorial.ts";
import { TutorialCurriculum, Curriculum } from "library/lib/courses/tutorials/curriculum";
import { addCourseCurriculum, updateCourseCurriculum} from "library/lib/courses/curriculum/services/manageCurriculum.ts";

type FormData = {
  name: string;
  isHolidayProgram: boolean;
  holidayModule: any; // Define a more specific type if possible
  numSessions: number;
  tutorials: Array<{ id: string; sessionNumber: number, tutorialID: string }>;
  additionalInfo?: string;
};

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('curriculumID');
  const courseID = searchParams.get('courseID');

  const [curriculum, setCurriculum] = React.useState<any>(null);

  const formFields = [
    { name: 'name', label: 'Name*', type: 'text', required: true, props: { placeholder: 'Enter course name' } },
    { name: 'isHolidayProgram', label: 'Holiday Program*', type: 'boolean', required: false, props: { placeholder: 'Is this a holiday program?' } },
    { name: 'holidayModule', label: 'If Holiday Program, which Holiday Program Module*', type: 'holidayProgramInCourse', required: false, props: { courseID: courseID } },
    { name: 'numSessions', label: 'Num Sessions*', type: 'number', required: true, props: { placeholder: 'Number of sessions' } },
    { name: 'tutorials', label: 'Tutorial Select*', type: 'addTutorials', required: true, props: { courseID: courseID } },
    { name: 'additionalInfo', label: 'Additional Info', type: 'text', required: false, props: { placeholder: 'Any additional info' } },
  ];

  const handleFormSubmit = async (formData: FormData) => {
    console.log(formData);
    try {
        const tutorialPromises = formData.tutorials.map(async tutorial => {
          console.log(tutorial.tutorialID)
            if(tutorial.tutorialID == undefined) return;
            const tutorialData = await getTutorialWithID(courseID, tutorial.tutorialID);
            return { ...tutorialData, sessionNumber: tutorial.sessionNumber };
        });
        
        const resolvedTutorials = await Promise.all(tutorialPromises);
        const curriculum: Curriculum = {
            name: formData.name,
            isHolidayProgram: formData.isHolidayProgram || false,
            holidayModule: formData.holidayModule || false,
            numSessions: formData.numSessions,
            tutorials: resolvedTutorials,
            additionalInfo: formData.additionalInfo || ''
        };

        if (id) {
            // Update existing curriculum
            await updateCourseCurriculum(courseID, id, curriculum);
        } else {
            // Add new curriculum
            const newID = uuidv4();  // Assign a unique ID if creating new
            await addCourseCurriculum(courseID, { ...curriculum, id: newID });
        }

        console.log('Curriculum saved:', curriculum);
        router.push(`/admin/courses/overview/courseDetails?courseID=${courseID}`);
    } catch (error) {
        console.error('Error handling form submission:', error);
    }
  };  
  useEffect(() => {
    if(!id) return;
    getCurriculumWithID(courseID, id).then((curriculum) => {
      setCurriculum(curriculum);
    });

  }, [id]);


  return (
    <div>
      <h1>Curriculum Add</h1>
      <Card>
        <GenericForm
          fields={formFields}
          handleFormSubmit={handleFormSubmit}
          passedFormData={curriculum}
          collectionName="courses/tutorials"
          submitBackURL={`/admin/courses/overview/courseDetails?courseID=${courseID}`}
          referenceID={id}
        />
      </Card>
    </div>
  );
}
