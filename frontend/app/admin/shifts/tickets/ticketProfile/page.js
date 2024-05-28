"use client"
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { updateTicketStatus, getTicketByID  } from '/lib/firebase/employeeFirebaseLogic';
import { Card, CardContent, CardActions, Typography, Button } from '@mui/joy';
export default function Home() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [ticket, setTicket] = useState({});
    const id = searchParams.get('id');

    useEffect(() => {
        if (id) {
            getTicketByID(id).then((ticketData) => {
                console.log(ticketData);
                setTicket(ticketData);
            });
        }
    }, [id]);

    // Function to update ticket status and navigate
    const handleUpdateTicket = async (status) => {
        try {
            await updateTicketStatus(ticket.id, status, true);
            if(status == 'accepted'){
              await updateTicketStatus(ticket.id, "rejected", false);
            }
            else{
              await updateTicketStatus(ticket.id, "accepted", false);
            }
            router.push('/admin/shifts/tickets');
        } catch (error) {
            console.error('Error updating ticket:', error);
            // Handle error, possibly show an error message to the user
        }
    };

    // Function to handle accept
    const handleAccept = () => {
        handleUpdateTicket('accepted');
    };

    // Function to handle reject
    const handleReject = () => {
        handleUpdateTicket('rejected');
    };

    return (
        <div>
            <Typography level="h4" component="div">
                Admin
            </Typography>
            <Card variant="outlined">
                <CardContent>
                    <Typography level="h3" component="div">
                        Ticket Details
                    </Typography>
                    <Typography level="body1">
                        Subject: {ticket.subject}
                    </Typography>
                    <Typography level="body2">
                        Type: {ticket.type}
                    </Typography>
                    <Typography level="body2">
                        Status: {ticket.status}
                    </Typography>
                    <Typography level="body2">
                        Description: {ticket.description}
                    </Typography>
                    <Typography level="body2">
                        Submitted: {ticket.dateSubmitted && new Date(ticket.dateSubmitted).toLocaleString()}
                    </Typography>
                    {/* Add more properties as needed */}
                </CardContent>
                <CardActions>
                    <Button onClick={handleAccept} variant="solid" color="success">
                        Accept
                    </Button>
                    <Button onClick={handleReject} variant="solid" color="danger">
                        Reject
                    </Button>
                </CardActions>
            </Card>
          
        </div>
    );
}