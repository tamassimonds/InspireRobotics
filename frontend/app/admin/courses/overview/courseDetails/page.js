'use client'
 
import { useSearchParams } from 'next/navigation'
 
import Card from '@mui/joy/Card';
import CourseDetailsCard from '/components/card/specific/CourseDetails.js'
import Button from '@mui/joy/Button';
import {useRouter} from 'next/navigation'
import CourseCurriculaOverview from "./components/CourseCurriculaOverview"
import CourseTutorialsOverview from "./components/CourseTutorialsOverview"



export default function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()
 
  const courseID = searchParams.get('courseID')
  
  // URL -> `/dashboard?search=my-project`
  // `search` -> 'my-project'
  const editPressed = () => {
    router.push(`/admin/courses/overview/addCourse?courseID=${courseID}`)
  }
  return (
    <div>
     

      <CourseDetailsCard courseID={courseID}/>
      <Button onClick={editPressed}>Edit</Button>     

      <h1>Course Tutorials</h1>
      <CourseTutorialsOverview courseID={courseID} isAdmin={true}></CourseTutorialsOverview>

      <h1>Course Docs Curriculum</h1>
      <CourseCurriculaOverview courseID={courseID} isAdmin={true}></CourseCurriculaOverview>
      

    </div>
  
    )
}