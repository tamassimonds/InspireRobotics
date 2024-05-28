
"use client"
import {useState, useEffect} from 'react'
import { getSchoolRevenueByTermAndYear, getHolidayProgramRevenueByTermAndYear} from 'lib/firebase/adminDashboard';
import DashboardCard from "/components/card/DashboardCard.js"
import SchoolIcon from '@mui/icons-material/School';
import Card from '@mui/joy/Card';
import SchoolRevenueBarGraph from "/components/graph/specific/schoolRevenueBar.js"
export default function Home() {

  const [schoolProgramRevenue, setSchoolProgramRevenue] = useState()

  const fetchAdminData = async () => {
    
   
  }

  useEffect(()=>{
    fetchAdminData()
 },[])
  return (
    <div>
      <h1>This is the DashBoard</h1>
      <DashboardCard color="success" label={"Number of students you've taught"} value={10} Icon={<SchoolIcon />}></DashboardCard>
      <Card>
        <SchoolRevenueBarGraph />
      </Card>
    </div>
   
  )
}
