"use client"
import React from 'react';
import BioCard from "/components/card/bioCard";

import { useSearchParams } from 'next/navigation'



export default function Home() {
  const searchParams = useSearchParams();

  const employeeID = searchParams.get('id');
    return (
        <div>
            {employeeID && <BioCard employeeID={employeeID} />}
            {/* Render BioCard only if employeeID is available */}
        </div>
    );
}