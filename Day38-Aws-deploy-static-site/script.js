const quoteText = document.getElementById("quote");
const authorText = document.getElementById("author");

const quotes = [
  {
    quote: "The only limit to our realization of tomorrow is our doubts of today.",
    author: "Franklin D. Roosevelt"
  },
  {
    quote: "Do not wait to strike till the iron is hot, but make it hot by striking.",
    author: "William Butler Yeats"
  },
  {
    quote: "Whether you think you can or you think you can’t, you’re right.",
    author: "Henry Ford"
  },
  {
    quote: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt"
  },
  {
    quote: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius"
  }
];

function getQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quoteObj = quotes[randomIndex];
  quoteText.innerText = `"${quoteObj.quote}"`;
  authorText.innerText = `— ${quoteObj.author}`;
}
