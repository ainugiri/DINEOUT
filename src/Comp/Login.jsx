import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";


export default function Login() {
      const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

const onSubmit = async (data) => {
  try {
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: data.username, // not email
        password: data.password
      })
    });

    const result = await res.json();
    if (res.ok) {
      alert(`Welcome, ${result.user.full_name}`);
      navigate("/dashboard"); // ✅ Redirect here after successful login
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Server error");
  }
};

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
        <h2 style={styles.heading}>Login</h2>

        {/* Email */}
        <input
          style={styles.input}
          type="text"
          placeholder="username"
          {...register("username", {
            required: "Username is required",
          })}
        />
        {errors.email && (
          <span style={styles.error}>{errors.email.message}</span>
        )}

        {/* Password */}
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 1,
              message: "Password must be at least 6 characters"
            }
          })}
        />
        {errors.password && (
          <span style={styles.error}>{errors.password.message}</span>
        )}

        <button style={styles.button} type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f4f4f4"
  },
  form: {
    background: "#fff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    width: "300px",
    display: "flex",
    flexDirection: "column"
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px"
  },
  input: {
    padding: "10px",
    margin: "8px 0",
    border: "1px solid #ccc",
    borderRadius: "5px"
  },
  button: {
    background: "#4CAF50",
    color: "#fff",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px"
  },
  error: {
    color: "red",
    fontSize: "0.8rem"
  }
};
