"use client";
import { Question } from "@/components/EditableQuestion";
import { Survey } from "@/services/survey.service";
import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Center,
  Checkbox,
  Container,
  CopyButton,
  Divider,
  Group,
  Input,
  Loader,
  LoadingOverlay,
  NumberInput,
  Radio,
  Stack,
  Table,
  Text,
  TextInput,
  Textarea,
  Title,
  Tooltip,
  Transition,
} from "@mantine/core";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import NotFound from "@/components/NotFound";
import { Response } from "@/services/response.service";
import Link from "next/link";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Report from "@/components/Report";

export interface QuestionResponse {
  questionId: string;
  values: string[];
}

export interface QuestionResponseDisplay {
  question: Question;
  totalResponses: number;
  totalResponsesAcrossSurveys: number;
  responses: any[];
}

export default function SurveyView({
  params,
  searchParams,
}: {
  params: { id: string; managerId: string };
  searchParams: { fromCreation: boolean };
}) {
  const [survey, setSurvey] = useState({
    questions: [] as Question[],
  } as Survey);
  const [responses, setResponses] = useState([] as Response[]);
  const [loaded, setLoaded] = useState(false);
  const [found, setFound] = useState(true);
  const [allAnswers, setAllAnswers] = useState([] as QuestionResponseDisplay[]);
  const reportTemplateRef = useRef(null);

  if (params.id.length > 6) {
    return <p>Survey not found.</p>;
  }

  useEffect(() => {
    fetch(`/api/survey/${params.id}/${params.managerId}`, {
      method: "GET",
    }).then((res) => {
      if (res.status === 404) {
        setLoaded(true);
        return setFound(false);
      }

      res.json().then((survey) => {
        setSurvey(JSON.parse(survey));
        setLoaded(true);

        fetch(`/api/responses/${params.id}/`, { method: "GET" }).then((res) => {
          if (res.status === 404) {
            setLoaded(true);
            return setFound(false);
          }

          res.json().then((r) => {
            setResponses(JSON.parse(r));
          });
        });
      });
    });
  }, []);

  useEffect(() => {
    const questionDisplay: QuestionResponseDisplay[] = [];

    survey.questions.forEach((question) => {
      const newDisplay: any = {
        question,
        totalResponses: 0,
        totalResponsesAcrossSurveys: 0,
        responses: [],
      };

      if (question.type !== "number") {
        question.responses?.forEach((val) => {
          const newRecord: any = {};
          newRecord["name"] = val;

          if (question.type === "number") newRecord["literalValue"] = 0;

          newRecord["value"] = 0;
          newDisplay.responses.push(newRecord);
        });
      } else {
        const newRecord: any = {};
        newRecord["name"] = question.id;

        if (question.type === "number") newRecord["literalValue"] = 0;

        newRecord["value"] = 0;
        newDisplay.responses.push(newRecord);
      }

      questionDisplay.push(newDisplay);
    });

    responses.forEach((res) => {
      res.answers.forEach((answer) => {
        const display = questionDisplay.find(
          (x) => x.question.id === answer.questionId,
        );

        answer.values.forEach((val) => {
          if (display) {
            if (val.length !== 0) display.totalResponses += 1;

            display.totalResponsesAcrossSurveys += 1;
          }

          const record = display!.responses.find((x) => x.name === val);

          if (record && display?.question.type === "number") {
            record["literalValue"] = parseFloat(val);
          }

          if (record) {
            record["value"] += 1;
          }
        });
      });
    });

    setAllAnswers(questionDisplay);
  }, [responses]);

  // ATTRIBUTION: https://github.com/parallax/jsPDF/issues/434#issuecomment-482413755
  const generatePdf = () => {
    html2canvas(reportTemplateRef.current as unknown as HTMLElement).then(
      (canvas) => {
        const imgData = canvas.toDataURL("image/png");

        /*
            Here are the numbers (paper width and height) that I found to work. 
            It still creates a little overlap part between the pages, but good enough for me.
            if you can find an official number from jsPDF, use them.
            */
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        const doc = new jsPDF("p", "mm");
        let position = 0;

        doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        doc.save(`surveyowl-export-${new Date().toISOString()}.pdf`);
      },
    );
  };

  return (
    <>
      {loaded && found && (
        <Container fluid>
          <Center mb="xl">
            <Stack justify="center" align="center">
              <Title order={1}>{`"${survey.title}"`}</Title>

              <Group>
                <Link href={`/${params.id}/${params.managerId}`}>
                  <Button variant="filled" size="md">
                    Go back
                  </Button>
                </Link>
                <Button color="red" size="md" onClick={generatePdf}>
                  Export to PDF
                </Button>
              </Group>
            </Stack>
          </Center>
          <Center>
            <div ref={reportTemplateRef}>
              <Report allAnswers={allAnswers} />
            </div>
          </Center>
        </Container>
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
