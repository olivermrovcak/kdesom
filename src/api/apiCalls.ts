import {collection, doc, setDoc } from "firebase/firestore";
import {db} from "../firebase/firebaseConfig";

export async function saveRecordToFirestore(userEmail: string, record: any) {
    try {
        const userDocRef = doc(db, "users", userEmail);
        const userRecordsRef = collection(userDocRef, "records");
        const recordDocRef = doc(userRecordsRef);
        await setDoc(recordDocRef, record);
    } catch (error) {
        console.error("Error writing record: ", error);
    }
}