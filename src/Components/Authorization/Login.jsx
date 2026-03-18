import React, {useState, useEffect} from "react";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../reduxToolkit/slices/authSlice";

// Packages and Libraries
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

// Schemas
import { LoginSchema } from "../../assets/utils/validationSchemas/loginSchema";

// Images
import loginImage from "../../assets/images/arsynclogin.png";
import bimDigitalLogo from "../../assets/logos/BimDigitalLogo.png";

export default function Login({handleLogin}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authError = useSelector((state) => state.auth?.error);

  const [loginError, setLoginError] = useState(null);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      setLoginError(null);
      try {
        const resultAction = await dispatch(loginUser({
          email: values.email,
          password_hash: values.password
        }));

        if (loginUser.fulfilled.match(resultAction)) {
          // Store token if rememberMe is checked
          if (values.rememberMe) {
            localStorage.setItem('authToken', resultAction.payload.token);
            localStorage.setItem('userEmail', values.email);
          } else {
            sessionStorage.setItem('authToken', resultAction.payload.token);
            sessionStorage.setItem('userEmail', values.email);
          }
          handleLogin();
        } else if (loginUser.rejected.match(resultAction)) {
          const message = resultAction.payload;
          setLoginError(
            typeof message === 'string' && message
              ? message
              : 'Invalid email or password. Please try again.'
          );
        } else {
          setLoginError('Invalid email or password. Please try again.');
        }
      } catch (err) {
        setLoginError(
          err?.message?.includes('Network')
            ? 'Unable to connect. Please check your internet and try again.'
            : 'Something went wrong. Please try again.'
        );
      }
    }
  });

  // Clear error when user edits email or password
  const handleChange = (e) => {
    if (loginError) setLoginError(null);
    formik.handleChange(e);
  };

  useEffect(() => {
    document.title = "Login | BIM Digital";
  }, []);

  // Show error from Redux when thunk rejects (ensures we display even if resultAction check misses)
  useEffect(() => {
    if (authError) {
      setLoginError(typeof authError === 'string' ? authError : 'Invalid email or password. Please try again.');
    }
  }, [authError]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-2">
      <div className="flex flex-col md:flex-row w-full max-w-3xl md:max-w-6xl bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Left Image Section */}
        <div className="md:w-1/2 w-full hidden md:flex items-center justify-center bg-gray-50">
          <img
            src={loginImage}
            alt="AI Invoice Automation"
            className="object-contain w-full h-auto max-h-[400px] px-4"
          />
        </div>

        {/* Right Form Section */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center mx-auto">
          <div className="mb-6 text-center">
            <div className="flex flex-col items-center justify-center space-y-2">
              <img
                src={bimDigitalLogo}
                alt="BIM Digital Logo"
                width={100}
                height={100}
                className="object-contain mb-2 md:mb-0"
              />
            </div>
            <h2 className="mt-1 text-2xl md:text-xl font-semibold text-gray-800">
              Welcome to BIM Digital
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Automate your invoice operations with ease. <br /> Sign in to continue.
            </p>
          </div>

          {loginError && (
            <div
              role="alert"
              className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm text-center flex items-center justify-center gap-2"
            >
              <span className="shrink-0 text-red-500" aria-hidden>⚠</span>
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-4 w-full max-w-md mx-auto">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                className={`mt-1 w-full px-4 py-2 border ${formik.errors.email && formik.touched.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring focus:border-blue-500`}
                onChange={handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.errors.email && formik.touched.email && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 text-left">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                className={`mt-1 w-full px-4 py-2 border ${formik.errors.password && formik.touched.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring focus:border-blue-500`}
                onChange={handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              {formik.errors.password && formik.touched.password && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.password}</p>
              )}
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between text-sm gap-2">
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  name="rememberMe"
                  className="form-checkbox" 
                  onChange={formik.handleChange}
                  checked={formik.values.rememberMe}
                />
                <span>Remember for 30 days</span>
              </label>
              <a href="#" className="text-[#1B61AD] hover:underline">
                Forgot password
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-[#1B61AD] text-white font-semibold rounded-md hover:bg-white border border-[#1B61AD] hover:text-[#1B61AD] transition"
            >
              Log In to Dashboard
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="#" className="text-[#744ccc] font-semibold hover:underline" onClick={() => navigate("/signup")}>
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}