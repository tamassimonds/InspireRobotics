import { Tutorial, db_to_tutorial } from "../tutorials/tutorial";
import {
    db,
    auth
} from '/lib/firebase/initFirebase';

import {
    collection,
    doc,
    getDocs,
    setDoc,
    deleteDoc,
    query,
    where
} from "firebase/firestore";


export type TutorialCurriculum =  Tutorial & {
    sessionNumber: number;
};



export type Curriculum = {
    id: string;
    title: string;
    isHolidayProgram: boolean;
    numSessions: number;
    holidayModule: any;
    tutorials: Tutorial[];
    additionalInfo: string;
};
