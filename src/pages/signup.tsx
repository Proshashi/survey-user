import React from "react";
import { useRouter } from "next/router";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, Typography, Button, message } from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import styled, { keyframes } from "styled-components";
import { useMutation } from "@tanstack/react-query";
import CustomInput from "@/components/CustomInput";
import apiClient from "@/lib/axios";
import { signIn } from "next-auth/react";

const { Title } = Typography;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const SignupWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1a365d 0%, #153e75 100%);
  padding: 20px;
`;

const StyledCard = styled(Card)`
  width: 100%;
  max-width: 420px;
  animation: ${fadeIn} 0.5s ease;
  /* background: rgba(255, 255, 255, 0.95); */
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
`;

const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

const SignupPage = () => {
  const router = useRouter();

  const methods = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  const signupMutation = useMutation({
    mutationFn: async (data: Omit<SignupFormData, "confirmPassword">) => {
      const response = await apiClient.post("/auth/user/signup", data);
      return response.data;
    },
    onSuccess: async (data) => {
      console.log("data", data);
      message.success("Signup successful!");
      const response = await signIn("credentials", {
        ...data,
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (response?.error) {
        message.error(response.error);
        return;
      }
      router.push("/");
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || "Signup failed");
    },
  });

  const onSubmit = (data: SignupFormData) => {
    const { confirmPassword, ...signupData } = data;
    signupMutation.mutate(signupData);
  };

  return (
    <SignupWrapper>
      <StyledCard>
        <Title level={2} style={{ textAlign: "center", marginBottom: "2rem" }}>
          Create Account
        </Title>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <CustomInput
              name="name"
              label="Name"
              icon={<UserOutlined />}
              required
            />

            <CustomInput
              name="email"
              label="Email"
              icon={<MailOutlined />}
              required
            />

            <CustomInput
              name="password"
              label="Password"
              type="password"
              icon={<LockOutlined />}
              required
            />

            <CustomInput
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              icon={<LockOutlined />}
              required
            />

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={signupMutation.isPending}
              style={{
                height: "48px",
                borderRadius: "8px",
                marginTop: "1rem",
              }}
            >
              Sign Up
            </Button>
          </form>
        </FormProvider>

        <Button
          type="link"
          onClick={() => router.push("/login")}
          style={{
            marginTop: "1rem",
            display: "block",
            textAlign: "center",
            width: "100%",
          }}
        >
          Already have an account? Sign In
        </Button>
      </StyledCard>
    </SignupWrapper>
  );
};

export default SignupPage;
