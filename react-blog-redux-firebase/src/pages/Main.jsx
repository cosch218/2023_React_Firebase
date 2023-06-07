import React from 'react';

// firebase.js에서 auth로 export한 getAuth(app)를 import
import { auth, db } from '../database/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'; 
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function Main() {
  // 유저 추가 함수 - firestore 작성
  // user : { uid, email }
  const addUser = async(user) => {
    // uid를 랜덤이 아닌 지정하여 저장하려면 set()메소드 사용
    // set()메소드는 uid가 똑같다면 덮어씌우고 uid가 없다면 새로 만들기때문에 uid가 똑같을 때 조건문을 작성해야 함
    await setDoc(doc(db, "users", user.uid), user);
  }

  // 유저 확인 함수 - firestore 작성
  const CheckUser = async(user) => {
    const docRef = await getDoc(doc(db, "users", user.uid));
    // exists() 함수는 getDoc을 통해서 가져온 값이 있으면 true출력 없으면 false출력
    if(!docRef.exists()) {
      addUser(user);
    } else {
      console.log('가입되어 있습니다.');
    }
  }
  
  // 구글 로그인 함수
  const onGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
    .then(async(result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;

      // 구글로 로그인 후 정보 값 가져옴
      const user = result.user;
      console.dir(user);

      // 로그인 했다면, uid를 확인 후 firestore에 저장
      CheckUser({uid: user.uid, email: user.email});

    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
  }

  return (
    <div>
      <h3>Main</h3>
      <button onClick={onGoogleLogin}>구글 로그인</button>

      <h4>{}님 환영합니다</h4>
    </div>
  )
}
