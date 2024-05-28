"use client"

import AllProgramsCalendar from "/components/calendar/specific/AllProgramsCalendar.js"
import ProgramSearch from "/components/search/ProgramSearch.js"
import Card from '@mui/joy/Card';
import Stack from "@mui/joy/Stack"
export default function Home() {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <Stack spacing={2}>
         
          <Card>
          <AllProgramsCalendar style={{ width: '100%', height: '100%' }} />
          </Card>
        </Stack>
      </div>
    )
}