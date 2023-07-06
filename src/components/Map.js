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
  const initialCenter = {
    lat: 34.68592640282977,
    lng: 135.83985002600292,
  };
  const [todos, setTodos] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [center, setCenter] = useState(initialCenter);

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

  // マップの設定
  const containerStyle = {
    width: "100%",
    height: "100vh",
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
    mapTypeControl: false, // 地図の種類コントロールを無効化する
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

  const markerOptions = todos.map((todo) => ({
    label: todo.place,
    value: todo.id,
  }));

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };

  const handleAskButtonClick = () => {
    // ChatGPTに選択された場所を渡すなどの処理を実装する
    console.log("選択された場所:", selectedMarker.place);
  };

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

  return (
    <>
      <div className="container px-36 py-5 mx-auto font-sans">
        <div className="text-center mb-3">
          <h1 className="text-5xl text-blue-500">YSmt Map</h1>
          <p className="text-2xl">
            YSmt Map is a map that visualizes congestion.
          </p>
        </div>
        <div className="-mb-4">
          <LoadScript googleMapsApiKey={process.env.REACT_APP_MAP}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={16}
              options={mapOptions}
            >
              <div className="absolute top-0 left-0 p-4 z-10">
                <select
                  value={selectedOption}
                  onChange={handleOptionChange}
                  className="p-2 bg-white border border-gray-300 rounded shadow"
                >
                  <option value="">Select a place</option>
                  {markerOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
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
      </div>
    </>
  );
};

export default Map;
