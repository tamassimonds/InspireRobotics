"use client"

import React from 'react';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import StarIcon from '@mui/icons-material/Star';
import Head from 'next/head';
import SideBar from '/components/layout/outerSidebar'; // adjust the import path as needed
import GroupsIcon from '@mui/icons-material/Groups';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorageIcon from '@mui/icons-material/Storage';
import AccessAlarmsIcon from '@mui/icons-material/AccessAlarms';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import InventoryIcon from '@mui/icons-material/Inventory';
import SchoolIcon from '@mui/icons-material/School';
import BusinessIcon from '@mui/icons-material/Business';
import CreateIcon from '@mui/icons-material/Create';
import RocketIcon from '@mui/icons-material/Rocket';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import PersonIcon from '@mui/icons-material/Person';
import ToolBar from "/components/layout/employeeToolBar.js"
import {validateEmployeeAuth} from "/lib/firebase/auth.js"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';

import { fetchUserDetails } from '/lib/redux/features/user/userSlice';



export default function SidebarLayout({ children }) {

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    // Authenticates whenever new route is visited
    validateEmployeeAuth().then((user) => {
      if (user == null) {
        console.log("User not signed in");
        router.push('/login');

      } else{
        dispatch(fetchUserDetails(user.uid))
        .unwrap() // Unwrap the result from the dispatched thunk
        .then((employeeData) => {
          console.log("Employee Data:", employeeData);
        })
      .catch((error) => {
          console.error("Error fetching employee data:", error);
        });

      }
    }, [dispatch]);
    })
    

  const menuOptions = [
    { label: 'dashboard', icon: DashboardIcon, route: '/employee/dashboard' },
    { label: 'programs', icon: StorageIcon, route: '/employee/programs/overview' },
    { label: 'shifts', icon: AccessAlarmsIcon, route: '/employee/shifts/upcoming' },
    { label: 'holidayPrograms', icon: AcUnitIcon, route: '/employee/holidayPrograms/availability' },
    { label: 'team', icon: GroupsIcon, route: '/employee/team/members' },
    { label: 'courses', icon: RocketIcon, route: '/employee/courses/overview' },
    { label: 'feedback', icon: ChatBubbleOutlineIcon, route: '/employee/feedback/shiftReview', badgeNumber: 4 },
    { label: 'profile', icon: PersonIcon, route: '/employee/profile/main' },

  ];

  return (
    <>
      <Head>
      
    
        <link rel="stylesheet" href="path-to-inter-font.css" /> {/* If you have a CSS file for the Inter font */}
      </Head>
      <div lang="en">
      <ToolBar></ToolBar>
        <SideBar menuOptions={menuOptions}>
            <main>{children}</main>
        </SideBar>
       
      </div>
    </>
  );
}