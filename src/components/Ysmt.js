import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Circle,
  InfoWindow,
} from "@react-google-maps/api";
import { collection, onSnapshot } from "firebase/firestore";
import fireStoreDB from "../lib/firebase";
import markerYasumoto from "../images/Yasumoto.png";
import markerSuwa from "../images/Suwa.png";
import markerMatsuda from "../images/Matsuda.png";
import markerMatsui from "../images/Matsui.png";

const Ysmt = () => {
  //初期センターポジション
  const initialCenter = {
    lat: 34.68592640282977,
    lng: 135.83985002600292,
  };

  // マップ大きさ
  const containerStyle = {
    width: "95%",
    height: "95vh",
    sm: "full",
  };

  //マップ設定
  const mapOptions = {
    styles: [
      // カスタムスタイルを指定する
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }], // POI（地名や施設）のラベルを非表示にする
      },
    ],
    mapTypeControl: false, // 地図の種類コントロールを無効化する
  };
  //サークル設定(混雑度可視化用)
  const circleOptions = {
    strokeColor: "#de7c6b",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#de7c6b",
    fillOpacity: 0.35,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    zIndex: 1,
  };

  //state
  const [todos, setTodos] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [center, setCenter] = useState(initialCenter);

  const markerOptions = todos.map((todo) => ({
    label: todo.place,
    value: todo.id,
  }));

  //DB読み込み
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(fireStoreDB, "sight"),
      (snapshot) => {
        const arrList = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          arrList.push({
            id: doc.id,
            place: data.place,
            lat: data.lat,
            lon: data.lon,
            crowd: data.crowd,
            ysmt: data.ysmt,
          });
        });
        setTodos(arrList);
      }
    );

    return () => {
      unsubscribe(); // リスナーを解除する
    };
  }, []);

  //マップ上のプルダウンメニュー
  useEffect(() => {
    if (selectedOption) {
      const selectedTodo = todos.find((todo) => todo.id === selectedOption);
      if (selectedTodo) {
        setCenter({
          lat: selectedTodo.lat,
          lng: selectedTodo.lon,
        });
      }
    }
  }, [selectedOption, todos]);

  const handleOptionChange = (event) => {
    const selectedId = event.target.value;
    const selectedTodo = todos.find((todo) => todo.id === selectedId);
    console.log(selectedTodo);
    setSelectedOption(selectedId);
    if (selectedTodo) {
      setCenter({
        lat: selectedTodo.lat,
        lng: selectedTodo.lng,
      });
    }
  };

  const getMarkerImage = (ysmt) => {
    switch (ysmt) {
      case "y":
        return markerYasumoto;
      case "s":
        return markerSuwa;
      case "m":
        return markerMatsuda;
      case "t":
        return markerMatsui;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="container px-36 py-5 mx-auto pb-0 font-sans">
        <div className="text-center mb-3">
          <h1 className="text-5xl font-bold text-blue-500">YSmt Map</h1>
          <p className="text-2xl">
            YSmt Map is a map that visualizes congestion.
          </p>
        </div>
        <div className="flex justify-center items-center h-screen">
          <LoadScript googleMapsApiKey={process.env.REACT_APP_MAP}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={16}
              options={mapOptions}
            >
              <div className="absolute top-0 left-0 p-4 z-10">
                <div className="bg-white bg-opacity-80 p-2 border border-gray-300 rounded shadow">
                  <select
                    value={selectedOption}
                    onChange={handleOptionChange}
                    className="w-full"
                  >
                    <option value="">Select a place</option>
                    {markerOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="bg-white bg-opacity-70 p-2 rounded mt-2">
                  <p className="text-xs">Y: 75 ~ 100</p>
                  <p className="text-xs">S: 50 ~ 74</p>
                  <p className="text-xs">m: 25 ~ 49</p>
                  <p className="text-xs">t: 0 ~ 24</p>
                </div>
              </div>
              {todos.map((todo) => (
                <>
                  <Marker
                    key={todo.id}
                    icon={{
                      url: getMarkerImage(todo.ysmt), // インポートした画像を指定する
                      scaledSize: new window.google.maps.Size(60, 60),
                    }}
                    position={{ lat: todo.lat, lng: todo.lon }}
                  />
                </>
              ))}
            </GoogleMap>
          </LoadScript>
        </div>
      </div>
    </>
  );
};

export default Ysmt;
