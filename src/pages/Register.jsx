import Form from "./../components/Form";
import AuthLayoutStyles from "../layout/AuthLayout.module.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { registerUser, resetError } from "../features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

const Register = () => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [errorMessage, setErrorMessage] = useState({
    name: { message: "Name should be on atleast 3 characters long!" },
    email: { message: "Valid email is required!" },
    password: {
      message:
        "Password must be at least 8 characters and contain at least one letter and one number!",
    },
    confirmPassword: { message: "Passwords do not match!" },
  });

  // Function to check if a field is valid and update error state
  const validateField = (fieldName, value) => {
    let isValid = false;

    switch (fieldName) {
      case "name":
        isValid = value.trim().length > 2;
        break;
      case "email":
        isValid = /\S+@\S+\.\S+/.test(value);
        break;
      case "password":
        const isAlphanumeric = /^(?=.*[a-zA-Z])(?=.*\d).+$/.test(value);
        const isLengthValid = value.trim().length >= 8;

        if (!isLengthValid) {
          setErrorMessage((prev) => ({
            ...prev,
            password: { message: "Password must be at least 8 characters!" },
          }));
        } else if (!isAlphanumeric) {
          setErrorMessage((prev) => ({
            ...prev,
            password: {
              message: "Password must Alphanumeric(no special characters)!",
            },
          }));
        }
        isValid = isLengthValid && isAlphanumeric;
        break;
      case "confirmPassword":
        isValid = value === formData.password;
        break;
      default:
        break;
    }

    setFormError((prev) => ({
      ...prev,
      [fieldName]: !isValid,
    }));
    return isValid;
  };

  const formFields = [
    {
      name: "name",
      value: formData.name,
      onChange: (e) => {
        const value = e.target.value;
        setFormData({ ...formData, name: value });
        validateField("name", value);
      },
      type: "text",
      placeholder: "Name",
      require: true,
    },
    {
      name: "email",
      value: formData.email,
      onChange: (e) => {
        const value = e.target.value;
        setFormData({ ...formData, email: value });
        validateField("email", value);
      },
      type: "email",
      placeholder: "Email",
      require: true,
    },
    {
      name: "password",
      value: formData.password,
      onChange: (e) => {
        const value = e.target.value;
        setFormData({ ...formData, password: value });
        validateField("password", value);
      },
      type: "password",
      placeholder: "Password",
      require: true,
    },
    {
      name: "confirmPassword",
      value: formData.confirmPassword,
      onChange: (e) => {
        const value = e.target.value;
        setFormData({ ...formData, confirmPassword: value });
        validateField("confirmPassword", value);
      },
      type: "password",
      placeholder: "Confirm password",
      require: true,
    },
  ];

  const onSubmit = (e) => {
    e.preventDefault();
    let isError = false;

    // Validate all fields before submitting
    Object.keys(formData).forEach((key) => {
      const isValid = validateField(key, formData[key]);
      if (!isValid) {
        isError = true;
      }
    });
    if (isError) return;

    dispatch(registerUser(formData));
  };

  useEffect(() => {
    if (success) return alert(success);
  }, [error, loading, success]);

  return (
    <div className={AuthLayoutStyles.container}>
      <span className={AuthLayoutStyles.title}>Register</span>
      <Form
        formError={formError}
        formFields={formFields}
        onSubmit={onSubmit}
        errorMessage={errorMessage}
        buttonText="Register"
      />

      <div className={AuthLayoutStyles.link__text}>Have an account?</div>
      <Link
        to="/login"
        className={AuthLayoutStyles.btn}
        onClick={() => {
          dispatch(resetError());
        }}
      >
        Login
      </Link>
    </div>
  );
};
export default Register;
