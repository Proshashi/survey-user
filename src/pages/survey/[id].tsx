import React from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useForm, FormProvider } from "react-hook-form";
import { Card, Typography, Button, message, Space, ConfigProvider } from "antd";
import styled, { keyframes } from "styled-components";
import Layout from "@/components/Layout";
import CustomInput from "@/components/CustomInput";
import CustomRadioButton from "@/components/CustomRadioButton";
import CustomCheckbox from "@/components/CustomCheckbox";
import apiClient from "@/lib/axios";
import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";

const { Title, Paragraph } = Typography;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const HeaderWrapper = styled(Card)`
  margin-bottom: 24px;
`;

const QuestionCard = styled(Card)`
  animation: ${fadeIn} 0.5s ease;
  margin-bottom: 24px;
  border-radius: 12px;

  .ant-card-head {
    border-bottom: none;
    padding-bottom: 0;
  }

  .ant-card-body {
    padding-top: 16px;
  }
`;

const FooterWrapper = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
`;

const SurveyPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;



  const { data: surveyData, isLoading }: UseQueryResult<any> = useQuery({
    queryKey: ["survey", id],
    queryFn: async () => {
      if (!id || !session) return null;
      const response = await apiClient.get(`/survey/${id}`);
      return response.data;
    },
    enabled: !!id && !!session,
  });

  const submitMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiClient.post(
        `/survey-result/${id}`,
        {
          anonymous: false,
          answers: Object.entries(data).map(([questionId, answer]) => ({
            questionId,
            answer,
            questionType: surveyData.questions.find(
              (q: any) => q._id === questionId,
            ).type,
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        },
      );
    },
    onSuccess: () => {
      message.success("Survey submitted successfully!");
      router.push("/survey/success");
    },
    onError: (error: Error) => {
      console.error("Submit error:", error);
      message.error("Failed to submit survey");
    },
  });

  const handleSubmit = async (data: any) => {
    submitMutation.mutate(data);
  };

  const methods = useForm({
    mode: "onChange",
  });

  const renderQuestion = (question: any) => {
    console.log("question", question);
    switch (question?.type) {
      case "text":
        return (
          <CustomInput
            name={question._id}
            label={question.question}
            helperText={question.helpText}
            required={question.required}
          />
        );
      case "single-choice":
        return (
          <CustomRadioButton
            name={question._id}
            label={question.question}
            helperText={question.helpText}
            isGroup
            options={question.options.map((opt: any) => ({
              label: opt.option,
              value: opt._id,
            }))}
            required={question.required}
          />
        );
      case "multiple-choice":
        return (
          <CustomCheckbox
            name={question._id}
            label={question.question}
            helperText={question.helpText}
            isGroup
            options={question.options.map((opt: any) => ({
              label: opt.option,
              value: opt._id,
            }))}
            required={question.required}
          />
        );
      default:
        return null;
    }
  };

  if (!isLoading && !surveyData) {
    return null;
  }

  return (
    <Layout loading={status === "loading" || isLoading}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          <HeaderWrapper>
            <Title level={3}>{surveyData?.title}</Title>
            <Paragraph>{surveyData?.description}</Paragraph>
          </HeaderWrapper>

          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            {surveyData?.questions.map((question: any, index: number) => (
              <QuestionCard key={question._id} title={`Question ${index + 1}`}>
                {renderQuestion(question)}
              </QuestionCard>
            ))}
          </Space>

          <FooterWrapper>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitMutation.isPending}
            >
              Submit Survey
            </Button>
          </FooterWrapper>
        </form>
      </FormProvider>
    </Layout>
  );
};

export default SurveyPage;
