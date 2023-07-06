import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { collection, onSnapshot } from "firebase/firestore";
import fireStoreDB from "../lib/firebase";
import markerYasumoto from "../images/Yasumoto.png";
import markerSuwa from "../images/Suwa.png";
import markerMatsuda from "../images/Matsuda.png";
import markerMatsui from "../images/Matsui.png";

const Ysmt = () => {
  const initialCenter = {
    lat: 34.68592640282977,
    lng: 135.83985002600292,
  };

  const containerStyle = {
    width: "95%",
    height: "95vh",
    sm: "full",
  };

  const mapOptions = {
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
    ],
    mapTypeControl: false,
  };

  const [todos, setTodos] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [center, setCenter] = useState(initialCenter);
  const [infoWindowOpen, setInfoWindowOpen] = useState(true); // 吹き出しの初期表示をオンにする

  const markerOptions = todos.map((todo) => ({
    label: todo.place,
    value: todo.id,
  }));

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
      unsubscribe();
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

  const handleOptionChange = (event) => {
    const selectedId = event.target.value;
    const selectedTodo = todos.find((todo) => todo.id === selectedId);
    setSelectedOption(selectedId);
    if (selectedTodo) {
      setCenter({
        lat: selectedTodo.lat,
        lng: selectedTodo.lon,
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
                <Marker
                  key={todo.id}
                  icon={{
                    url: getMarkerImage(todo.ysmt),
                    scaledSize: new window.google.maps.Size(60, 60),
                  }}
                  position={{ lat: todo.lat, lng: todo.lon }}
                  label={{
                    text: todo.place,
                    fontSize: "14px",
                    fontWeight: "bold",
                    backgroundColor: "white",
                    color: "black",
                    padding: "6px",
                    borderRadius: "100%",
                    anchor: new window.google.maps.Point(12, 36),
                  }}
                />
              ))}
            </GoogleMap>
          </LoadScript>
        </div>
      </div>
    </>
  );
};

export default Ysmt;
