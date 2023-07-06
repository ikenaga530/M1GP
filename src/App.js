import Header from "./components/Header";
import Map from "./components/Map";
import Ysmt from "./components/Ysmt";
import { useRecoilValue } from "recoil";
import { ubiModeState } from "./lib/atom";

const App = () => {
  const show = useRecoilValue(ubiModeState);
  return (
    <>
      <Header />
      {show ? <Ysmt /> : <Map />}
    </>
  );
};

export default App;
