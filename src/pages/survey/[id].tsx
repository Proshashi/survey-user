import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import apiClient from "@/lib/axios";
import { Button, Divider, Form, Typography } from "antd";
import { TextQuestion } from "@/components/questions/TextQuestion";
import { Formik, FormikHelpers } from "formik";
import SingleChoiceQuestion from "@/components/questions/SingleChoiceQuestion";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

import * as yup from "yup";
import { AxiosError } from "axios";

const { Title, Text } = Typography;

type Props = {};

enum QuestionTypeToUse {
  TEXT = "text",
  MULTIPLE_CHOICE = "multiple-choice",
  SINGLE_CHOICE = "single-choice",
}

export interface ISurvey {
  title: string;
  description: string;
  questions: {
    question: string;
    type: string;
    order: number;
    _id: string;
    options?: {
      option: string;
      order: number;
    }[];
  }[];
}

function generateInitialQuestionValues(questions: ISurvey["questions"]) {
  const initialValues: any = {};
  questions.forEach((q) => {
    if (q.type === QuestionTypeToUse.TEXT) {
      initialValues[q._id] = "";
    } else if (q.type === QuestionTypeToUse.MULTIPLE_CHOICE) {
      initialValues[q._id] = [];
    } else if (q.type === QuestionTypeToUse.SINGLE_CHOICE) {
      initialValues[q._id] = "";
    }
  });
  return initialValues;
}

function generateYupSchema(questions: ISurvey["questions"]) {
  const schema: any = {};
  questions.forEach((q) => {
    if (q.type === QuestionTypeToUse.TEXT) {
      schema[q._id] = yup.string().required("Required");
    } else if (q.type === QuestionTypeToUse.MULTIPLE_CHOICE) {
      schema[q._id] = yup
        .array()
        .of(yup.string())
        .nonNullable()
        .min(1, "Required");
    } else if (q.type === QuestionTypeToUse.SINGLE_CHOICE) {
      schema[q._id] = yup.string().required("Required");
    }
  });
  return yup.object().shape(schema);
}

const SurveyPage = (props: Props) => {
  const router = useRouter();
  const id = router.query?.id;

  const [surveyData, setSurveyData] = useState<any>(null);
  const [apiError, setApiError] = useState<string | undefined>("");

  useEffect(() => {
    if (id) {
      apiClient
        .get(`/survey/${id}`)
        .then((res) => {
          const data = res.data?.data;
          setSurveyData(data);
        })
        .catch((err) => {
          setApiError(
            "Oops! The survey you are looking for was not found. Re-verify your URL.",
          );
        });
    }
  }, [id]);

  async function handleSubmit(data: any, actions: FormikHelpers<any>) {
    try {
      actions.setSubmitting(true);
      let dataToSubmit: any = {
        anonymous: true,
        answers: [],
      };

      Object.entries(data).forEach(([key, value]) => {
        const questionType = surveyData?.questions.find(
          (q: any) => q._id === key,
        ).type;
        dataToSubmit.answers.push({
          questionId: key,
          answer: value,
          questionType,
        });
      });

      await apiClient.post(`/survey-result/${id}`, dataToSubmit);
      setApiError(undefined);
      actions.resetForm();
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.data?.message) {
          setApiError(error.response.data.message);
        } else {
          setApiError("Something went wrong");
        }
      } else {
        console.log("error", error);
        setApiError("Something went wrong");
      }
    } finally {
      actions.setSubmitting(false);
    }
  }

  if (apiError) {
    return (
      <div
        style={{
          color: "red",
          fontSize: "2rem",
          fontWeight: "bold",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        {apiError}
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
      }}
    >
      {surveyData ? (
        <>
          <Title
            level={3}
            style={{
              textTransform: "uppercase",
              fontWeight: "800",
              letterSpacing: "1.5px",
            }}
          >
            {surveyData.title}
          </Title>
          <Text italic>{surveyData.description}</Text>
          <Divider />
          <Formik
            initialValues={generateInitialQuestionValues(surveyData?.questions)}
            onSubmit={handleSubmit}
            validationSchema={generateYupSchema(surveyData?.questions)}
            enableReinitialize
          >
            {({ handleSubmit, isSubmitting }) => {
              return (
                <Form layout="vertical">
                  {surveyData?.questions?.map((q: any, index: number) => {
                    return (
                      <div key={q.id}>
                        <div>
                          {q.type === QuestionTypeToUse.TEXT && (
                            <TextQuestion
                              name={q._id}
                              label={q.question}
                              required
                            />
                          )}
                          {q.type === QuestionTypeToUse.SINGLE_CHOICE && (
                            <SingleChoiceQuestion
                              name={q._id}
                              label={q.question}
                              options={q.options.map((opt: any) => ({
                                ...opt,
                                id: opt._id,
                              }))}
                              required
                            />
                          )}
                          {q.type === QuestionTypeToUse.MULTIPLE_CHOICE && (
                            <MultipleChoiceQuestion
                              name={q._id}
                              label={q.question}
                              options={q.options.map((opt: any) => ({
                                ...opt,
                                id: opt._id,
                              }))}
                              required
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <Button
                    type="primary"
                    htmlType="submit"
                    onClick={() => handleSubmit()}
                    disabled={isSubmitting}
                    loading={isSubmitting}
                  >
                    Submit
                  </Button>
                </Form>
              );
            }}
          </Formik>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default SurveyPage;
