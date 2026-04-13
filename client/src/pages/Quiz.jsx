import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { quizQuestions } from "../data/quizQuestions";

const Quiz = ({ loggedIn, userName, onLogout }) => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(-1); // -1 = welcome screen
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const totalQuestions = quizQuestions.length;
  const progress = currentQuestion >= 0 ? ((currentQuestion + 1) / totalQuestions) * 100 : 0;

  // Get dimension label for progress display
  const getDimensionLabel = (dimension) => {
    const labels = {
      gender: "Preferences",
      EI: "Energy",
      SN: "Information",
      TF: "Decisions",
      JP: "Lifestyle"
    };
    return labels[dimension] || "";
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (selectedOption === null && currentQuestion >= 0) return;

    setIsTransitioning(true);

    setTimeout(() => {
      if (currentQuestion >= 0 && selectedOption !== null) {
        const question = quizQuestions[currentQuestion];
        setAnswers(prev => [...prev, {
          questionId: question.id,
          dimension: question.dimension,
          value: selectedOption.value
        }]);
      }

      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
      } else {
        // Quiz complete - navigate to results
        const finalAnswers = [...answers];
        if (selectedOption) {
          const question = quizQuestions[currentQuestion];
          finalAnswers.push({
            questionId: question.id,
            dimension: question.dimension,
            value: selectedOption.value
          });
        }
        navigate("/quiz/results", { state: { answers: finalAnswers } });
      }

      setIsTransitioning(false);
    }, 300);
  };

  const handleBack = () => {
    if (currentQuestion <= -1) return;

    setIsTransitioning(true);

    setTimeout(() => {
      if (currentQuestion > 0) {
        // Remove the last answer
        setAnswers(prev => prev.slice(0, -1));
      }
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(null);
      setIsTransitioning(false);
    }, 300);
  };

  const handleStart = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentQuestion(0);
      setIsTransitioning(false);
    }, 300);
  };

  // Welcome Screen
  if (currentQuestion === -1) {
    return (
      <>
        <Navbar loggedIn={loggedIn} userName={userName} onLogout={onLogout} />
        <main style={mainStyle}>
          <div style={{
            ...welcomeContainerStyle,
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning ? "translateY(20px)" : "translateY(0)"
          }}>
            <div style={welcomeIconStyle}>
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="1.5">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
            <h1 style={welcomeTitleStyle}>Discover Your Signature Scent</h1>
            <p style={welcomeSubtitleStyle}>
              Take our MBTI-inspired personality quiz to find the perfect perfume that matches who you are.
            </p>
            <div style={welcomeFeaturesStyle}>
              <div style={featureItemStyle}>
                <span style={featureIconStyle}>1</span>
                <span>Answer 21 quick questions</span>
              </div>
              <div style={featureItemStyle}>
                <span style={featureIconStyle}>2</span>
                <span>Discover your fragrance personality</span>
              </div>
              <div style={featureItemStyle}>
                <span style={featureIconStyle}>3</span>
                <span>Get personalized perfume matches</span>
              </div>
            </div>
            <button onClick={handleStart} style={startButtonStyle}>
              Start the Quiz
            </button>
            <p style={timeEstimateStyle}>Takes about 3-5 minutes</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const question = quizQuestions[currentQuestion];
  const isLastQuestion = currentQuestion === totalQuestions - 1;

  return (
    <>
      <Navbar loggedIn={loggedIn} userName={userName} onLogout={onLogout} />
      <main style={mainStyle}>
        {/* Progress Section */}
        <div style={progressSectionStyle}>
          <div style={progressInfoStyle}>
            <span style={progressTextStyle}>Question {currentQuestion + 1} of {totalQuestions}</span>
            <span style={dimensionTagStyle}>{getDimensionLabel(question.dimension)}</span>
          </div>
          <div style={progressBarContainerStyle}>
            <div style={{ ...progressBarStyle, width: `${progress}%` }} />
          </div>
        </div>

        {/* Question Card */}
        <div style={{
          ...questionContainerStyle,
          opacity: isTransitioning ? 0 : 1,
          transform: isTransitioning ? "translateX(30px)" : "translateX(0)"
        }}>
          <h2 style={questionTextStyle}>{question.question}</h2>

          <div style={optionsContainerStyle}>
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(option)}
                style={{
                  ...optionButtonStyle,
                  backgroundColor: selectedOption?.value === option.value ? "#111827" : "white",
                  color: selectedOption?.value === option.value ? "white" : "#111827",
                  borderColor: selectedOption?.value === option.value ? "#111827" : "#e5e7eb"
                }}
              >
                <span style={optionLetterStyle(selectedOption?.value === option.value)}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span style={optionLabelStyle}>{option.label}</span>
              </button>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div style={navigationStyle}>
            <button
              onClick={handleBack}
              style={backButtonStyle}
              disabled={currentQuestion === 0}
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={selectedOption === null}
              style={{
                ...nextButtonStyle,
                opacity: selectedOption === null ? 0.5 : 1,
                cursor: selectedOption === null ? "not-allowed" : "pointer"
              }}
            >
              {isLastQuestion ? "See Results" : "Next"}
            </button>
          </div>
        </div>

        {/* Question Type Indicator */}
        <div style={questionTypeIndicatorStyle}>
          {question.dimension === "gender" && "Choose your preferred fragrance category"}
          {question.dimension === "EI" && "This helps us understand how you interact with the world"}
          {question.dimension === "SN" && "This tells us how you process information"}
          {question.dimension === "TF" && "This reveals how you make decisions"}
          {question.dimension === "JP" && "This shows how you approach life"}
        </div>
      </main>
      <Footer />
    </>
  );
};

// Styles
const mainStyle = {
  minHeight: "calc(100vh - 200px)",
  backgroundColor: "#fafafa",
  padding: "40px 20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
};

const welcomeContainerStyle = {
  maxWidth: "600px",
  textAlign: "center",
  padding: "60px 40px",
  backgroundColor: "white",
  borderRadius: "24px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  transition: "opacity 0.3s ease, transform 0.3s ease"
};

const welcomeIconStyle = {
  marginBottom: "30px"
};

const welcomeTitleStyle = {
  fontSize: "2.5rem",
  fontWeight: "700",
  color: "#111827",
  marginBottom: "16px",
  lineHeight: "1.2"
};

const welcomeSubtitleStyle = {
  fontSize: "1.1rem",
  color: "#6b7280",
  marginBottom: "40px",
  lineHeight: "1.6"
};

const welcomeFeaturesStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  marginBottom: "40px"
};

const featureItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
  fontSize: "1rem",
  color: "#374151"
};

const featureIconStyle = {
  width: "32px",
  height: "32px",
  borderRadius: "50%",
  backgroundColor: "#f43f5e",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "600",
  fontSize: "0.9rem"
};

const startButtonStyle = {
  padding: "16px 48px",
  fontSize: "1.1rem",
  fontWeight: "600",
  backgroundColor: "#111827",
  color: "white",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  transition: "transform 0.2s ease, box-shadow 0.2s ease"
};

const timeEstimateStyle = {
  marginTop: "16px",
  fontSize: "0.9rem",
  color: "#9ca3af"
};

const progressSectionStyle = {
  width: "100%",
  maxWidth: "700px",
  marginBottom: "30px"
};

const progressInfoStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "12px"
};

const progressTextStyle = {
  fontSize: "0.95rem",
  color: "#6b7280",
  fontWeight: "500"
};

const dimensionTagStyle = {
  padding: "6px 14px",
  backgroundColor: "#f43f5e",
  color: "white",
  borderRadius: "20px",
  fontSize: "0.85rem",
  fontWeight: "600"
};

const progressBarContainerStyle = {
  width: "100%",
  height: "8px",
  backgroundColor: "#e5e7eb",
  borderRadius: "4px",
  overflow: "hidden"
};

const progressBarStyle = {
  height: "100%",
  backgroundColor: "#111827",
  borderRadius: "4px",
  transition: "width 0.4s ease"
};

const questionContainerStyle = {
  width: "100%",
  maxWidth: "700px",
  backgroundColor: "white",
  borderRadius: "24px",
  padding: "50px 40px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  transition: "opacity 0.3s ease, transform 0.3s ease"
};

const questionTextStyle = {
  fontSize: "1.6rem",
  fontWeight: "600",
  color: "#111827",
  marginBottom: "35px",
  lineHeight: "1.4",
  textAlign: "center"
};

const optionsContainerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  marginBottom: "40px"
};

const optionButtonStyle = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
  padding: "20px 24px",
  border: "2px solid #e5e7eb",
  borderRadius: "14px",
  cursor: "pointer",
  transition: "all 0.2s ease",
  textAlign: "left",
  fontSize: "1rem"
};

const optionLetterStyle = (isSelected) => ({
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  backgroundColor: isSelected ? "#f43f5e" : "#f3f4f6",
  color: isSelected ? "white" : "#374151",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "600",
  fontSize: "0.9rem",
  flexShrink: 0
});

const optionLabelStyle = {
  flex: 1,
  lineHeight: "1.5"
};

const navigationStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "16px"
};

const backButtonStyle = {
  padding: "14px 32px",
  fontSize: "1rem",
  fontWeight: "600",
  backgroundColor: "white",
  color: "#374151",
  border: "2px solid #e5e7eb",
  borderRadius: "12px",
  cursor: "pointer",
  transition: "all 0.2s ease"
};

const nextButtonStyle = {
  padding: "14px 40px",
  fontSize: "1rem",
  fontWeight: "600",
  backgroundColor: "#111827",
  color: "white",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  transition: "all 0.2s ease"
};

const questionTypeIndicatorStyle = {
  marginTop: "24px",
  fontSize: "0.9rem",
  color: "#9ca3af",
  textAlign: "center",
  maxWidth: "500px"
};

export default Quiz;
