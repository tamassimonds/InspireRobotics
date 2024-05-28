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
import AdminToolBar from "/components/layout/adminToolBar.js"
import SettingsIcon from '@mui/icons-material/Settings';

import { useRouter } from 'next/navigation';

import { useDispatch, useSelector } from 'react-redux';

import { useEffect } from 'react';
import {validateAdminAuth } from "/lib/firebase/auth.js"
import { fetchUserDetails } from '/lib/redux/features/user/userSlice';
import AssignmentIcon from '@mui/icons-material/Assignment';


export default function RootLayout({ children }) {

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    // Authenticates whenever new route is visited
    validateAdminAuth().then((user) => {
      console.log(user)
      if (user == null) {
        console.log("User not signed in");
        router.push('/adminLogin');

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
    { label: 'Dashboard', icon: DashboardIcon, route: '/admin/dashboard/main' },
    { label: 'team', icon: GroupsIcon, route: '/admin/team/members' },
    { label: 'Programs', icon: StorageIcon, route: '/admin/programs/overview' },
    { label: 'Private', icon: AssignmentIcon, route: '/admin/privatePrograms/coupons' },
    { label: 'Shifts', icon: AccessAlarmsIcon, route: '/admin/shifts/allocate' },
    { label: 'Feedback', icon: ChatBubbleOutlineIcon, route: '/admin/feedback' },
    { label: 'Inventory', icon: InventoryIcon, route: '/admin/inventory/items' },
    { label: 'Courses', icon: RocketIcon, route: '/admin/courses/overview' },
    { label: 'Schools', icon: BusinessIcon, route: '/admin/schools/overview' },
    { label: 'Settings', icon: SettingsIcon, route: '/admin/settings' },

  ];

  return (
    <>
      <Head>
      </Head>
      <div lang="en">
      <AdminToolBar></AdminToolBar>
        <SideBar menuOptions={menuOptions}>
            <main>{children}</main>
        </SideBar>
       
      </div>
    </>
  );
}