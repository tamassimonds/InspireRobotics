import React, {useState, useEffect} from 'react';
import { useRouter } from 'next/navigation';
import Button from '@mui/joy/Button';
import DropDownTable from "/components/table/DropDownTable";
import {getCourseCurricula} from "/library/lib/courses/curriculum/services/manageCurriculum.ts";
import {getTutorialWithID} from "/library/lib/courses/tutorials/service/fetchTutorial.ts";

const tableStructure = {
    mainFields: [
        { name: 'name', label: 'name', alignRight: false },
        { name: 'numSessions', label: 'Num Session', alignRight: false },
        { name: 'id', label: 'ID', hidden: true, alignRight: false },
    ],
    subFields: [
        { name: 'title', label: 'title', alignRight: false },
        { name: 'sessionNum', label: 'Session Num', alignRight: false },
    ],
};

export default function CourseDocsOverview({courseID, isAdmin = false}) {
    const router = useRouter();
    const [tableData, setTableData] = useState([]);

    const updateTableData = async () => {
        const curricula = await getCourseCurricula(courseID);
        const fetchTutorialsForCurricula = async (curriculum) => {
            const tutorials = await Promise.all(curriculum.tutorials.map(async tutorial => {
              const tutorialDetails = await getTutorialWithID(courseID, tutorial.id);
              // Assuming `tutorialDetails` does not include session number and it's only in your original `tutorial`
              return {
                  ...tutorialDetails, // Spread fetched tutorial details first
                  sessionNumber: tutorial.sessionNumber // Add session number from the original tutorial
              };
          }));
            return {
                name: curriculum.name,
                numSessions: curriculum.numSessions,
                id: curriculum.id,
                subField: tutorials.map(tutorial => ({
                    title: tutorial.title,
                    sessionNum: tutorial.sessionNumber
                }))
            };
        };

        const formattedCurricula = await Promise.all(curricula.map(fetchTutorialsForCurricula));
        setTableData(formattedCurricula);
    };

    useEffect(() => {
        updateTableData();
    }, [courseID]);

    const addCourseCurriculum = () => {
        router.push(`/admin/courses/overview/courseDetails/addCurriculum?courseID=${courseID}`);
    };

    const editPressed = (data) => {
        router.push(`/admin/courses/overview/courseDetails/addCurriculum?courseID=${courseID}&curriculumID=${data.id}`);
    };

    return (
        <div>
            {isAdmin && (
                <Button onClick={addCourseCurriculum}>Add Curriculum</Button>
            )}
            <DropDownTable data={tableData} structure={tableStructure} onEditPressed={editPressed} />
        </div>
    );
}