import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, resetError } from "../features/user/userSlice";
import AuthLayoutStyles from "../layout/AuthLayout.module.css";
import Form from "../components/Form";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, success, error } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const [errorMessages, setErrorMessages] = useState({
    name: { message: "Name must contain at least 3 characters." },
    email: { message: "Enter a valid email address." },
    password: {
      message: "Password must be 8+ characters with letters and numbers.",
    },
    confirmPassword: { message: "Passwords do not match." },
  });

  const validateInput = (field, value) => {
    let valid = false;

    switch (field) {
      case "name":
        valid = value.trim().length >= 3;
        break;
      case "email":
        valid = /\S+@\S+\.\S+/.test(value);
        break;
      case "password":
        const hasValidLength = value.trim().length >= 8;
        const hasAlphanumeric = /^(?=.*[a-zA-Z])(?=.*\d).+$/.test(value);

        if (!hasValidLength) {
          setErrorMessages((prev) => ({
            ...prev,
            password: {
              message: "Password must be at least 8 characters long.",
            },
          }));
        } else if (!hasAlphanumeric) {
          setErrorMessages((prev) => ({
            ...prev,
            password: { message: "Password must contain letters and numbers." },
          }));
        }
        valid = hasValidLength && hasAlphanumeric;
        break;
      case "confirmPassword":
        valid = value === formData.password;
        break;
      default:
        break;
    }

    setFieldErrors((prev) => ({
      ...prev,
      [field]: !valid,
    }));
    return valid;
  };

  const formFields = [
    {
      name: "name",
      value: formData.name,
      onChange: (e) => {
        const value = e.target.value;
        setFormData((prev) => ({ ...prev, name: value }));
        validateInput("name", value);
      },
      type: "text",
      placeholder: "Name",
      required: true,
    },
    {
      name: "email",
      value: formData.email,
      onChange: (e) => {
        const value = e.target.value;
        setFormData((prev) => ({ ...prev, email: value }));
        validateInput("email", value);
      },
      type: "email",
      placeholder: "Email",
      required: true,
    },
    {
      name: "password",
      value: formData.password,
      onChange: (e) => {
        const value = e.target.value;
        setFormData((prev) => ({ ...prev, password: value }));
        validateInput("password", value);
      },
      type: "password",
      placeholder: "Password",
      required: true,
    },
    {
      name: "confirmPassword",
      value: formData.confirmPassword,
      onChange: (e) => {
        const value = e.target.value;
        setFormData((prev) => ({ ...prev, confirmPassword: value }));
        validateInput("confirmPassword", value);
      },
      type: "password",
      placeholder: "Confirm Password",
      required: true,
    },
  ];

  const handleFormSubmit = (e) => {
    e.preventDefault();
    let hasError = false;

    Object.keys(formData).forEach((key) => {
      const valid = validateInput(key, formData[key]);
      if (!valid) hasError = true;
    });

    if (hasError) return;
    dispatch(registerUser(formData));
  };

  useEffect(() => {
    if (success) {
      navigate("/login");
      dispatch(resetError());
    }
  }, [success, navigate, dispatch]);

  return (
    <div className={AuthLayoutStyles.container}>
      <h2 className={AuthLayoutStyles.title}>Register</h2>
      <Form
        formError={fieldErrors}
        formFields={formFields}
        onSubmit={handleFormSubmit}
        errorMessage={errorMessages}
        buttonText="Register"
      />

      <div className={AuthLayoutStyles.link__text}>
        Already have an account?
      </div>
      <Link
        to="/login"
        className={AuthLayoutStyles.btn}
        onClick={() => dispatch(resetError())}
      >
        Login
      </Link>
    </div>
  );
};

export default Register;
