import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { auth } from '../database/firebase';
import { userLogin, userLogout } from '../slices/userSlice';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function Home() {
  const dispatch = useDispatch();
  
  // 로그인해서 리덕스에 저장한 값은 새로고침 전까지 유지
  const user = useSelector((state)=>(state.user));
  const user1 = useSelector((state)=>(state.user.user));

  // 로그아웃 
  const onLogout = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
      dispatch(userLogout());
      sessionStorage.clear();
    }).catch((error) => {
      // An error happened.
    });    
  }

  // 새로고침할 때, auth에 로그인 되었는지 확인하고
  // 로그인 되어있다면 값을 가져온다
  /*
  useEffect(()=>{
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        dispatch(userLogin({
          name : user.displayName,
          email : user.email,
          uid : user.uid,
          photo : user.photoURL
        }))
        // ...
      } else {
        // User is signed out
      }
    });
  },[])
  */
  
  // 새로고침했을 때 세션 값은 살아있지만 페이지가 완전히 꺼지면 값은 사라진다
  // >> 각 데이터마다 살아있는 기간을 확인하여 사용해야 함
  useEffect(()=>{
    const userData = sessionStorage.getItem('user');
    // 문자열에서 객체로 바꿔 사용
    if(userData) {
    dispatch(userLogin(JSON.parse(userData)));
    }
  },[])


  return (
    <div>
      <h3>Home</h3>
      <Link to='/login'>로그인창으로 이동</Link><br />
      <button onClick={ onLogout }>로그아웃</button>
      <p>{user.user && user.user.name}</p>
      <p>{user1 && user1.name}</p>
      <img src={user1 && user1.photo} alt="" />
    </div>
  )
}
