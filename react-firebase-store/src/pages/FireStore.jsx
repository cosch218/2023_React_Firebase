import React, { useEffect, useState } from 'react'
import { addDoc, collection, getDoc, getDocs, doc, deleteDoc, updateDoc, query, where } from 'firebase/firestore';

import { db } from '../database/firebase';

export default function FireStore() {
  // 파이어스토어에서 가져온 값을 출력
  const [users, setUsers] = useState();

  // 가져올 값을 개별 state로 가져오기
  const [first, setFirst] = useState();
  const [last, setLast] = useState();
  const [born, setBorn] = useState();

  // 수정될 값  state
  const [updateFirst, setUpdateFirst] = useState();

  // 검색할 last 값 state
  const [searchLast, setSearchLast] = useState();

  // 검색된 값 state
  const [searchLastResult, setSearchLastResult] = useState();


  // 유저 uid 값이 문서의 uid 값일 때 문서의 값을 찾아올 수 있는지 
  useEffect(()=>{
    async function getUserData () {
      // doc()을 통해서 값을 찾을 때, getDoc을 통해서 한 개의 값을 들고 옴
      const querySnapshot= await getDoc(doc(db, "userList", "X75kUCnVoTJa2lSeGrMf"));
      querySnapshot.forEach((doc)=>{
        console.log(doc.data());
      })
    }
    
  },[]);


  // 시작하자마자 값 가져오기
  useEffect(()=>{
    // const querySnapshot = await getDocs(collection(db, "users"));
    // querySnapshot.forEach((doc) => {
    //     console.log(`${doc.id} => ${doc.data()}`);
    // });
    // 위 내용을 아래 async 비동기 함수로 빼서 수정해서 작성함
    getData();
  },[]);


  // 비동기함수로 작성하여 값 가져옴
  async function getData () {
    // getDocs를 통해서 컬렉션안의 모든 문서 가져옴
    const querySnapshot = await getDocs(collection(db, "users"));

    // forEach에서 출력한 모든 값을 배열에 담음
    let dataArray = [];

    // forEach를 통해서 모든 문서값에 접근하여 원하는 값을 가져온다
    querySnapshot.forEach((doc) => {
        // doc.id와 doc.data()값을 리덕스/state에 저장하여 웹에서 사용
        // >> forEach의 모든 내용을 배열로 저장
        
        // console.log(`${doc.id} => ${doc.data()}`);
        // setUsers(doc.data());

        // id 값을 함께 넣어주기 위해서 새로운 객체 생성
        // id는 doc.id
        // 객체인 doc.data()는 ...(스프레드 연산자)를 통해서 그 안에 있는 값 꺼내서 사용
        dataArray.push({
          id: doc.id,
          // 새로운 객체를 만들기 위해
          ...doc.data()
        });
        console.log(`${doc.id} => ${doc.data().first}`);        // dataArray.push(doc.data());
    });
    // 값이 들어간 배열을 state에 넣어서 활용
    setUsers(dataArray);
} 

  // 아래의 await은 비동기 함수로만 사용 가능
  // async 추가 작성
  const addDocData = async () => {  
    try {
        // 서버에 연결해서 사용하는 것은 비동기 함수로 작성
        const docRef = await addDoc(collection(db, "users"), {
          // first: "Ada",
          // last: "Lovelace",
          // born: 1815
          first,
          last,
          born: parseInt(born)
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
      // 버튼 클릭하면 출력됨
      getData();
  }

  // id값을 가져와서 삭제
  const deleteData = async(id) => {
    // doc(db, 컬렉션이름, id)로 하나의 문서를 찾을 수 있다
    await deleteDoc(doc(db, "users", id));
    getData();
  }

  // id값을 가져와서 내용 업데이트
  const updateData = async(id) => {
    // 수정할 필드의 값을 객체 형태로 넣어줌
    await updateDoc(doc(db, "users", id), {
      first : updateFirst
    });
    getData();
  }

  // 단일 쿼리를 이용하여 last 값 찾기
  // await을 쓰기 위해 async 추가 작성
  const onSearch = async () => {
    // where를 하나만 이용한 단일 쿼리
    // 문자열에서 특정 문자열을 찾을 수 없다
    // 데이터를 세부적으로 사용하고 싶다면 따로 서버를 만들어서 SQL 또는 noSQL 사용
    const q = query(collection(db, "users"), 
      // 두 개 이상의 where을 사용할 땐 index 값 작성 필요
      // Cloud Firestore >> 색인 >> 색인 만들기
      where("last", "==", searchLast),
      where("born", ">", 1990)
    );
    // 작성한 쿼리 객체를 getDocs를 이용하여 가져옴
    const querySnapshot = await getDocs(q);
    let dataArray=[];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      dataArray.push({
        id: doc.id,
        ...doc.data()
      })
      setSearchLastResult(dataArray);
    });

  }

  return (
    <div>
        <h3>파이어스토어의 값을 추가, 가져옴 확인</h3>
        <h4>users컬렉션 확인</h4>

        <label htmlFor="">first</label>
        <input type="text" onChange={(e)=>setFirst(e.target.value)} />
        <br />
        <label htmlFor="">last</label>
        <input type="text" onChange={(e)=>{setLast(e.target.value)}} />
        <br />
        <label htmlFor="">born</label>
        <input type="text" onChange={(e)=>{setBorn(e.target.value)}} />
        <br />
        <br />

        <button onClick={addDocData}>
            버튼을 누르면 파이어스토어에 값추가
        </button>
        <hr />
        <br />

        <label htmlFor="">last 검색</label>
        <input type="text" onChange={(e)=>{setSearchLast(e.target.value)}} />
        <button
          onClick={ onSearch }
        >
          검색
        </button>
        <br />
        <br />
        {
          // 검색 결과 출력
          searchLastResult && searchLastResult.map ((user)=>(
            <div>
              {user.first}, {user.last}, {user.born}
            </div>
          ))
        }

        <hr />
        <h4>users 목록</h4>
        {
          users && users.map((user)=>(
            <div>
              <span>{user.first}, {user.last}, {user.born}</span>
              <button
                onClick={ () => {deleteData(user.id)} }
              >
                X
              </button>
              <input type="text" onChange={(e)=>{setUpdateFirst(e.target.value)}} />
              <button
                onClick={ () => {updateData(user.id)} }
              >
                first 수정
              </button>
            </div>
          ))
        }
    </div>
  )
}