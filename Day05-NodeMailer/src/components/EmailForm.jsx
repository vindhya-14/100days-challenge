import { useState } from "react";
import axios from "axios";

const EmailForm = () => {
  const [form, setForm] = useState({ to: "", subject: "", url: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:3000/api/send-email", form);
    alert("Email sent!");
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="to">To:</label>
          <input
            type="email"
            id="to"
            name="to"
            placeholder="To"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="subject">Subject:</label>
          <input
            type="text"
            id="subject"
            name="subject"
            placeholder="Subject"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="url">URL:</label>
          <input
            type="url"
            id="url"
            name="url"
            placeholder="URL"
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Send Email</button>
      </form>
    </>
  );
};

export default EmailForm;
