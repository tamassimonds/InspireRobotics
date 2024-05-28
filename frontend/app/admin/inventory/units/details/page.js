"use client"
import Card from '@mui/joy/Card';

import UnitDetailsCard from "/components/card/specific/UnitDetails.js"
import { useSearchParams } from 'next/navigation'

export default function Home() {
  const searchParams = useSearchParams()
 
  const unitID = searchParams.get('unitID')
    return (
      <div>
        <UnitDetailsCard unitID ={unitID }/>

      </div>
     
    )
  }
 

  