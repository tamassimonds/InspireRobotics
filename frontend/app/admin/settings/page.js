"use client"
import Card from '@mui/joy/Card';

import Button from '@mui/joy/Button';

import {useRouter} from "next/navigation"
export default function Home() {
    const router = useRouter();
    const handleButtonClick = () => {
      router.push("/admin/settings/changePaySettings"); // Corrected function call
  };
    
    return (
      <div>
        <h1>Settings</h1>
        <Card>
            <Button onClick={handleButtonClick}>Change Pay Defaults Settings</Button>


        </Card>

      </div>
     
    )
  }
  