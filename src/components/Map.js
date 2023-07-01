import React from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";

const Map = () => {
  const containerStyle = {
    width: "100%",
    height: "100vh",
  };

  const center = {
    lat: 35.69575,
    lng: 139.77521,
  };

  const mapOptions = {
    disableDefaultUI: true, // デフォルトのUI要素を非表示にする
    styles: [
      // カスタムスタイルを指定する
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }], // POI（地名や施設）のラベルを非表示にする
      },
    ],
  };

  return (
    <>
      <div className="container px-5 py-20 mx-auto">
        <div className="text-center mb-3">
          <h1>混雑度可視化マップ</h1>
        </div>
        <div>
          <LoadScript googleMapsApiKey={process.env.REACT_APP_MAP}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={17}
              options={mapOptions} // オプションを指定する
            ></GoogleMap>
          </LoadScript>
        </div>
      </div>
    </>
  );
};

export default Map;
