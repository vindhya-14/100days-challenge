const Home = () => {
  const headingStyle = {
    fontSize: "2.5rem",
    color: "#4A90E2",
    textAlign: "center",
    marginTop: "50px",
    fontFamily: "'Segoe UI', sans-serif"
  };

  const paragraphStyle = {
    maxWidth: "600px",
    margin: "20px auto",
    textAlign: "center",
    color: "#333",
    fontSize: "1.1rem",
    lineHeight: "1.6"
  };

  const highlightStyle = {
    fontWeight: "bold",
    color: "#007BFF"
  };

  return (
    <div>
      <h1 style={headingStyle}>Welcome to the Home Page</h1>
      <p style={paragraphStyle}>
        This is a simple React application demonstrating how to use{" "}
        <span style={highlightStyle}>theme context</span> and{" "}
        <span style={highlightStyle}>React Router</span> for building modern web experiences. 
        Toggle the theme using the switch in the navbar to see how styles adapt!
      </p>
    </div>
  );
};

export default Home;
