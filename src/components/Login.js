import { useRef, useState } from "react";
import Header from "./Header";
import { checkValidData } from "../utils/validate";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { USER_AVATAR } from "../utils/constants";

const Login = () => {

    const [isSignInForm, setIsSignInForm]= useState(true);
    const [errorMessage, setErrorMessage]=useState(null);
    const dispatch = useDispatch();
    
    const name=useRef(null);
    const email = useRef(null);
    const password =useRef(null);
    
    const handleButtonClick = () =>{
    const message= checkValidData(email.current.value,password.current.value);
    setErrorMessage(message);
    if(message) return;

    // Sign IN/Sign UP Logic
    if(!isSignInForm){
        // Sign UP Logic
        createUserWithEmailAndPassword (auth, email.current.value,password.current.value)

  .then((userCredential) => {
    const user = userCredential.user;
    updateProfile(user, {
      displayName: name.current.value,
       photoURL:  USER_AVATAR
    }).then(() => {
      const { uid,email,displayName, photoURL} = auth.currentUser;
      dispatch(addUser({uid: uid, 
        email: email, 
        displayName: displayName, 
        photoURL:photoURL
      }));   
    }).catch((error) => {
     setErrorMessage(error.message);
    });
})
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    setErrorMessage(errorCode + "-" + errorMessage);
  });

    }
    else {
        // Sign IN Logic
        signInWithEmailAndPassword(auth, email.current.value,password.current.value)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;

  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    setErrorMessage(errorCode + "-" + errorMessage)
  });
    }
};

    const toggleSigninForm = () =>{
setIsSignInForm(!isSignInForm);
    };

return  (
<div>
    <Header/>
<div className="absolute">
    <img src="https://assets.nflxext.com/ffe/siteui/vlv3/c1366fb4-3292-4428-9639-b73f25539794/3417bf9a-0323-4480-84ee-e1cb2ff0966b/IN-en-20240408-popsignuptwoweeks-perspective_alpha_website_small.jpg"
    alt="logo" />
</div>

<form  onSubmit={(e)=>e.preventDefault ()} className="w-3/12 absolute p-12 bg-black my-36 mx-auto right-0 left-0 rounded-lg text-white bg-opacity-80">
    <h1 className="font bold text-3xl py-4">{isSignInForm ?  "Sign In" : "Sign Up"} </h1>
   { !isSignInForm && (
    <input ref={name} type="text" placeholder="Full Name" className="p-2 my-4 w-full bg-gray-700"/> )}
    <input ref={email} type="text" placeholder="Email Address" className="p-2 my-4 w-full bg-gray-700"/>
    <input ref ={password} type="password" placeholder="Password" className="p-2 my-4 w-full bg-gray-700"/>

<p className="text-red-600 font-bold text-lg py-2 px-2">{errorMessage}</p>

    <button className="p-4 my-6 bg-red-700 w-full rounded-lg cursor-pointer" onClick={handleButtonClick} >{isSignInForm ?  "Sign In" : "Sign Up"}</button>
    <p className="py-4 cursor-pointer" onClick={toggleSigninForm}> {isSignInForm ? "New to Netflix? Sign Up Now." : "Already Registered? Sign In Now."}</p>
</form>

</div>
);
};
export default Login;