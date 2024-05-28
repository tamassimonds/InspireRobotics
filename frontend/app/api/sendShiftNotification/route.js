/*
NOTE: 
Functionality so it doesn't send email to last person notified. If you have twice and press email twice on each one will reemail orginal person


*/ 



import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
const admin = require('firebase-admin');
// Configure your email transport here
const transporter = nodemailer.createTransport({
    service: 'gmail', // Replace with your email provider
    auth: {
        user: 'schedular@inspirerobotics.com.au', // Replace with your email
        pass: 'vhha poma ttam mngr', // Replace with your email password or app specific password
    },
});

var serviceAccount = require("../inspirerobotics-35626-firebase-adminsdk-pjkc9-59a8dc928c.json");

// Initialize Firebase Admin SDK
if (admin.apps.length === 0) {
  console.log("Initializing the default Firebase app");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://inspirerobotics-35626-default-rtdb.firebaseio.com"
  });
} else {
  console.log("Default Firebase app already exists");
}

// Get Firestore instance from Admin SDK
const db = admin.firestore();

const getSessionsWithNotifications = async () => {
    try {
        const sessionsSnapshot = await db.collection('sessions')
            .where('teachersToBeNotified', '!=', null)
            .get();

        const sessions = [];
        sessionsSnapshot.forEach(doc => {
            const sessionData = doc.data();

            // Filter out already notified teachers
            const teachersToBeNotified = sessionData.teachersToBeNotified.filter(
                teacherId => !sessionData.hasBeenNotified || !sessionData.hasBeenNotified.includes(teacherId)
            );

            if (teachersToBeNotified.length > 0) {
                sessions.push({ id: doc.id, teachersToBeNotified });
            }
        });

        return sessions;
    } catch (error) {
        console.error('Error getting sessions: ', error);
        throw error;
    }
};

const getTeachersByIds = async (uniqueTeachersToBeNotified) => {
    if (uniqueTeachersToBeNotified.length === 0) {
        return []; // Return an empty array if no teachers to be notified
    }

    try {
        
        // Firestore query to find teachers whose id is in uniqueTeachersToBeNotified
        const querySnapshot = await db.collection('employees')
            .where('id', 'in', uniqueTeachersToBeNotified)
            .get();

        const teachers = [];
        querySnapshot.forEach(doc => {
            teachers.push(doc.data());
        });

        return teachers;
    } catch (error) {
        console.error('Error getting teachers: ', error);
        throw error;
    }
};

const updateSessionWithNotifiedTeachers = async (sessionId, notifiedTeacherIds) => {
    try {
        const sessionRef = db.collection('sessions').doc(sessionId);

        // Update the session with the IDs of the notified teachers
        await sessionRef.update({
            hasBeenNotified: notifiedTeacherIds
        });

        console.log(`Updated session ${sessionId} with notified teachers`);
    } catch (error) {
        console.error('Error updating session with notified teachers: ', error);
        throw error;
    }
};

const sendShiftAssignedEmail = async (email) => {
    if(!email){
        return
    }
    const mailOptions = {
        from: 'schedular@inspirerobotics.com.au', // Replace with your email
        to: email,
        subject: 'Inspire Robotics: New Shift Assigned',
        text: 'You have been assigned a new shift. Please check your schedule.',
    };
    transporter.sendMail(mailOptions);
}


export async function POST(request) {
    try {
       

        
        const sessionsToBeNotified = await getSessionsWithNotifications();
       

        const teachersToBeNotified = sessionsToBeNotified.map(session => session.teachersToBeNotified).flat();

        if(teachersToBeNotified.length === 0){
            return new NextResponse(JSON.stringify({ message: `No email sent` }), {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        const uniqueTeachersToBeNotified = [...new Set(teachersToBeNotified)];

        const teacherInfo = await getTeachersByIds(uniqueTeachersToBeNotified);
        const teacherEmails = teacherInfo.map(teacher => teacher.email);
        const emailPromises = teacherEmails.map(email => sendShiftAssignedEmail(email));
        await Promise.all(emailPromises);
        

        // Prepare promises to update notified status for each session
        const updateSessionPromises = sessionsToBeNotified.map(session => {
            const notifiedTeacherIds = session.teachersToBeNotified.filter(id => uniqueTeachersToBeNotified.includes(id));
            return updateSessionWithNotifiedTeachers(session.id, notifiedTeacherIds);
        });

        // Use Promise.all to wait for all session updates
        await Promise.all(updateSessionPromises);
        

        return new NextResponse(JSON.stringify({ message: `Email sent to ${email}` }), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
       
        return new NextResponse(JSON.stringify({ message: 'Failed to send email', error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}