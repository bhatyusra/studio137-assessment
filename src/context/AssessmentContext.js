import React, { createContext, useState } from 'react';

export const AssessmentContext = createContext();

const AssessmentProvider = ({ children }) => {
  const [answers, setAnswers] = useState({});
  const [progress, setProgress] = useState(0);

  const updateProgress = (newProgress) => {
    setProgress(newProgress);
  };

  return (
    <AssessmentContext.Provider value={{ answers, setAnswers, progress, updateProgress }}>
      {children}
    </AssessmentContext.Provider>
  );
};

export default AssessmentProvider;
