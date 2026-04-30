/**
 * Quiz Questions
 * 
 * Questions adapted from the Open Extended Jungian Type Scales (OEJTS 1.2)
 * by Eric Jorgenson, available at openpsychometrics.org
 * Licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License
 * 
 * Original word-pair format converted into scenario-based questions
 * suitable for a web application interface.
 * 
 * Reference:
 * Jorgenson, E. (2015). Open Extended Jungian Type Scales 1.2.
 * Retrieved from https://openpsychometrics.org/tests/OJTS/development/OEJTS1.2.pdf
 */

export const quizQuestions = [

  // Question 0: Gender Preference (shown first)
  {
    id: 0,
    dimension: "gender",
    question: "Which fragrance category do you prefer?",
    options: [
      { value: "Male", label: "Men's Fragrances" },
      { value: "Female", label: "Women's Fragrances" },
      { value: "Unisex", label: "Unisex / No Preference" }
    ]
  },

  // ─── E vs I — Extraversion vs Introversion ───────────────────────────────
  // Adapted from OEJTS Q3, Q11, Q15, Q19, Q23

  {
    id: 1,
    dimension: "EI",
    question: "How do you feel after spending a long time alone?",
    options: [
      { value: "E", label: "I start to feel restless and want to be around people" },
      { value: "I", label: "I feel refreshed and recharged" }
    ]
  },
  {
    id: 2,
    dimension: "EI",
    question: "When working on a project, you prefer to...",
    options: [
      { value: "E", label: "Collaborate and work together with others" },
      { value: "I", label: "Work independently on your own" }
    ]
  },
  {
    id: 3,
    dimension: "EI",
    question: "After attending a big social gathering, you usually feel...",
    options: [
      { value: "E", label: "Energised and ready for more" },
      { value: "I", label: "Drained and ready to go home" }
    ]
  },
  {
    id: 4,
    dimension: "EI",
    question: "In a conversation, you tend to...",
    options: [
      { value: "E", label: "Do most of the talking" },
      { value: "I", label: "Do most of the listening" }
    ]
  },
  {
    id: 5,
    dimension: "EI",
    question: "On a free evening, you would rather...",
    options: [
      { value: "E", label: "Go out and socialise with people" },
      { value: "I", label: "Stay home and relax quietly" }
    ]
  },

  // ─── S vs N — Sensing vs Intuition ───────────────────────────────────────
  // Adapted from OEJTS Q20, Q24, Q12, Q8, Q32

  {
    id: 6,
    dimension: "SN",
    question: "When describing an experience to someone, you tend to...",
    options: [
      { value: "S", label: "Tell them exactly what happened with specific details" },
      { value: "N", label: "Tell them what it meant and how it made you feel" }
    ]
  },
  {
    id: 7,
    dimension: "SN",
    question: "When starting something new, you prefer...",
    options: [
      { value: "S", label: "To know the specific details and steps involved" },
      { value: "N", label: "To understand the big picture first" }
    ]
  },
  {
    id: 8,
    dimension: "SN",
    question: "You are more naturally focused on...",
    options: [
      { value: "S", label: "What is happening right now" },
      { value: "N", label: "What could happen in the future" }
    ]
  },
  {
    id: 9,
    dimension: "SN",
    question: "When answering questions, you prefer...",
    options: [
      { value: "S", label: "Clear structured options to choose from" },
      { value: "N", label: "Open-ended questions where you can explain your thinking" }
    ]
  },
  {
    id: 10,
    dimension: "SN",
    question: "When solving a problem, you are more interested in...",
    options: [
      { value: "S", label: "The facts - what, when, and how" },
      { value: "N", label: "The meaning - why it happened and what it implies" }
    ]
  },

  // ─── T vs F — Thinking vs Feeling ────────────────────────────────────────
  // Adapted from OEJTS Q22, Q26, Q14, Q10, Q18

  {
    id: 11,
    dimension: "TF",
    question: "When making an important decision, you rely more on...",
    options: [
      { value: "T", label: "Logic and objective analysis" },
      { value: "F", label: "Your values and what feels right" }
    ]
  },
  {
    id: 12,
    dimension: "TF",
    question: "You believe the most important thing in doing the right thing is...",
    options: [
      { value: "T", label: "Being fair and consistent" },
      { value: "F", label: "Being kind and considerate of others' feelings" }
    ]
  },
  {
    id: 13,
    dimension: "TF",
    question: "From the people around you, you value more...",
    options: [
      { value: "T", label: "Their respect and recognition" },
      { value: "F", label: "Their warmth and affection" }
    ]
  },
  {
    id: 14,
    dimension: "TF",
    question: "When someone criticises you, you tend to...",
    options: [
      { value: "T", label: "Take it objectively and move on" },
      { value: "F", label: "Feel it personally and reflect on it emotionally" }
    ]
  },
  {
    id: 15,
    dimension: "TF",
    question: "You would rather be known for your ability to...",
    options: [
      { value: "T", label: "Solve practical problems and fix things" },
      { value: "F", label: "Support people and help them through difficulties" }
    ]
  },

  // ─── J vs P — Judging vs Perceiving ──────────────────────────────────────
  // Adapted from OEJTS Q1, Q5, Q21, Q25, Q17

  {
    id: 16,
    dimension: "JP",
    question: "When you have tasks to do, you usually...",
    options: [
      { value: "J", label: "Write them down in a list and work through them" },
      { value: "P", label: "Keep them in your head and handle things as they come" }
    ]
  },
  {
    id: 17,
    dimension: "JP",
    question: "Your personal space is usually...",
    options: [
      { value: "J", label: "Organised and tidy" },
      { value: "P", label: "Relaxed - things end up wherever they land" }
    ]
  },
  {
    id: 18,
    dimension: "JP",
    question: "When you have a deadline, you tend to...",
    options: [
      { value: "J", label: "Start early and finish well ahead of time" },
      { value: "P", label: "Work best under pressure closer to the deadline" }
    ]
  },
  {
    id: 19,
    dimension: "JP",
    question: "When facing a new situation, you prefer to...",
    options: [
      { value: "J", label: "Prepare thoroughly in advance" },
      { value: "P", label: "Improvise and adapt as you go" }
    ]
  },
  {
    id: 20,
    dimension: "JP",
    question: "You prefer to...",
    options: [
      { value: "J", label: "Make decisions and stick with them" },
      { value: "P", label: "Keep your options open for as long as possible" }
    ]
  }

];

export default quizQuestions;