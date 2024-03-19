"use client";
import NotFound from "@/components/NotFound";
import { Question, QuestionResponse, Survey } from "@/types";
import {
  Box,
  Button,
  Center,
  Checkbox,
  Divider,
  Input,
  LoadingOverlay,
  NumberInput,
  Radio,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
  Transition,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IMaskInput } from "react-imask";
import { ZodRawShape, z } from "zod";

export default function SurveyView({ params }: { params: { id: string } }) {
  const [survey, setSurvey] = useState({
    questions: [] as Question[],
  } as Survey);
  const [loaded, setLoaded] = useState(false);
  const [success, setSuccess] = useState(false);
  const [found, setFound] = useState(true);
  const [validationRules, setValidationRules] = useState(z.object({}));

  const form = useForm({
    validateInputOnBlur: true,
    validate: zodResolver(validationRules),
  });

  useEffect(() => {
    const initialValues: Record<string, string> = {};

    survey.questions.forEach((question) => {
      initialValues[question.id] = "";
    });

    form.setInitialValues(initialValues);

    const validationRuleHandler: ZodRawShape = {};

    survey.questions.forEach((question) => {
      let resolver: any = undefined;

      switch (question.type) {
        case "text":
        case "textarea":
          if (question.required)
            resolver = z
              .string()
              .min(1, { message: "This field is required." });
          else
            resolver = z
              .string()
              .min(1, { message: "This field is required." })
              .optional()
              .or(z.string().length(0));
          break;
        case "email":
          if (question.required)
            resolver = z
              .string()
              .min(1, { message: "This field is required." })
              .email("Please enter a valid email address.");
          else
            resolver = z
              .string()
              .email("Please enter a valid email address.")
              .optional()
              .or(z.string().length(0));
          break;
        case "phone":
          if (question.required)
            resolver = z
              .string()
              .regex(
                /^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/,
                "Please enter a valid phone number",
              );
          else
            resolver = z
              .string()
              .regex(
                /^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/,
                "Please enter a valid phone number",
              )
              .optional()
              .or(z.string().length(0));
          break;
        case "number":
          if (question.required) resolver = z.number();
          else resolver = z.number().optional().or(z.coerce.string().length(0));
          break;
        case "multiselect":
          if (question.required)
            resolver = z
              .array(z.string())
              .min(1, "Please select at least one response.");
          else
            resolver = z
              .array(z.string())
              .min(1, "Please select at least one response.")
              .optional()
              .or(z.array(z.string()).length(0));
          break;
        case "radio":
          if (question.required) resolver = z.string().min(1);
          else resolver = z.string().min(1).optional().or(z.string().length(0));
          break;
        default:
          resolver = z.string();
          break;
      }

      validationRuleHandler[question.id] = resolver;
    });

    setValidationRules(z.object(validationRuleHandler));
  }, [loaded]);

  useEffect(() => {
    fetch(`/api/survey/${params.id}`, { method: "GET" }).then((res) => {
      if (res.status === 404) {
        setLoaded(true);
        return setFound(false);
      }

      res.json().then((survey) => {
        setSurvey(JSON.parse(survey));
        setLoaded(true);
      });
    });
  }, []);

  const submitForm = () => {
    const questionResponses: QuestionResponse[] = [];

    survey.questions.forEach((question) => {
      const responses = form.values[question.id];

      questionResponses.push({
        questionId: question.id,
        values: Array.isArray(responses)
          ? responses
          : [responses ? responses.toString() : ""],
      });
    });

    fetch("/api/response", {
      method: "POST",
      body: JSON.stringify({
        surveyId: params.id,
        questionResponses,
      }),
    }).then((res) => {
      if (res.status === 200) setSuccess(true);
    });
  };

  return (
    <>
      {loaded && found && !success && (
        <>
          {Date.now() >
            new Date(
              survey.acceptResponsesUntil! as unknown as string,
            ).valueOf() && (
            <Center style={{ width: "100%", height: "100vh" }}>
              <Stack>
                <Center>
                  <Title order={1}>Oops, sorry.</Title>
                </Center>
                <Center>
                  <Text size="xl">
                    This survey is no longer accepting responses.
                  </Text>
                </Center>
                <Divider />
                <Center>
                  <Title order={3}>If it makes you feel any better...</Title>
                </Center>
                <Center>
                  <Text size="xl">
                    ...you could create your <i>own</i> survey!
                  </Text>
                </Center>
                <Center>
                  <Link href={"/create"}>
                    <Button size="md">Create survey</Button>
                  </Link>
                </Center>
              </Stack>
            </Center>
          )}
          {Date.now() <
            new Date(
              survey.acceptResponsesUntil! as unknown as string,
            ).valueOf() && (
            <Transition
              mounted={loaded}
              transition="pop"
              duration={750}
              timingFunction="ease"
            >
              {(styles) => (
                <form
                  style={styles}
                  onSubmit={form.onSubmit(submitForm)}
                  noValidate
                >
                  <Center>
                    <Title order={1}>{survey.title}</Title>
                  </Center>
                  <Center>
                    <Stack>
                      {survey.questions.map((question: Question, index) => (
                        <Box key={question.id}>
                          {question.type === "text" && (
                            <TextInput
                              label={`${index + 1}. ${question.title}`}
                              placeholder={question.title}
                              required={question.required}
                              {...form.getInputProps(question.id)}
                            />
                          )}
                          {question.type === "number" && (
                            <NumberInput
                              min={0}
                              max={999999999}
                              label={`${index + 1}. ${question.title}`}
                              placeholder={question.title}
                              required={question.required}
                              {...form.getInputProps(question.id)}
                            />
                          )}
                          {question.type === "phone" && (
                            <>
                              <Input.Label
                                required={question.required}
                              >{`${index + 1}. ${question.title}`}</Input.Label>
                              <Input
                                component={IMaskInput}
                                mask="(000) 000-0000"
                                placeholder={question.title}
                                {...form.getInputProps(question.id)}
                              />
                              {form.getInputProps(question.id).error && (
                                <>
                                  <Input.Error>
                                    {form.getInputProps(question.id).error}
                                  </Input.Error>
                                </>
                              )}
                            </>
                          )}
                          {question.type === "email" && (
                            <>
                              <TextInput
                                label={`${index + 1}. ${question.title}`}
                                placeholder={question.title}
                                required={question.required}
                                {...form.getInputProps(question.id)}
                              />
                            </>
                          )}
                          {question.type === "textarea" && (
                            <Textarea
                              label={`${index + 1}. ${question.title}`}
                              placeholder={question.title}
                              required={question.required}
                              {...form.getInputProps(question.id)}
                            />
                          )}
                          {question.type == "radio" && (
                            <Radio.Group
                              label={`${index + 1}. ${question.title}`}
                              required={question.required}
                              {...form.getInputProps(question.id)}
                            >
                              <Stack>
                                {question.responses?.map(
                                  (response, responseIndex) => (
                                    <Radio
                                      key={`${question.id}-${index}-${responseIndex}`}
                                      value={response}
                                      label={response}
                                    />
                                  ),
                                )}
                              </Stack>
                            </Radio.Group>
                          )}
                          {question.type == "multiselect" && (
                            <Checkbox.Group
                              label={`${index + 1}. ${question.title}`}
                              required={question.required}
                              {...form.getInputProps(question.id)}
                            >
                              <Stack>
                                {question.responses?.map(
                                  (response, responseIndex) => (
                                    <Checkbox
                                      key={`${question.id}-${index}-${responseIndex}`}
                                      value={response}
                                      label={response}
                                    />
                                  ),
                                )}
                              </Stack>
                            </Checkbox.Group>
                          )}
                        </Box>
                      ))}
                      <Button type="submit">Submit</Button>
                    </Stack>
                  </Center>
                </form>
              )}
            </Transition>
          )}
        </>
      )}
      {success && (
        <Center style={{ width: "100%", height: "100vh" }}>
          <Stack>
            <Center>
              <Title order={1}>Awesome!</Title>
            </Center>
            <Center>
              <Text size="xl">Your response was submitted.</Text>
            </Center>
            <Divider />
            <Center>
              <Title order={3}>Hey...while you&apos;re here...</Title>
            </Center>
            <Center>
              <Text size="xl">
                ...why not create your <i>own</i> survey?
              </Text>
            </Center>
            <Center>
              <Link href={"/create"}>
                <Button size="md">Create survey</Button>
              </Link>
            </Center>
          </Stack>
        </Center>
      )}
      {!found && <NotFound />}
      {!loaded && (
        <LoadingOverlay
          visible
          zIndex={1000}
          overlayProps={{ radius: "md", blur: 2 }}
          loaderProps={{ color: "blue", type: "bars" }}
        />
      )}
    </>
  );
}
