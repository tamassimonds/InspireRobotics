import Table from "/components/table/Table.js";
import Button from '@mui/joy/Button';

import Link from "next/link";
import SchoolsTable from "/components/table/specific/SchoolsTable.js";

export default function Home() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Schools</h1>
        <Link href="./overview/addSchool"> <Button color="success"> Add School</Button></Link>
       
      </div>
      <SchoolsTable/> 
    </div>
  );
}