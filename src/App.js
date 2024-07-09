import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Questionnaire from './components/Questionnaire';
import ProgressBar from './components/ProgressBar';
import AssessmentProvider from './context/AssessmentContext';
import './App.css';

function App() {
  return (
    <AssessmentProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<Questionnaire />} />
          </Routes>
          {/* Footer component is not needed for now */}
        </div>
      </Router>
    </AssessmentProvider>
  );
}

export default App;
