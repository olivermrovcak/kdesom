import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();


export default function signUp() {
    const email = "olivermrovcak22@gmail.com"
    const password = "password"
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(user);
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ..
        });
}
