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

const Map = () => {
  const [todos, setTodos] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState("");

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
          });
        });
        setTodos(arrList);
      }
    );

    return () => {
      unsubscribe(); // リスナーを解除する
    };
  }, []);

  // マップの設定
  const containerStyle = {
    width: "100%",
    height: "100vh",
  };

  const center = {
    lat: 34.68592640282977,
    lng: 135.83985002600292,
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

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };

  const handleAskButtonClick = () => {
    // ChatGPTに選択された場所を渡すなどの処理を実装する
    console.log("選択された場所:", selectedMarker.place);
  };

  return (
    <>
      <div className="container px-36 py-5 mx-auto">
        <div className="text-center text-xl mb-3">
          <h1>混雑度可視化マップ</h1>
        </div>
        <div className="">
          <LoadScript googleMapsApiKey={process.env.REACT_APP_MAP}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={16}
              options={mapOptions}
            >
              {todos.map((todo) => (
                <>
                  <Marker
                    key={todo.id}
                    position={{ lat: todo.lat, lng: todo.lon }}
                    label={{
                      text: todo.place,
                      fontSize: "14px",
                      fontWeight: "bold",
                      backgroundColor: "white",
                      color: "black",
                      padding: "6px",
                      borderRadius: "100%",
                    }}
                    onClick={() => handleMarkerClick(todo)}
                  />
                  <Circle
                    key={todo.id}
                    center={{ lat: todo.lat, lng: todo.lon }}
                    options={circleOptions}
                    radius={todo.crowd * 1.5}
                  />
                </>
              ))}
              {selectedMarker && (
                <InfoWindow
                  position={{
                    lat: selectedMarker.lat,
                    lng: selectedMarker.lon,
                  }}
                  onCloseClick={() => setSelectedMarker(null)}
                >
                  <div>
                    <h1 className="underline font-bold text-xl">
                      {selectedMarker.place}
                    </h1>
                    <p className="text-lg">混雑度: {selectedMarker.crowd}</p>
                    <button onClick={handleAskButtonClick}>
                      ChatGPTに聞く
                    </button>
                  </div>
                </InfoWindow>
              )}
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
