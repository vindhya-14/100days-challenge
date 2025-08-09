
import { QuizQuestion } from './types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Who is your forever partner in crime and laughter?",
    answers: [
      { text: "Always them, my best friend for life.", emoji: "👫" },
      { text: "I hope I am for them!", emoji: "🤗" },
      { text: "We’re a perfect team, no matter what.", emoji: "🤝" },
      { text: "Siblings by chance, best friends by choice.", emoji: "❤️" },
    ],
  },
  {
    id: 2,
    question: "What’s your favorite childhood memory together?",
    answers: [
      { text: "Those endless summer adventures.", emoji: "🌞" },
      { text: "Laughing till we couldn’t breathe.", emoji: "😂" },
      { text: "Secret late-night talks.", emoji: "🌙" },
      { text: "Sharing a favorite snack in secret.", emoji: "🍫" },
    ],
  },
  {
    id: 3,
    question: "When life gets tough, who’s your biggest support?",
    answers: [
      { text: "Them, always with a comforting hug.", emoji: "🤗" },
      { text: "I try to be theirs as well.", emoji: "💪" },
      { text: "We lean on each other equally.", emoji: "💞" },
      { text: "Our bond is the rock that holds us.", emoji: "🪨" },
    ],
  },
  {
    id: 4,
    question: "What’s the sweetest thing they’ve ever done for you?",
    answers: [
      { text: "Surprised me when I least expected it.", emoji: "🎁" },
      { text: "Stood by me when no one else did.", emoji: "🛡️" },
      { text: "Shared their favorite things with me.", emoji: "🎈" },
      { text: "Made me smile on a gloomy day.", emoji: "🌈" },
    ],
  },
  {
    id: 5,
    question: "How do you show love without words?",
    answers: [
      { text: "A knowing smile or a wink.", emoji: "😉" },
      { text: "A surprise treat or gesture.", emoji: "🍰" },
      { text: "Spending quiet time together.", emoji: "🛋️" },
      { text: "A warm hug out of the blue.", emoji: "🤗" },
    ],
  },
  {
    id: 6,
    question: "Which phrase best describes your sibling bond?",
    answers: [
      { text: "Unbreakable and full of love.", emoji: "💖" },
      { text: "Growing stronger every day.", emoji: "🌱" },
      { text: "Our secret superpower.", emoji: "🦸" },
      { text: "A lifetime of memories together.", emoji: "📸" },
    ],
  },
  {
    id: 7,
    question: "What’s your favorite way to spend time together now?",
    answers: [
      { text: "Catching up over coffee or tea.", emoji: "☕" },
      { text: "Going on new adventures.", emoji: "🧳" },
      { text: "Watching old family videos.", emoji: "📼" },
      { text: "Just laughing about silly things.", emoji: "🤣" },
    ],
  },
  {
    id: 8,
    question: "How do you celebrate each other’s successes?",
    answers: [
      { text: "With loud cheers and hugs.", emoji: "🎉" },
      { text: "Quiet pride and knowing smiles.", emoji: "😊" },
      { text: "Planning surprise parties.", emoji: "🎂" },
      { text: "Sharing the spotlight always.", emoji: "🌟" },
    ],
  },
  {
    id: 9,
    question: "What’s the best advice they’ve ever given you?",
    answers: [
      { text: "Believe in yourself no matter what.", emoji: "💡" },
      { text: "Always stand up for what’s right.", emoji: "✊" },
      { text: "Cherish the little moments.", emoji: "🕰️" },
      { text: "Family is forever.", emoji: "🏡" },
    ],
  },
  {
    id: 10,
    question: "If you could make one promise to each other, what would it be?",
    answers: [
      { text: "To always be there, no matter what.", emoji: "🤝" },
      { text: "To keep creating memories together.", emoji: "📅" },
      { text: "To forgive and love unconditionally.", emoji: "❤️‍🩹" },
      { text: "To never let distance come between us.", emoji: "🌍" },
    ],
  },
];

export const RESULT_CONFIG = {
  0: {
    title: "The Sweet & Spicy Duo",
    description:
      "You balance each other out perfectly! One brings the sugar, the other brings the spice, creating a bond that's full of flavor and fun.",
    superpower: "Dynamic Duo",
    rakhiColor: "bg-red-500",
    memoryIdea:
      "Try to cook your favorite childhood meal together... without arguing over the recipe!",
  },
  1: {
    title: "The Partners-in-Crime",
    description:
      "You've been in it together since day one! From secret missions to epic pranks, your bond is forged in adventure and a whole lot of laughter.",
    superpower: "Mischief Maker",
    rakhiColor: "bg-amber-500",
    memoryIdea:
      "Plan a fun 'heist' to 'steal' your favorite ice cream from the freezer tonight.",
  },
  2: {
    title: "The Ultimate Besties",
    description:
      "You're more than siblings; you're the best of friends. You share secrets, dreams, and probably clothes. Your bond is unbreakable and truly special.",
    superpower: "Secret Keeper",
    rakhiColor: "bg-yellow-400",
    memoryIdea:
      "Create a 'Then vs. Now' photo collage, recreating a favorite baby picture.",
  },
  3: {
    title: "Soul Siblings Forever",
    description:
      "Your bond transcends time and distance — a rare and beautiful connection that feels like family and friendship wrapped into one. You are each other's safe haven and greatest treasure.",
    superpower: "Heart & Soul",
    rakhiColor: "bg-pink-600",
    memoryIdea:
      "Write letters to each other sharing your dreams and promises for the future. Seal them and open together years later.",
  },
};
