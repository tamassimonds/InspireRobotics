"use client"
import AddressesMap from "./AddressMap";

import {getAllTeachers} from "/lib/firebase/library";
import {useEffect, useState} from "react";

export default function SchoolMap() {

    const [teacherAddresses, setSchoolAddresses] = useState([]);

    useEffect(() => {
        const fetchSchools = async () => {
            const teachers = await getAllTeachers();
            console.log("teachers", teachers)
            const addresses = teachers.map(teacher => teacher.address);
            addresses.filter(address => address !== "" && address !== null && address !== undefined)
            setSchoolAddresses(addresses);
            console.log(addresses);
        }
        fetchSchools();
    }, []);
    return (
        <div>
            <h1>Map of Employees</h1>
            <AddressesMap addresses={teacherAddresses} />
        </div>
    );
}