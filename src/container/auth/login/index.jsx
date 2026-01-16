import React from 'react';
import { Form, Input, Button, Card } from 'antd';
// import { useEffect, useState } from "react";
// import { LoginApi } from "../../../services/auth";

const Login = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#f4f7fe]">
    <Card className="w-full max-w-md shadow-xl border-none p-4 rounded-3xl">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
        <p className="text-gray-400 mt-2">Enter your credentials to access your account</p>
      </div>
      <Form layout="vertical">
        <Form.Item label={<span className="font-semibold">Email Address</span>} name="email">
          <Input size="large" placeholder="mail@website.com" className="rounded-xl h-12" />
        </Form.Item>
        <Form.Item label={<span className="font-semibold">Password</span>} name="password">
          <Input.Password size="large" placeholder="Min. 8 characters" className="rounded-xl h-12" />
        </Form.Item>
        <Button type="primary" block className="bg-blue-600 h-14 rounded-xl text-lg font-bold mt-4 shadow-blue-200 shadow-lg">
          Sign In
        </Button>
      </Form>
    </Card>
  </div>
);

export default Login;