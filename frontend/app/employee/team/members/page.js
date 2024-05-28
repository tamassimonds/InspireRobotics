"use client"

import Table from "/components/table/Table.js"
import Button from '@mui/joy/Button';
import TeamMemberTable from "/components/table/specific/TeamMembersTable.js"
import BioCardShort from "/components/card/bioCardShort.js"
import Card from '@mui/joy/Card';

import {useRouter} from 'next/navigation'

export default function TeamMembers() {
  const router = useRouter()
  const handleRowSelected = (row) => {
    router.push(`/employee/team/members/profile?id=${row.id}`)
  }
  return (
    <div>
   
      <div style={{
          display: 'flex', // Enable Flexbox
          flexWrap: 'wrap', // Allow items to wrap to the next line
          gap: '20px', // Space between the cards
          justifyContent: 'center', // Center the cards horizontally
          alignItems: 'center' // Center the cards vertically
      }}>
        <Card>
        <TeamMemberTable handleRowSelected={handleRowSelected} isAdmin={false} />
        </Card>
        {/* More BioCardShort components can be added here in the future */}
      </div>
    </div>
  );
}