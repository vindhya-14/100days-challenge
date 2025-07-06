import React from "react";
import { useFormik } from "formik";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.js";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: (values) => {
      const errors = {};
      if (!values.email) {
        errors.email = "Required";
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = "Invalid email address";
      }

      if (!values.password) {
        errors.password = "Required";
      } else if (values.password.length < 6) {
        errors.password = "Password should be at least 6 characters";
      }

      return errors;
    },
    onSubmit: async (values) => {
      try {
        await createUserWithEmailAndPassword(auth, values.email, values.password);
        navigate("/home");
      } catch (error) {
        alert(error.message);
      }
    },
  });

  return (
    <div style={{ margin: "50px auto", width: "300px" }}>
      <h2>Sign Up</h2>
      <form onSubmit={formik.handleSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
        />
        {formik.touched.email && formik.errors.email && (
          <div style={{ color: "red" }}>{formik.errors.email}</div>
        )}
        <br /><br />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
        />
        {formik.touched.password && formik.errors.password && (
          <div style={{ color: "red" }}>{formik.errors.password}</div>
        )}
        <br /><br />

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
