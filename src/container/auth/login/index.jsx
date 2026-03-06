import React from "react";
import { Form, Input, Button, Card, Checkbox } from "antd";
import { loginApi } from "../../../services/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openNotification } from "../../../network/notification";
import { Authenticate, SelfUser } from "../../../redux/features/authSlice";

const Login = () => {
const navigate = useNavigate();
  const dispatch = useDispatch();

const handleLogin = async (values) => {
  try {
    const payload = { ...values, userType: "admin" };
    const res = await loginApi(payload);

    const userData = res.data.data; 
    console.log("User Data:", userData);
    if (!userData.token) {
      throw new Error("Login failed");
    } else {
      localStorage.setItem("token", userData.token);
      localStorage.setItem("userType", userData.userType);
      localStorage.setItem("fullName", userData.name || userData.fullName);

      dispatch(Authenticate({ token: userData.token })); 
      dispatch(SelfUser(userData)); 

      openNotification("success", "Welcome back, " + (userData.name || "Admin"));

      navigate("/admin/dashboard", { replace: true });
    }
  } catch (err) {
    const errorMsg = err.response?.data?.message || "Invalid email or password";
    openNotification("error", errorMsg);
  }
};
  return (
    <>
      <div className="flex items-center justify-center p-4 ">
        <Card className="w-full max-w-3xl shadow-xl border-none p-40 pt-4 pb-4 rounded-3xl">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-400 mt-2">
              Login to manage your booking and profile
            </p>
          </div>
          {/* <Form layout="vertical"> */}
          <Form layout="vertical" onFinish={handleLogin}>
            <Form.Item name="email">
              <Input
                size="large"
                placeholder="Email"
                className="rounded-xl h-12"
              />
            </Form.Item>
            <Form.Item name="password">
              <Input.Password
                size="large"
                placeholder="password"
                className="rounded-xl h-12"
              />
            </Form.Item>
            <Checkbox className="mt-1 text-xs">
              I have read and agree to the{" "}
              <span className="text-blue">Terms </span>and
              <span className="text-blue"> Conditions</span>
            </Checkbox>

            <Button
              // type="submit"
                htmlType="submit"

              block
              className="w-full bg-mainPrimary hover:!bg-mainPrimary text-white text-sm text-white h-14 rounded-xl text-lg font-bold mt-4  shadow-lg"
            >
              Login
            </Button>
            {/* <div className="mt-3 text-center">
              <a href="" className="text-center text-blue pt-2 underline">
                Forget Password ?
              </a>
            </div> */}

            {/* <div className="text-center mt-2">
              <p className="mb-0">Don’t have an account yet?</p>
              <a href="/auth/signup">Sign up Now</a>
            </div> */}
          </Form>
        </Card>
      </div>
    </>
  );
};

export default Login;
