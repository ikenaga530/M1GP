import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker, Circle } from "@react-google-maps/api";
import { collection, onSnapshot } from "firebase/firestore";
import fireStoreDB from "../lib/firebase";
import { chat } from "./Chat";

const Map = () => {
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

  const [todos, setTodos] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [center, setCenter] = useState(initialCenter);
  const [modalOpen, setModalOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatOutput, setChatOutput] = useState("");

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

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
    setModalOpen(true);
  };

  const handleAskButtonClick = async () => {
    console.log(chatInput, selectedMarker.place);
    const message_body = chatInput;
    const responseText = await chat(selectedMarker.place, message_body);

    setChatOutput(responseText); // ChatGPTへの質問に関する処理を実装することで、実際の応答を取得できます
  };

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

  const handleModalClose = () => {
    setModalOpen(false);
    setChatInput("");
    setChatOutput("");
  };

  const handleChatInputChange = (event) => {
    setChatInput(event.target.value);
  };

  const handleModalClick = (event) => {
    event.stopPropagation();
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
                <React.Fragment key={todo.id}>
                  <Marker
                    position={{ lat: todo.lat, lng: todo.lon }}
                    onClick={() => handleMarkerClick(todo)}
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
                  <Circle
                    center={{ lat: todo.lat, lng: todo.lon }}
                    options={circleOptions}
                    radius={todo.crowd * 1.5}
                  />
                </React.Fragment>
              ))}
              {selectedMarker && modalOpen && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
                  onClick={handleModalClose}
                >
                  <div
                    className="bg-white p-8 rounded shadow text-center w-1/2"
                    onClick={handleModalClick}
                  >
                    <h1 className="text-2xl font-bold mb-4">
                      {selectedMarker.place}
                    </h1>
                    <h1 className="text-1xl font-bold mb-4">
                      混雑度: {selectedMarker.crowd}
                    </h1>
                    {chatOutput ? (
                      <p className="mb-4">{chatOutput}</p>
                    ) : (
                      <>
                        <textarea
                          className="w-full h-24 p-2 border border-gray-300 rounded mb-4"
                          placeholder="質問を入力してください"
                          value={chatInput}
                          onChange={handleChatInputChange}
                        ></textarea>
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded"
                          onClick={handleAskButtonClick}
                        >
                          ChatGPTに聞く
                        </button>{" "}
                        <p className="mt-2 mb-0 mb-4">
                          ※時間かかります(たまにバグります)
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </GoogleMap>
          </LoadScript>
        </div>
      </div>
    </>
  );
};

export default Map;
