import sauvageImg from "../assets/perfumeImages/sauvage.jpg";
import tomImg from "../assets/perfumeImages/tomford.jpg";
import libreImg from "../assets/perfumeImages/libre.jpg";

const perfumes = [
  // =========================
  // MEN (4)
  // =========================
  {
    id: 1,
    name: "Dior Sauvage",
    brand: "Dior",
    category: "Fresh",
    notes: {
      top: ["bergamot", "pepper"],
      middle: ["lavender", "geranium", "elemi"],
      base: ["ambroxan", "cedar", "labdanum"]
    },
    personalityTags: ["confident", "bold", "sporty"],
    mbtiTypes: ["ENTJ", "ESTP", "ESTJ", "ENTP"],
    occasion: ["daily", "night"],
    season: ["fall", "winter", "spring"],
    intensity: 4,
    longevity: 8,
    gender: "Male",
    price: 89,
    priceTier: "mid",
    image: sauvageImg,
    description: "A fresh and spicy fragrance for confident personalities."
  },
  {
    id: 2,
    name: "Bleu de Chanel",
    brand: "Chanel",
    category: "Woody",
    notes: {
      top: ["citrus", "mint", "pink pepper"],
      middle: ["grapefruit", "ginger", "nutmeg"],
      base: ["cedar", "sandalwood", "incense"]
    },
    personalityTags: ["mature", "elegant", "calm"],
    mbtiTypes: ["INTJ", "ISTJ", "INFJ", "ENTJ"],
    occasion: ["formal", "night"],
    season: ["fall", "winter"],
    intensity: 3,
    longevity: 7,
    gender: "Male",
    price: 95,
    priceTier: "mid",
    image: sauvageImg,
    description: "A sophisticated woody fragrance with a clean character."
  },
  {
    id: 3,
    name: "Acqua di Gio",
    brand: "Giorgio Armani",
    category: "Fresh",
    notes: {
      top: ["bergamot", "neroli", "green tangerine"],
      middle: ["jasmine", "calone", "rosemary"],
      base: ["cedar", "musk", "amber"]
    },
    personalityTags: ["relaxed", "clean", "energetic"],
    mbtiTypes: ["ESTP", "ESFP", "ISTP", "ENFP"],
    occasion: ["daily", "summer"],
    season: ["summer", "spring"],
    intensity: 2,
    longevity: 6,
    gender: "Male",
    price: 85,
    priceTier: "mid",
    image: sauvageImg,
    description: "A crisp aquatic scent for a fresh and energetic lifestyle."
  },
  {
    id: 4,
    name: "Versace Eros",
    brand: "Versace",
    category: "Sweet",
    notes: {
      top: ["mint", "green apple", "lemon"],
      middle: ["tonka bean", "ambroxan", "geranium"],
      base: ["vanilla", "vetiver", "oakmoss", "cedar"]
    },
    personalityTags: ["bold", "playful", "charismatic"],
    mbtiTypes: ["ESFP", "ENFP", "ESTP", "ENTP"],
    occasion: ["night", "party"],
    season: ["fall", "winter"],
    intensity: 4,
    longevity: 8,
    gender: "Male",
    price: 88,
    priceTier: "mid",
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
    notes: {
      top: ["mandarin orange", "lavender", "blackcurrant"],
      middle: ["jasmine", "orange blossom", "orchid"],
      base: ["madagascar vanilla", "musk", "cedar"]
    },
    personalityTags: ["confident", "independent", "stylish"],
    mbtiTypes: ["ENTJ", "ENFJ", "ESTJ", "INTJ"],
    occasion: ["daily", "formal"],
    season: ["fall", "spring"],
    intensity: 3,
    longevity: 8,
    gender: "Female",
    price: 92,
    priceTier: "mid",
    image: libreImg,
    description: "A bold floral fragrance with a modern feminine touch."
  },
  {
    id: 6,
    name: "Chanel Coco Mademoiselle",
    brand: "Chanel",
    category: "Floral",
    notes: {
      top: ["orange", "bergamot", "grapefruit"],
      middle: ["rose", "jasmine", "ylang-ylang"],
      base: ["tonka bean", "patchouli", "vetiver", "vanilla"]
    },
    personalityTags: ["elegant", "confident", "romantic"],
    mbtiTypes: ["ENFJ", "ESFJ", "INFJ", "ISFJ"],
    occasion: ["daily", "formal"],
    season: ["spring", "fall"],
    intensity: 3,
    longevity: 7,
    gender: "Female",
    price: 98,
    priceTier: "mid",
    image: sauvageImg,
    description: "A timeless floral fragrance with elegance and charm."
  },
  {
    id: 7,
    name: "Miss Dior",
    brand: "Dior",
    category: "Floral",
    notes: {
      top: ["blood orange", "mandarin"],
      middle: ["rose", "peony", "lily of the valley"],
      base: ["musk", "rosewood", "patchouli"]
    },
    personalityTags: ["romantic", "soft", "feminine"],
    mbtiTypes: ["INFP", "ISFP", "INFJ", "ISFJ"],
    occasion: ["daily", "date"],
    season: ["spring", "summer"],
    intensity: 2,
    longevity: 6,
    gender: "Female",
    price: 94,
    priceTier: "mid",
    image: sauvageImg,
    description: "A delicate floral scent for soft and romantic personalities."
  },
  {
    id: 8,
    name: "Black Opium",
    brand: "Yves Saint Laurent",
    category: "Oriental",
    notes: {
      top: ["pink pepper", "orange blossom", "pear"],
      middle: ["coffee", "jasmine", "bitter almond"],
      base: ["vanilla", "patchouli", "cedar"]
    },
    personalityTags: ["bold", "mysterious", "stylish"],
    mbtiTypes: ["INTJ", "INFJ", "ENTJ", "ENFJ"],
    occasion: ["night", "party"],
    season: ["fall", "winter"],
    intensity: 4,
    longevity: 9,
    gender: "Female",
    price: 96,
    priceTier: "mid",
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
    notes: {
      top: ["bergamot", "cardamom", "pineapple", "lemon"],
      middle: ["jasmine", "violet", "rose", "nutmeg"],
      base: ["musk", "amber", "sandalwood", "cedar"]
    },
    personalityTags: ["simple", "clean", "easygoing"],
    mbtiTypes: ["ISFP", "ISTP", "INFP", "ISFJ"],
    occasion: ["daily", "summer"],
    season: ["summer", "spring"],
    intensity: 2,
    longevity: 4,
    gender: "Unisex",
    price: 55,
    priceTier: "budget",
    image: tomImg,
    description: "A clean and refreshing unisex fragrance for easygoing personalities."
  },
  {
    id: 10,
    name: "Tom Ford Neroli Portofino",
    brand: "Tom Ford",
    category: "Citrus",
    notes: {
      top: ["bergamot", "mandarin orange", "lemon", "lavender"],
      middle: ["neroli", "african orange flower", "jasmine"],
      base: ["amber", "musk", "angelica"]
    },
    personalityTags: ["luxurious", "bright", "confident"],
    mbtiTypes: ["ENTJ", "ENFJ", "ESTJ", "ESFJ"],
    occasion: ["summer", "daily"],
    season: ["summer", "spring"],
    intensity: 3,
    longevity: 6,
    gender: "Unisex",
    price: 145,
    priceTier: "premium",
    image: sauvageImg,
    description: "A luxurious citrus scent with a fresh Mediterranean feel."
  },
  {
    id: 11,
    name: "Maison Margiela Lazy Sunday Morning",
    brand: "Maison Margiela",
    category: "Fresh",
    notes: {
      top: ["pear", "aldehydes", "lily of the valley"],
      middle: ["iris", "rose", "orange blossom"],
      base: ["musk", "cedar", "iso e super"]
    },
    personalityTags: ["calm", "soft", "clean"],
    mbtiTypes: ["INFP", "ISFP", "INFJ", "ISFJ"],
    occasion: ["daily", "spring"],
    season: ["spring", "summer"],
    intensity: 2,
    longevity: 5,
    gender: "Unisex",
    price: 110,
    priceTier: "premium",
    image: sauvageImg,
    description: "A soft and clean scent perfect for calm and relaxed personalities."
  },
  {
    id: 12,
    name: "Jo Malone Wood Sage & Sea Salt",
    brand: "Jo Malone",
    category: "Fresh",
    notes: {
      top: ["ambrette seeds", "sea salt"],
      middle: ["sage", "sea salt"],
      base: ["driftwood", "musk", "grapefruit"]
    },
    personalityTags: ["relaxed", "natural", "minimalist"],
    mbtiTypes: ["ISTP", "ISFP", "INTP", "INFP"],
    occasion: ["daily", "summer"],
    season: ["summer", "spring"],
    intensity: 2,
    longevity: 4,
    gender: "Unisex",
    price: 105,
    priceTier: "premium",
    image: sauvageImg,
    description: "A fresh and airy scent inspired by nature and simplicity."
  }
];

export default perfumes;
