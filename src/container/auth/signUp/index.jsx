import React, { useState } from 'react';
import { Form, Input, Button, Card, Checkbox, message } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { signupApi } from "../../../services/auth"; // Ensure path is correct
import { openNotification } from "../../../network/notification";
import { useDispatch } from "react-redux";
import { Authenticate, SelfUser } from "../../../redux/features/authSlice";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const handleSignup = async (values) => {
    setLoading(true);
    try {
      const payload = {
        name: values.fullName,
        email: values.email,
        password: values.password,
        userType: "customer",
      };

      const res = await signupApi(payload);
      const userData = res.data

      if (userData.token) {
      localStorage.setItem("token", userData.token);
      localStorage.setItem("userType", userData.userType);
      localStorage.setItem("fullName", userData.name);

      dispatch(Authenticate({ token: userData.token })); 
      dispatch(SelfUser(userData));

      openNotification("success", "Account created successfully!", + userData.name);
      navigate("/admin/hotels",  { replace: true }); 
      }
      
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Signup failed. Please try again.";
      openNotification("error", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex justify-center p-4 items-center min-h-screen bg-gray-50'>
      <Card className="w-full max-w-3xl shadow-xl border-none p-4 md:p-10 rounded-3xl">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Create an account</h2>
          <p className="text-gray-400 mt-2">Sign up and manage your booking easily</p>
        </div>
        
        <Form 
          layout="vertical" 
          onFinish={handleSignup}
          autoComplete="off"
        >
          {/* Full Name Field */}
          <Form.Item 
            name="fullName"
            rules={[{ required: true, message: 'Please enter your full name' }]}
          >
            <Input size="large" placeholder="Full Name" className="rounded-xl h-12" />
          </Form.Item>

          {/* Email Field */}
          <Form.Item 
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input size="large" placeholder="Email" className="rounded-xl h-12" />
          </Form.Item>

          {/* Password Field */}
          <Form.Item 
            name="password"
            rules={[
              { required: true, message: 'Please enter your password' },
              { min: 6, message: 'Password must be at least 6 characters' }
            ]}
          >
            <Input.Password size="large" placeholder="Password" className="rounded-xl h-12" />
          </Form.Item>

          {/* Terms Checkbox */}
          <Form.Item 
            name="agreement" 
            valuePropName="checked"
            rules={[{ 
              validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('Should accept agreement')) 
            }]}
          >
            <Checkbox className='mt-1 text-xs'>
              I have read and agree to the <span className='text-blue cursor-pointer'>Terms </span>and<span className='text-blue cursor-pointer'> Conditions</span>
            </Checkbox>
          </Form.Item>

          {/* Submit Button */}
          <Button 
            type="primary" 
            htmlType="submit" 
            block 
            loading={loading}
            className="bg-blue h-14 rounded-xl text-lg font-bold mt-4 shadow-blue-200 shadow-lg border-none hover:bg-blue-600"
          >
            {loading ? "Creating Account..." : "Sign up"}
          </Button>

          <div className='text-center mt-6'>
            <p className="text-gray-500">Already have an account yet?</p>
            <Link to="/auth/login" className="text-blue font-semibold underline">Login Now</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Signup;