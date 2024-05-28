'use client'
 
import { useSearchParams } from 'next/navigation'
 
import {useEffect,useState} from 'react'
import Card from '@mui/joy/Card';


import CourseDetails from '/components/card/specific/CourseDetails.js'

export default function Page() {
  const searchParams = useSearchParams()
 
  const courseID = searchParams.get('courseID')
  

  const [course, setCourse] = useState()


  // URL -> `/dashboard?search=my-project`
  // `search` -> 'my-project'
  return (
    <div>
      <h1>Course Details</h1>

      <CourseDetails courseID={courseID}></CourseDetails>
      


    </div>
  
    )
}