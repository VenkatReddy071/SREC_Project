import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Fotter } from "./Components/Fotter/Fotter"
import { Heading } from "./Components/MainPage/Heading";
function App() {
  return (
    <>
      <BrowserRouter>
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<Heading/>} />
          
          </Routes>
          <Fotter />
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
