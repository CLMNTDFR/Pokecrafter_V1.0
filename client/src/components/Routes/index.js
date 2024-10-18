import React from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import Home from "../../pages/Home";
import Trending from "../../pages/Trending";
import Profil from "../../pages/Profil";
import Contest from "../../pages/Contest";
import Add from "../../pages/Add";
import NavBar from "../NavBar";
import MessageButton from "../MessageButton";
import Artistepage from "../../pages/Artistepage";
import Messenger from "../../pages/Messenger";

const Index = () => {
  return (
    <Router>
      <MessageButton />
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trending" element={<Trending />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/contests" element={<Contest />} />
        <Route path="/artist" element={<Artistepage />} />
        <Route path="/add" element={<Add />} />
        <Route path="/messages" element={<Messenger />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default Index;
