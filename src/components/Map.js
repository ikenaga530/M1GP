import React, { useEffect, useState } from "react";
import {
  CircleF,
  GoogleMap,
  InfoWindow,
  InfoWindowF,
  LoadScript,
  Marker,
  MarkerF,
} from "@react-google-maps/api";
import fireStoreDB from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

const Map = () => {
  /* firebase */
  //useState　初期設定
  const [todos, setTodos] = useState([]);

  //データ取得用配列
  const arrList = [];

  //useEffectの処理
  useEffect(() => {
    const fireStorePostData = collection(fireStoreDB, "sight");
    getDocs(fireStorePostData).then((snapShot) => {
      snapShot.forEach((docs) => {
        const doc = docs.data();
        arrList.push({
          id: docs.id,
          place: doc.place,
          lat: doc.lat,
          lon: doc.lon,
          crowd: doc.crowd,
        });
      });
      setTodos(arrList);
    });
  }, []);

  /*データ更新(最悪ケース)*/
  // const fetchData = async () => {
  //   const fireStorePostData = collection(fireStoreDB, "sight");
  //   const snapShot = await getDocs(fireStorePostData);
  //   const arrList = [];
  //   snapShot.forEach((docs) => {
  //     const doc = docs.data();
  //     arrList.push({
  //       id: docs.id,
  //       place: doc.place,
  //       lat: doc.lat,
  //       lon: doc.lon,
  //       crowd: doc.crowd,
  //     });
  //   });
  //   setTodos(arrList);
  // };

  // // useEffectの処理-ここから
  // useEffect(() => {
  //   // 初回のデータ取得
  //   fetchData();

  //   // 定期的なポーリングを行うためのタイマー
  //   const timer = setInterval(() => {
  //     fetchData();
  //   }, 5000); // 5秒ごとにデータを更新

  //   return () => {
  //     // コンポーネントがアンマウントされたときにタイマーをクリア
  //     clearInterval(timer);
  //   };
  // }, []);

  const containerStyle = {
    width: "100%",
    height: "100vh",
  };

  const center = {
    lat: 34.688945692404246,
    lng: 135.83986903087077,
  };

  const mapOptions = {
    styles: [
      // カスタムスタイルを指定する
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }], // POI（地名や施設）のラベルを非表示にする
      },
    ],
  };

  const labelStyle = {
    backgroundColor: "white",
    color: "black",
    fontWeight: "bold",
    fontSize: "18px",
    padding: "6px",
    borderRadius: "100%",
  };

  const circleOptions = {
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#FF0000",
    fillOpacity: 0.35,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    zIndex: 1,
  };

  return (
    <>
      {/* <div>
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>
              <div>場所：{todo.place}</div>
              <div>緯度：{todo.lat}</div>
              <div>経度：{todo.lon}</div>
              <div>混雑度:{todo.crowd}</div>
            </li>
          ))}
        </ul>
      </div> */}
      <div className="container px-36 py-5 mx-auto">
        <div className="text-center text-xl mb-3">
          <h1>混雑度可視化マップ</h1>
        </div>
        <div className="">
          <LoadScript googleMapsApiKey={process.env.REACT_APP_MAP}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={15}
              options={mapOptions} // オプションを指定する
            >
              {/* <Marker position={center} visible={false} /> */}
              {todos.map((todo) => (
                <MarkerF
                  position={{ lat: todo.lat, lng: todo.lon }}
                  label={{
                    text: todo.place,
                    fontSize: "14px",
                    fontWeight: "bold",
                    ...labelStyle,
                  }}
                >
                  <InfoWindowF position={{ lat: todo.lat, lng: todo.lon }}>
                    <div>
                      <h4>混雑度:{todo.crowd}</h4>
                    </div>
                  </InfoWindowF>
                  <CircleF
                    center={{ lat: todo.lat, lng: todo.lon }}
                    options={circleOptions}
                    radius={50}
                  />
                </MarkerF>
              ))}
            </GoogleMap>
          </LoadScript>
        </div>
        <div className="flex flex-wrap">
          <div className="md:w-1/3">
            <div className="bg-gra-100">aaa</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Map;
