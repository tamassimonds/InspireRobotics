"use client"

import {useState, useEffect} from 'react'
import Table from "/components/table/Table.js"

import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

import { getEmployeeDashboardAnalytics } from "/lib/firebase/employeeDashboard";
import {getAdminDashboardAnalytics} from "/lib/firebase/adminDashboard";
import DashboardCard from "/components/card/DashboardCard.js"
import SchoolIcon from '@mui/icons-material/School';



export default function Home() {
    const [programs, setPrograms] = useState([]);
    const userData = useSelector(state => state.user.userData);
    const [employeeID, setEmployeeID] = useState()
    const [dashboardAnalytics, setDashboardAnalytics] = useState()
    const [adminDashboardAnalytics, setAdminDashboardAnalytics] = useState()

    const router = useRouter()
    
    const fetchDashboardAnalytics = async () => {
      const fetchedDashboardAnalytics = await getEmployeeDashboardAnalytics(userData.id);
      const adminFetchedDashboardAnalytics = await getAdminDashboardAnalytics();
      console.log(adminFetchedDashboardAnalytics)
      setDashboardAnalytics(fetchedDashboardAnalytics);
      setAdminDashboardAnalytics(adminFetchedDashboardAnalytics)
      console.log("fetchedDashboardAnalytics",fetchedDashboardAnalytics)

    };

    useEffect(() => {
      if(!userData) return
      fetchDashboardAnalytics()
    }, [userData]);

    return (
      <div>   
        {dashboardAnalytics &&(
          <div>
            <DashboardCard color="success" label={"Number of students you've taught"} value={dashboardAnalytics.numberOfStudents} Icon={<SchoolIcon />}></DashboardCard>
            <br />
            <DashboardCard color="primary" label={"Total Students Inspire Robotics has Taught"} value={adminDashboardAnalytics.totalNumberOfStudents} Icon={<SchoolIcon />}></DashboardCard>
          </div>
          // <DashboardCard color="success" label={"Number of students taught"} value={dashboardAnalytics.numberOfStudents} Icon={<SchoolIcon />}></DashboardCard>

        )}
      
      </div>
    )
  }
  