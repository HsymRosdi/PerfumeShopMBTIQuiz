import sauvageImg from "../assets/perfumeImages/sauvage.jpg";
import tomImg from "../assets/perfumeImages/tomford.jpg";
import libreImg from "../assets/perfumeImages/libre.jpg";

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
    image: sauvageImg,
    description: "A sophisticated woody fragrance with a clean character."
  },
  {
    id: 3,
    name: "Acqua di Gio",
    brand: "Giorgio Armani",
    category: "Fresh",
    personalityTags: ["relaxed", "clean", "energetic"],
    occasion: ["daily", "summer"],
    gender: "Male",
    price: 85,
    image: sauvageImg,
    description: "A crisp aquatic scent for a fresh and energetic lifestyle."
  },
  {
    id: 4,
    name: "Versace Eros",
    brand: "Versace",
    category: "Sweet",
    personalityTags: ["bold", "playful", "charismatic"],
    occasion: ["night", "party"],
    gender: "Male",
    price: 88,
    image: sauvageImg,
    description: "A sweet and seductive fragrance for bold personalities."
  },

  // =========================
  // WOMEN (4)
  // =========================
  {
    id: 5,
    name: "YSL Libre",
    brand: "Yves Saint Laurent",
    category: "Floral",
    personalityTags: ["confident", "independent", "stylish"],
    occasion: ["daily", "formal"],
    gender: "Female",
    price: 92,
    image: libreImg,
    description: "A bold floral fragrance with a modern feminine touch."
  },
  {
    id: 6,
    name: "Chanel Coco Mademoiselle",
    brand: "Chanel",
    category: "Floral",
    personalityTags: ["elegant", "confident", "romantic"],
    occasion: ["daily", "formal"],
    gender: "Female",
    price: 98,
    image: sauvageImg,
    description: "A timeless floral fragrance with elegance and charm."
  },
  {
    id: 7,
    name: "Miss Dior",
    brand: "Dior",
    category: "Floral",
    personalityTags: ["romantic", "soft", "feminine"],
    occasion: ["daily", "date"],
    gender: "Female",
    price: 94,
    image: sauvageImg,
    description: "A delicate floral scent for soft and romantic personalities."
  },
  {
    id: 8,
    name: "Black Opium",
    brand: "Yves Saint Laurent",
    category: "Oriental",
    personalityTags: ["bold", "mysterious", "stylish"],
    occasion: ["night", "party"],
    gender: "Female",
    price: 96,
    image: sauvageImg,
    description: "A bold oriental fragrance with a dark and stylish edge."
  },

  // =========================
  // UNISEX (4)
  // =========================
  {
    id: 9,
    name: "CK One",
    brand: "Calvin Klein",
    category: "Fresh",
    personalityTags: ["simple", "clean", "easygoing"],
    occasion: ["daily", "summer"],
    gender: "Unisex",
    price: 55,
    image: tomImg,
    description: "A clean and refreshing unisex fragrance for easygoing personalities."
  },
  {
    id: 10,
    name: "Tom Ford Neroli Portofino",
    brand: "Tom Ford",
    category: "Citrus",
    personalityTags: ["luxurious", "bright", "confident"],
    occasion: ["summer", "daily"],
    gender: "Unisex",
    price: 145,
    image: sauvageImg,
    description: "A luxurious citrus scent with a fresh Mediterranean feel."
  },
  {
    id: 11,
    name: "Maison Margiela Lazy Sunday Morning",
    brand: "Maison Margiela",
    category: "Fresh",
    personalityTags: ["calm", "soft", "clean"],
    occasion: ["daily", "spring"],
    gender: "Unisex",
    price: 110,
    image: sauvageImg,
    description: "A soft and clean scent perfect for calm and relaxed personalities."
  },
  {
    id: 12,
    name: "Jo Malone Wood Sage & Sea Salt",
    brand: "Jo Malone",
    category: "Fresh",
    personalityTags: ["relaxed", "natural", "minimalist"],
    occasion: ["daily", "summer"],
    gender: "Unisex",
    price: 105,
    image: sauvageImg,
    description: "A fresh and airy scent inspired by nature and simplicity."
  }
];


export default perfumes;