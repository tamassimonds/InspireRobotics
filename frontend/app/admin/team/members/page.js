
"use client"
import Table from "/components/table/Table.js"
import Button from '@mui/joy/Button';
import TeamMemberTable from "/components/table/specific/TeamMembersTable.js"
import EmployeeMap from "/components/map/main/specific/EmployeeMap.js"
import { useRouter } from 'next/navigation'


export default function TeamMembers() {
  const router = useRouter()
  const handleRowSelected = (row) => {
    console.log(row)
      router.push('/admin/team/members/memberProfile?memberID='+row.id);
  }

  const addNewEmployeePressed = () => {
    router.push('/admin/team/members/addNewMember');
  }

    return (
      <div>
      <TeamMemberTable handleRowSelected={handleRowSelected} addNewEmployeePressed={addNewEmployeePressed}/>
      <EmployeeMap/>
      </div>
    )
  }
  