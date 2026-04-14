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

  // E vs I - Extraversion vs Introversion (Questions 1-5)
  {
    id: 1,
    dimension: "EI",
    question: "At a party, you typically...",
    options: [
      { value: "E", label: "Talk to many people, including strangers" },
      { value: "I", label: "Prefer deeper conversations with a few people you know" }
    ]
  },
  {
    id: 2,
    dimension: "EI",
    question: "After a long week, you recharge by...",
    options: [
      { value: "E", label: "Going out with friends or attending social events" },
      { value: "I", label: "Spending quiet time alone or with one close person" }
    ]
  },
  {
    id: 3,
    dimension: "EI",
    question: "When working on a project, you prefer to...",
    options: [
      { value: "E", label: "Collaborate and brainstorm with others" },
      { value: "I", label: "Work independently and share results later" }
    ]
  },
  {
    id: 4,
    dimension: "EI",
    question: "In conversations, you tend to...",
    options: [
      { value: "E", label: "Think out loud and express ideas as they come" },
      { value: "I", label: "Reflect first, then share your thoughts carefully" }
    ]
  },
  {
    id: 5,
    dimension: "EI",
    question: "Your ideal weekend involves...",
    options: [
      { value: "E", label: "Meeting new people or attending events" },
      { value: "I", label: "Enjoying hobbies at home or in quiet settings" }
    ]
  },

  // S vs N - Sensing vs Intuition (Questions 6-10)
  {
    id: 6,
    dimension: "SN",
    question: "When learning something new, you prefer...",
    options: [
      { value: "S", label: "Step-by-step instructions with practical examples" },
      { value: "N", label: "Understanding the big picture and underlying concepts" }
    ]
  },
  {
    id: 7,
    dimension: "SN",
    question: "You are more drawn to...",
    options: [
      { value: "S", label: "Facts, details, and what's real and tangible" },
      { value: "N", label: "Ideas, possibilities, and what could be" }
    ]
  },
  {
    id: 8,
    dimension: "SN",
    question: "When describing an experience, you focus on...",
    options: [
      { value: "S", label: "Specific details and what actually happened" },
      { value: "N", label: "The overall meaning and how it made you feel" }
    ]
  },
  {
    id: 9,
    dimension: "SN",
    question: "You prefer to work with...",
    options: [
      { value: "S", label: "Established methods that have proven to work" },
      { value: "N", label: "New approaches and innovative ideas" }
    ]
  },
  {
    id: 10,
    dimension: "SN",
    question: "When planning a trip, you...",
    options: [
      { value: "S", label: "Research thoroughly and create detailed itineraries" },
      { value: "N", label: "Keep plans flexible and embrace spontaneity" }
    ]
  },

  // T vs F - Thinking vs Feeling (Questions 11-15)
  {
    id: 11,
    dimension: "TF",
    question: "When making decisions, you prioritize...",
    options: [
      { value: "T", label: "Logic, fairness, and objective analysis" },
      { value: "F", label: "Personal values and how others will be affected" }
    ]
  },
  {
    id: 12,
    dimension: "TF",
    question: "In a disagreement, you tend to...",
    options: [
      { value: "T", label: "Focus on finding the most logical solution" },
      { value: "F", label: "Consider everyone's feelings and seek harmony" }
    ]
  },
  {
    id: 13,
    dimension: "TF",
    question: "You would rather be seen as...",
    options: [
      { value: "T", label: "Competent and knowledgeable" },
      { value: "F", label: "Caring and understanding" }
    ]
  },
  {
    id: 14,
    dimension: "TF",
    question: "When a friend shares a problem, you first...",
    options: [
      { value: "T", label: "Offer practical advice and solutions" },
      { value: "F", label: "Listen empathetically and validate their feelings" }
    ]
  },
  {
    id: 15,
    dimension: "TF",
    question: "Criticism is best when it's...",
    options: [
      { value: "T", label: "Direct and honest, even if uncomfortable" },
      { value: "F", label: "Delivered gently with consideration for feelings" }
    ]
  },

  // J vs P - Judging vs Perceiving (Questions 16-20)
  {
    id: 16,
    dimension: "JP",
    question: "You prefer your days to be...",
    options: [
      { value: "J", label: "Planned and structured with clear goals" },
      { value: "P", label: "Flexible and open to whatever happens" }
    ]
  },
  {
    id: 17,
    dimension: "JP",
    question: "When working on tasks, you usually...",
    options: [
      { value: "J", label: "Complete them well before deadlines" },
      { value: "P", label: "Work best under pressure close to deadlines" }
    ]
  },
  {
    id: 18,
    dimension: "JP",
    question: "Your workspace is typically...",
    options: [
      { value: "J", label: "Organized with everything in its place" },
      { value: "P", label: "A bit messy but you know where things are" }
    ]
  },
  {
    id: 19,
    dimension: "JP",
    question: "When making plans with friends, you prefer...",
    options: [
      { value: "J", label: "Deciding activities and times in advance" },
      { value: "P", label: "Keeping things open and deciding in the moment" }
    ]
  },
  {
    id: 20,
    dimension: "JP",
    question: "You feel more comfortable when...",
    options: [
      { value: "J", label: "Decisions are made and things are settled" },
      { value: "P", label: "Options are kept open for as long as possible" }
    ]
  }
];

export default quizQuestions;
