"use client"
import AddressesMap from "./AddressMap";

import {schoolsRunningPrograms} from "/lib/firebase/library";
import {useEffect, useState} from "react";

export default function SchoolMap() {

    const [schoolAddresses, setSchoolAddresses] = useState([]);

    useEffect(() => {
        const fetchSchools = async () => {
            const schools = await schoolsRunningPrograms();
            console.log("schools", schools)
            const addresses = schools.map(school => school.address);
            addresses.filter(address => address !== "" && address !== null && address !== undefined)
            setSchoolAddresses(addresses);
            console.log(addresses);
        }
        fetchSchools();
    }, []);
    return (
        <div>
            <h1>Map of Schools</h1>
            <AddressesMap addresses={schoolAddresses} />
        </div>
    );
}