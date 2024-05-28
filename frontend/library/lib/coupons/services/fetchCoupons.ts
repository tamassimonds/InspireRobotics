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

import { Coupon} from "../coupon";


export const getCoupon = async (couponID: string): Promise<Coupon[]> => {
    const couponRef = query(collection(db, "couponCodes"), where("id", "==", couponID));
    const couponQuerySnapshot = await getDocs(couponRef);

    if (couponQuerySnapshot.empty) {
        throw new Error("Coupon not found");
    }

    const couponDocRef = couponQuerySnapshot.docs[0].ref;
    const curriculaRef = collection(couponDocRef, "curricula");
    const curriculaSnapshot = await getDocs(curriculaRef);
    const curricula = curriculaSnapshot.docs.map(doc => doc.data() as Coupon);

    return curricula;
};


export const getAllCoupons = async (): Promise<Coupon[]> => {
    const couponsRef = collection(db, "couponCodes");
    const couponsQuerySnapshot = await getDocs(couponsRef);

    // if (couponsQuerySnapshot.empty) {
    //     throw new Error("No coupons found");
    // }

    const couponsData = couponsQuerySnapshot.docs.map(doc => doc.data() as Coupon);
    return couponsData;
};