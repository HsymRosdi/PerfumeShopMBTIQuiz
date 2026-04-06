import sauvageImg from "../assets/perfumeImages/sauvage.jpg";

const perfumes = [
  {
    id: 1,
    name: "Dior Sauvage",
    brand: "Dior",
    category: "Fresh",
    personalityTags: ["confident", "bold", "sporty"],
    occasion: ["daily", "night"],
    gender: "Male",
    price: 89,
    image: sauvageImg,
    description: "A fresh and spicy fragrance for confident personalities."
  },
  {
    id: 2,
    name: "Bleu de Chanel",
    brand: "Chanel",
    category: "Woody",
    personalityTags: ["mature", "elegant", "calm"],
    occasion: ["formal", "night"],
    gender: "Male",
    price: 95,
    image: "https://example.com/bleu-de-chanel.jpg",
    description: "A sophisticated woody fragrance with a clean character."
  },
  {
    id: 3,
    name: "YSL Libre",
    brand: "Yves Saint Laurent",
    category: "Floral",
    personalityTags: ["confident", "independent", "stylish"],
    occasion: ["daily", "formal"],
    gender: "Female",
    price: 92,
    image: "https://example.com/ysl-libre.jpg",
    description: "A bold floral fragrance with a modern feminine touch."
  }
];

export default perfumes;