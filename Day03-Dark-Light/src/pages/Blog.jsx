const Blog = () => {
  const headingStyle = {
    fontSize: "2.5rem",
    color: "#8E44AD",
    textAlign: "center",
    marginTop: "50px",
    fontFamily: "'Segoe UI', sans-serif"
  };

  const blogContainerStyle = {
    maxWidth: "800px",
    margin: "40px auto",
    padding: "0 20px",
    fontFamily: "'Segoe UI', sans-serif"
  };

  const postStyle = {
    marginBottom: "30px",
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "#f0f0f0",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
  };

  const titleStyle = {
    fontSize: "1.5rem",
    color: "#333",
    marginBottom: "10px"
  };

  const contentStyle = {
    fontSize: "1rem",
    color: "#555",
    lineHeight: "1.6"
  };

  return (
    <div>
      <h1 style={headingStyle}>Read Our Latest Blog</h1>
      <div style={blogContainerStyle}>
        <div style={postStyle}>
          <h2 style={titleStyle}>🌟 Understanding React Context</h2>
          <p style={contentStyle}>
            Learn how to use the Context API to manage state globally in your React apps. 
            It's the perfect tool for managing themes, user auth, and more!
          </p>
        </div>

        <div style={postStyle}>
          <h2 style={titleStyle}>⚡ Quick Intro to React Router</h2>
          <p style={contentStyle}>
            Want seamless page navigation in React? Dive into React Router and learn how to build multi-page apps without refreshing the browser!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Blog;
