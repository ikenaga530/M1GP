import Footer from "./components/Footer";
import Header from "./components/Header";
import Map from "./components/Map";
import Ysmt from "./components/Ysmt";

const App = () => {
  const show = true;

  return (
    <>
      <Header />
      {show ? <Map /> : <Ysmt />}
      <Footer />
    </>
  );
};

export default App;
