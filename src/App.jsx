import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./Navbar";

function App() {
  return (
    <>
      <BrowserRouter>
        <div>
          <Routes>
            <Route path="/" element={<Navbar />} />
          
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
