import Form from "./../components/Form";
import AuthLayoutStyles from "../layout/AuthLayout.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, resetError } from "../features/user/userSlice";
import { toast } from "react-hot-toast";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, success, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formError, setFormError] = useState({
    email: false,
    password: false,
  });

  const [errorMessage, setErrorMessage] = useState({
    email: { message: "Valid email is required!" },
    password: {
      message:
        "Password must be at least 8 characters and contain at least one letter and one number!",
    },
  });
  // Function to check if a field is valid and update error state
  const validateField = (fieldName, value) => {
    let isValid = false;

    switch (fieldName) {
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
      name: "email",
      value: formData.email,
      onChange: (e) => {
        const value = e.target.value;
        setFormData({ ...formData, email: value });
        validateField("email", value);
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
        setFormData({ ...formData, password: value });
        validateField("password", value);
      },
      type: "password",
      placeholder: "Password",
      required: true,
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

    dispatch(loginUser(formData));
  };

  useEffect(() => {
    if (success) {
      toast.success("Authentication successfull!");
      navigate("/");
      setFormData({
        email: "",
        password: "",
      });
    }
  }, [loading, success, error]);
  return (
    <div className={AuthLayoutStyles.container}>
      <span className={AuthLayoutStyles.title}>Login</span>
      <Form
        formError={formError}
        formFields={formFields}
        onSubmit={onSubmit}
        errorMessage={errorMessage}
        buttonText={"Login"}
      />

      <div className={AuthLayoutStyles.link__text}>Have no account yet?</div>
      <Link
        to="/register"
        className={AuthLayoutStyles.btn}
        onClick={() => {
          dispatch(resetError());
        }}
      >
        Register
      </Link>
    </div>
  );
};
export default Login;
