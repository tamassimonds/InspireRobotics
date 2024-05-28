"use client"
import Card from '@mui/joy/Card';
import { useEffect, useState } from 'react';
import { getCourseAndKitDetails } from '/lib/firebase/courseFirebaseLogic';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress for loading indicator

export default function CourseDetailsCard({ courseID }) {
    const [courseData, setCourseData] = useState({
        course: {
            name: '',
            id: '',
            notionPageLink: '', // Optional
            iconImageURL: '', // Optional
            largeImageURL: '', // Optional
        },
        kit: {
            name: '',
            id: '',
        }  
    });
    const [isLoading, setIsLoading] = useState(true); // State to track loading status

    useEffect(() => {
        async function getCourseData() {
            setIsLoading(true); // Start loading
            try {
                const data = await getCourseAndKitDetails(courseID);
                setCourseData(data);
            } catch (error) {
                console.error("Failed to fetch course data:", error);
                // Handle error or set some error state here
            }
            setIsLoading(false); // End loading
        }
        getCourseData();
    }, [courseID]);

    return (
        <div>
            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress /> {/* Show a loading indicator */}
                </Box>
            ) : (
                <Card variant="outlined" sx={{ display: 'flex', alignItems: 'left', padding: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {courseData.course?.iconImageURL && (
                            <img 
                                src={courseData.course.iconImageURL} 
                                alt={`${courseData.course?.name} Icon`} 
                                style={{ width: '50px', height: '50px', marginRight: '10px' }} 
                            />
                        )}
                        <Typography level="h2" sx={{ margin: 0 }}>
                            {courseData.course?.name || 'N/A'}
                        </Typography>
                    </Box>
                    <Box sx={{ marginLeft: '0px', textAlign: 'left' }}>
                        <p>Kit: {courseData.kit?.name || 'No kit associated'}</p>
                        <p>Notion Page Link: {courseData.course?.notionPageLink ? <a href={courseData.course.notionPageLink} target="_blank" rel="noopener noreferrer">Link to Notion</a> : 'N/A'}</p>
                    </Box>
                </Card>
            )}
        </div>
    );
}