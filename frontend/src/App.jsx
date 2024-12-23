import React from "react";
import { Routes, Route } from "react-router-dom";

import ListTeachers from "./pages/ListTeachers";
import TeacherPosition from "./pages/TeacherPosition";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div>
      <ToastContainer />

      <Routes>
        <Route path="/" element={<ListTeachers />} />
        <Route path="teacher-positions" element={<TeacherPosition />} />
      </Routes>
    </div>
  );
}

export default App;
