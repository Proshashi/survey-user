import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import apiClient from "@/lib/axios";
import { Button, Divider, Form, Typography } from "antd";
import { TextQuestion } from "@/components/questions/TextQuestion";
import { Formik } from "formik";
import SingleChoiceQuestion from "@/components/questions/SingleChoiceQuestion";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

import * as yup from "yup";

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
      schema[q._id] = yup.string();
    } else if (q.type === QuestionTypeToUse.MULTIPLE_CHOICE) {
      schema[q._id] = yup.array().of(yup.string());
    } else if (q.type === QuestionTypeToUse.SINGLE_CHOICE) {
      schema[q._id] = yup.string();
    }
  });
  return yup.object().shape(schema);
}

const SurveyPage = (props: Props) => {
  const router = useRouter();
  const id = router.query?.id;

  const [surveyData, setSurveyData] = useState<any>(null);
  const [apiError, setApiError] = useState<string>("");

  useEffect(() => {
    if (id) {
      apiClient
        .get(`/survey/${id}`)
        .then((res) => {
          // console.log("res", res);
          const data = res.data?.data;
          setSurveyData(data);
        })
        .catch((err) => {
          setApiError("Oops! Looks like you are in the wrong place.");
        });
    }
  }, [id]);

  if (apiError) {
    return <div>{apiError}</div>;
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
            onSubmit={(...r) => {
              console.log("Submit", r);
            }}
            validationSchema={generateYupSchema(surveyData?.questions)}
            enableReinitialize
          >
            {({ handleSubmit }) => {
              return (
                <Form layout="vertical">
                  {surveyData?.questions?.map((q: any, index: number) => {
                    return (
                      <div key={q.id}>
                        <div>
                          {q.type === QuestionTypeToUse.TEXT && (
                            <TextQuestion name={q._id} label={q.question} />
                          )}
                          {q.type === QuestionTypeToUse.SINGLE_CHOICE && (
                            <SingleChoiceQuestion
                              name={q._id}
                              label={q.question}
                              options={q.options}
                            />
                          )}
                          {q.type === QuestionTypeToUse.MULTIPLE_CHOICE && (
                            <MultipleChoiceQuestion
                              name={q._id}
                              label={q.question}
                              options={q.options}
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
