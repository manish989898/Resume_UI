import { useState } from "react";

// Redux
import { useDispatch } from "react-redux";
import { signupUser } from "../../reduxToolkit/slices/authSlice";

// Schemas
import { SignupSchema } from "../../assets/utils/validationSchemas/signUpSchema";

// Packages and Libraries
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import Swal from "sweetalert2";

// Images
import loginImage from "../../assets/images/loginImage.png";

// Logos
import bimDigitalLogo from "../../assets/logos/BimDigitalLogo.png";

export default function Signup({ handleLogin }) {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const [signupError, setSignupError] = useState(null);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false
    },
    validationSchema: SignupSchema,
    onSubmit: async (values) => {
      try {
        setSignupError(null);
        const resultAction = await dispatch(signupUser({
          firstname: values.firstName,
          lastname: values.lastName,
          email: values.email,
          password_hash: values.password
        }));
        
        if (signupUser.fulfilled.match(resultAction)) {
          // Change from sessionStorage to localStorage
          localStorage.setItem('authToken', resultAction.payload.token);
          
          // Update login state and redirect to dashboard
          handleLogin(); 
          navigate("/dashboard");
          
          Swal.fire({
            title: "Success!",
            text: "Account created and logged in successfully!",
            icon: "success"
          });
        } else {
          setSignupError(resultAction.payload || 'Signup failed');
        }
      } catch {
        setSignupError('An unexpected error occurred');
      }
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex w-full max-w-6xl overflow-hidden bg-white">
        {/* Left Image Section */}
        <div className="w-1/2 hidden md:block">
          <img
            src={loginImage}
            alt="AI Invoice Automation"
            className="object-cover h-full w-full"
          />
        </div>

        {/* Right Form Section */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center mx-10">
          <div className="mb-6 text-center">
            <div className="flex items-center justify-center space-x-2">
              <img src={bimDigitalLogo} alt="BIM Digital Logo" className="h-8 w-auto object-contain" />
              <h1 className="text-2xl font-semibold text-gray-800">
                BIM Digital
              </h1>
            </div>
            <h2 className="mt-4 text-xl font-semibold">
              Welcome to BIM Digital
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Automate your invoice operations with ease. <br /> Sign up to continue.
            </p>
          </div>

          {signupError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {signupError}
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {/* Name fields in a single row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  className={`mt-1 w-full px-4 py-2 border ${
                    formik.errors.firstName && formik.touched.firstName ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring focus:border-blue-500`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.firstName}
                />
                {formik.errors.firstName && formik.touched.firstName && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.firstName}</p>
                )}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  className={`mt-1 w-full px-4 py-2 border ${
                    formik.errors.lastName && formik.touched.lastName ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring focus:border-blue-500`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.lastName}
                />
                {formik.errors.lastName && formik.touched.lastName && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                className={`mt-1 w-full px-4 py-2 border ${
                  formik.errors.email && formik.touched.email ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring focus:border-blue-500`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.errors.email && formik.touched.email && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Create password"
                className={`mt-1 w-full px-4 py-2 border ${
                  formik.errors.password && formik.touched.password ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring focus:border-blue-500`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              {formik.errors.password && formik.touched.password && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm password"
                className={`mt-1 w-full px-4 py-2 border ${
                  formik.errors.confirmPassword && formik.touched.confirmPassword ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring focus:border-blue-500`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
              />
              {formik.errors.confirmPassword && formik.touched.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.confirmPassword}</p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2">
                <input
                  id="termsAccepted"
                  name="termsAccepted"
                  type="checkbox"
                  className="form-checkbox"
                  onChange={formik.handleChange}
                  checked={formik.values.termsAccepted}
                />
                <span>I agree to the Terms and Conditions</span>
              </label>
            </div>
            {formik.errors.termsAccepted && formik.touched.termsAccepted && (
              <p className="text-sm text-red-600">{formik.errors.termsAccepted}</p>
            )}

            <button
              type="submit"
              className="w-full py-2 bg-[#1B61AD] text-white font-semibold rounded-md hover:bg-white border border-[#1B61AD] hover:text-[#1B61AD] transition"
            >
              Create Account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <button 
              className="text-[#744ccc] font-semibold hover:underline focus:outline-none"
              onClick={() => navigate("/login")}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}