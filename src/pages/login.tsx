"use client";

import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { NextSeo } from "next-seo";
import { Form, Input, Button, Card, message, Progress } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import styled, { keyframes } from "styled-components";
import { useRouter } from "next/navigation";
import CustomInput from "@/components/CustomInput";

// Validation Schema
const loginSchema = z.object({
  email: z
    .string({
      required_error: "Please enter your email address",
    })
    .email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    ),
});

type LoginFormData = z.infer<typeof loginSchema>;

// Animations
const gradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Styled Components
const LoginWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: ${gradient} 15s ease infinite;
  padding: 20px;
`;

const StyledCard = styled(Card)`
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);
`;

const LoginPage = () => {
  const router = useRouter();
  const methods = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors, isSubmitting },
  } = methods;

  const password = watch("password", "");
  const passwordStrength = React.useMemo(() => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    return strength;
  }, [password]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await signIn("credentials", {
        redirect: true,
        callbackUrl: "/",
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        message.error("Invalid credentials");
      } else {
        message.success("Login successful");
        router.push("/dashboard");
      }
    } catch (error) {
      message.error("An error occurred");
    }
  };

  return (
    <>
      <NextSeo
        title="Login | Your App"
        description="Secure login to your account"
        noindex={true}
      />

      <FormProvider {...methods}>
        <LoginWrapper>
          <StyledCard>
            <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>
              Welcome Back
            </h1>
            <Form onFinish={handleSubmit(onSubmit)} layout="vertical">
              <Form.Item
                validateStatus={errors.email ? "error" : ""}
                help={errors.email?.message}
              >
                <CustomInput
                  size="large"
                  name="email"
                  placeholder="Email"
                  icon={<UserOutlined />}
                />
              </Form.Item>
              <Form.Item
                validateStatus={errors.password ? "error" : ""}
                help={errors.password?.message}
              >
                <CustomInput
                  name="password"
                  type="password"
                  icon={<LockOutlined />}
                  placeholder="Password"
                  size="large"
                />
                {/* <Progress
                    percent={passwordStrength}
                    status={passwordStrength === 100 ? "success" : "active"}
                    showInfo={false}
                    style={{ marginTop: "8px" }}
                  /> */}
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={isSubmitting}
                  style={{
                    height: "48px",
                    borderRadius: "8px",
                    background: "#1890ff",
                    marginTop: "1rem",
                  }}
                >
                  Sign In
                </Button>
              </Form.Item>
            </Form>
          </StyledCard>
        </LoginWrapper>
      </FormProvider>
    </>
  );
};

export default LoginPage;
