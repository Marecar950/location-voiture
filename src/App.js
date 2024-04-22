import {Routes, Route} from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import Dashboard from "./admin/Dashboard.js";
import AddCarForm from "./admin/AddCarForm.js";
import EditCarForm from "./admin/EditCarForm.js";
import './App.css';

function App() {
  return (
    <div className="mt-2">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/addCarForm" element={<AddCarForm />} />
        <Route path="/editCarForm/:id" element={<EditCarForm />} />
    </Routes>
    </div>
  );
}

export default App;
