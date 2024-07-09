import React, { useState, useContext, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import questions from '../questions.json';
import { AssessmentContext } from '../context/AssessmentContext';
import ProgressBar from './ProgressBar';

const Questionnaire = () => {
  const { answers, setAnswers, updateProgress } = useContext(AssessmentContext);
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const totalSections = questions.length;

  useEffect(() => {
    const currentQuestion = questions[currentSection].questions[currentQuestionIndex];
    setSelectedOption(answers[currentQuestion.id] || '');
  }, [currentSection, currentQuestionIndex, answers]);

  const handleNext = (values) => {
    setAnswers({ ...answers, ...values });
    if (currentQuestionIndex < questions[currentSection].questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentSection < totalSections - 1) {
      setCurrentSection(currentSection + 1);
      setCurrentQuestionIndex(0);
    }
    setSelectedOption('');  // Clear selected option for next question
    const answeredQuestions = Object.keys(values).length;
    updateProgress(((currentSection + 1) / totalSections) * 100);
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      setCurrentQuestionIndex(questions[currentSection - 1].questions.length - 1);
    }
  };

  useEffect(() => {
    const currentQuestion = questions[currentSection].questions[currentQuestionIndex];
    setSelectedOption(answers[currentQuestion.id] || '');
  }, [currentSection, currentQuestionIndex]);

  const currentQuestion = questions[currentSection].questions[currentQuestionIndex];
  const validationSchema = Yup.object().shape({
    [currentQuestion.id]: Yup.string().required('Required')
  });

  const handleOptionClick = (setFieldValue, optionValue, values) => {
    setFieldValue(currentQuestion.id, optionValue);
    setSelectedOption(optionValue);
    setAnswers({ ...answers, ...values, [currentQuestion.id]: optionValue });
    setTimeout(() => {
      handleNext(values);
    }, 300);
  };

  const calculateSectionProgress = (sectionIndex) => {
    const sectionQuestions = questions[sectionIndex].questions;
    const answeredQuestions = sectionQuestions.filter(
      (q) => answers[q.id]
    ).length;
    return (answeredQuestions / sectionQuestions.length) * 100;
  };

  const getOptionIndex = (option) => {
    const options = ['strongly_disagree', 'disagree', 'neutral', 'agree', 'strongly_agree'];
    return options.indexOf(option);
  };

  const getCurrentQuestionNumber = () => {
    let questionNumber = 0;
    for (let i = 0; i < currentSection; i++) {
      questionNumber += questions[i].questions.length;
    }
    questionNumber += currentQuestionIndex + 1;
    return questionNumber;
  };

  return (
    <div className="questionnaire">
      <div className="tabs">
        {questions.map((section, index) => (
          <div key={index} className="tab-wrapper">
            <button
              className={`tab ${currentSection === index ? 'active' : ''}`}
              onClick={() => setCurrentSection(index)}
            >
              {section.title}
            </button>
            <ProgressBar progress={calculateSectionProgress(index)} />
          </div>
        ))}
      </div>
      <Formik
        initialValues={answers}
        validationSchema={validationSchema}
        onSubmit={handleNext}
      >
        {({ errors, touched, setFieldValue, values }) => (
          <Form>
            <div className="question-container">
              <div className="question-header">
                <span>{getCurrentQuestionNumber()}/{questions.reduce((acc, section) => acc + section.questions.length, 0)}</span>
                <h2>{currentQuestion.text}</h2>
              </div>
              <div className="options-line">
                <div className="line-background"></div>
                <div className="line-progress" style={{ width: selectedOption ? `${getOptionIndex(selectedOption) * 25}%` : '0%' }}></div>
                <span className="option-point" onClick={() => handleOptionClick(setFieldValue, 'strongly_disagree', values)} style={{ left: '0%' }}></span>
                <span className="option-point" onClick={() => handleOptionClick(setFieldValue, 'disagree', values)} style={{ left: '25%' }}></span>
                <span className="option-point" onClick={() => handleOptionClick(setFieldValue, 'neutral', values)} style={{ left: '50%' }}></span>
                <span className="option-point" onClick={() => handleOptionClick(setFieldValue, 'agree', values)} style={{ left: '75%' }}></span>
                <span className="option-point" onClick={() => handleOptionClick(setFieldValue, 'strongly_agree', values)} style={{ left: '100%' }}></span>
              </div>
              <div className="options-text">
                <span onClick={() => handleOptionClick(setFieldValue, 'strongly_disagree', values)} style={{ left: '0%' }}>Strongly Disagree</span>
                <span onClick={() => handleOptionClick(setFieldValue, 'disagree', values)} style={{ left: '25%' }}>Disagree</span>
                <span onClick={() => handleOptionClick(setFieldValue, 'neutral', values)} style={{ left: '50%' }}>Neutral</span>
                <span onClick={() => handleOptionClick(setFieldValue, 'agree', values)} style={{ left: '75%' }}>Agree</span>
                <span onClick={() => handleOptionClick(setFieldValue, 'strongly_agree', values)} style={{ left: '100%' }}>Strongly Agree</span>
              </div>
              {errors[currentQuestion.id] && touched[currentQuestion.id] && (
                <div className="error">{errors[currentQuestion.id]}</div>
              )}
              <div className="navigation-buttons">
                <button type="button" onClick={handlePrev} disabled={currentSection === 0 && currentQuestionIndex === 0}>Prev</button>
                <button type="submit" disabled={!values[currentQuestion.id]}>Next</button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Questionnaire;
