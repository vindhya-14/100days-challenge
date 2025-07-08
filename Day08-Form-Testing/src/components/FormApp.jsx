import React, { useState } from 'react';

const FormApp = () => {
  const [form, setForm] = useState({ name: '', email: '', age: '', gender: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.name && form.email && form.age && form.gender) {
      setSubmitted(true);
    } else {
      alert("All fields are required!");
    }
  };

  return (
    <div>
      <h1>React Form</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          aria-label="name"
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          aria-label="email"
        />
        <input
          name="age"
          placeholder="Age"
          type="number"
          value={form.age}
          onChange={handleChange}
          aria-label="age"
        />
        <select name="gender" onChange={handleChange} aria-label="gender">
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <button type="submit">Submit</button>
      </form>

      {submitted && (
        <div data-testid="success-message">
          <p>Form submitted successfully!</p>
          <p>Name: {form.name}</p>
          <p>Email: {form.email}</p>
          <p>Age: {form.age}</p>
          <p>Gender: {form.gender}</p>
        </div>
      )}
    </div>
  );
};

export default FormApp;
