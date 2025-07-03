const About = () => {
  const headingStyle = {
    fontSize: "2.5rem",
    color: "#E26A6A",
    textAlign: "center",
    marginTop: "50px",
    fontFamily: "'Segoe UI', sans-serif"
  };

  const paragraphStyle = {
    maxWidth: "700px",
    margin: "20px auto",
    textAlign: "center",
    color: "#444",
    fontSize: "1.1rem",
    lineHeight: "1.6"
  };

  const highlightStyle = {
    fontWeight: "bold",
    color: "#D72638"
  };

  return (
    <div>
      <h1 style={headingStyle}>About This App</h1>
      <p style={paragraphStyle}>
        This project is built using <span style={highlightStyle}>React</span> and showcases how to implement 
        modern features like <span style={highlightStyle}>theme toggling</span> using context, 
        and <span style={highlightStyle}>routing</span> using React Router. The app is part of a 
        learning journey to sharpen front-end development skills.
      </p>
    </div>
  );
};

export default About;
