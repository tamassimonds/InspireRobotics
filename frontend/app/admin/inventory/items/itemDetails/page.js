"use client"
import Card from '@mui/joy/Card';
import Table from '/components/table/Table.js';
import Button from '@mui/joy/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box'; // Import Box for layout
import Grid from '@mui/material/Grid'; // Import Grid for layout

import { useEffect, useState } from 'react';

import { getItemWithID } from '/lib/firebase/inventoryFirebaseLogic';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [item, setItem] = useState([]); // This will be an array of objects with the shape: [{id: string, name: string}]

  const router = useRouter();
  const searchParams = useSearchParams();
  const itemID = searchParams.get('itemID');

  useEffect(() => {
    getItemWithID(itemID).then((data) => {
      setItem(data);
    });
  }, [itemID]);

  const editPressed = () => {
    router.push(`/admin/inventory/items/addItems?id=${itemID}`);
  };

  if (!item) {
    return <Typography variant="h5">Loading item details...</Typography>;
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        This is the Item Details
      </Typography>
      <Card sx={{ position: 'relative' }}>
        <Grid container>
          <Grid item xs={3}>
            <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: 'auto' }} />
          </Grid>
          <Grid item xs={9} sx={{ padding: 2 }}>
            
        <Typography variant="h5" gutterBottom>Details</Typography>
        <Typography variant="body1"><strong>Name:</strong> {item.name}</Typography>
        <Typography variant="body1"><strong>Description:</strong> {item.description}</Typography>
        <Typography variant="body1"><strong>Cost:</strong> {item.cost}</Typography>
        <Typography variant="body1"><strong>ID:</strong> {item.id}</Typography>
        <Typography variant="body1"><strong>Link:</strong> {item.link}</Typography>
        <Typography variant="body1"><strong>Finite:</strong> {item.finite ? 'Yes' : 'No'}</Typography>
        <Typography variant="body1"><strong>Tool:</strong> {item.tool ? 'Yes' : 'No'}</Typography>
        <Button  onClick={editPressed}>Edit</Button>
        </Grid>
        </Grid>
      </Card>
      <Card>
        <Typography variant="h6" gutterBottom>Inventory</Typography>
        <p>location, quantity</p>
        <Table></Table>
      </Card>
      <Card>
        <Typography variant="h6" gutterBottom>Kits used in</Typography>
        <p>kit quantity, quantity</p>

        <Table></Table>
      </Card>
    </div>
  );
}