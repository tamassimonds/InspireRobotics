"use client";
import Card from "@mui/joy/Card";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import SchoolDetails from "/components/card/specific/SchoolDetails.js";
import { useSearchParams } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  
  const searchParams = useSearchParams();

  const schoolID = searchParams.get('schoolID');

  const editSchoolPressed = () => {
    router.push('/admin/schools/overview/addSchool?id='+schoolID);
  }
  return (
    <div>
      {/* Pass schoolID to the SchoolDetails component */}
      {schoolID && <SchoolDetails schoolID={schoolID} editSchoolPressed={editSchoolPressed}/>}
    </div>
  );
}