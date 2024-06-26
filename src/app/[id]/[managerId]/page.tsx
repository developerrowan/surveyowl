"use client";
import NotFound from "@/components/NotFound";
import { Column, Question, Response, Survey } from "@/types";
import {
  ActionIcon,
  Alert,
  Button,
  Center,
  Container,
  CopyButton,
  Divider,
  Group,
  LoadingOverlay,
  Modal,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import {
  IconCheck,
  IconConfetti,
  IconCopy,
  IconTrash,
} from "@tabler/icons-react";
import { DataTable, DataTableColumn } from "mantine-datatable";
import Link from "next/link";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { CSVLink } from "react-csv";
import useWindowSize from "react-use/lib/useWindowSize";

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
  const [showAlert, setShowAlert] = useState(
    searchParams.fromCreation ?? false,
  );
  const { width, height } = useWindowSize();
  const [displayConfetti, setDisplayConfetti] = useState(false);
  const [columns, setColumns] = useState([] as Column[]);
  const [tableData, setTableData] = useState([] as any[]);
  const [csvData, setCsvData] = useState([] as any[]);
  const [deleteModalInput, setDeleteModalInput] = useState("");
  const [canDeleteSurvey, setCanDeleteSurvey] = useState(false);
  const [surveyDeleted, setSurveyDeleted] = useState(false);
  const [acceptResponsesUntil, setAcceptResponsesUntil] = useState<Date>(
    new Date(),
  );
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    setCanDeleteSurvey(deleteModalInput === "Understood");
  }, [deleteModalInput]);

  useEffect(() => {
    fetch(`/api/survey/${params.id}/${params.managerId}`, {
      method: "GET",
    }).then((res) => {
      if (res.status === 404) {
        setLoaded(true);
        return setFound(false);
      }

      if (searchParams.fromCreation) setDisplayConfetti(true);

      res.json().then((survey) => {
        const surveyResponse = JSON.parse(survey);
        setSurvey(surveyResponse);
        setAcceptResponsesUntil(new Date(surveyResponse.acceptResponsesUntil));
        setLoaded(true);

        fetch(`/api/responses/${params.id}/`, { method: "GET" }).then((res) => {
          if (res.status === 404) {
            setLoaded(true);
            return setFound(false);
          }

          res.json().then((responses) => {
            setResponses(JSON.parse(responses));
          });
        });
      });
    });
  }, []);

  useEffect(() => {
    const data: any[] = [];

    responses.forEach((response, index) => {
      const res: any = {};

      res["index"] = index;
      response.answers.forEach((answer) => {
        res[answer.questionId] = answer.values.join();
      });
      res["createdAt"] = response.createdAt;

      data.push(res);
    });

    setTableData(data);
  }, [responses]);

  useEffect(() => {
    const columns: Column[] = [
      {
        accessor: "index",
        title: "#",
        textAlign: "right",
        sortable: true,
      },
    ];

    survey.questions.forEach((question, index) => {
      columns.push({
        accessor: question.id,
        title: question.title,
        sortable: true,
      });
    });

    columns.push({
      accessor: "createdAt",
      title: "Responded at",
      sortable: true,
    });

    setColumns(columns);
  }, [survey]);

  useEffect(() => {
    const data: any[] = [];

    responses.forEach((response, index) => {
      const res: any = {};
      res["index"] = index;
      response.answers.forEach((answer) => {
        const question = survey.questions.find(
          (x) => x.id === answer.questionId,
        );

        res[question!.title] = answer.values.join();
      });
      res["createdAt"] = response.createdAt;

      data.push(res);
    });

    setCsvData(data);
  }, [tableData]);

  const deleteSurvey = () => {
    fetch(`/api/survey/${params.id}`, { method: "DELETE" }).then((res) => {
      if (res.status === 200) setSurveyDeleted(true);
    });
  };

  const updateSurveyWindow = (date: Date) => {
    fetch(`/api/survey/${params.id}`, {
      method: "PATCH",
      body: JSON.stringify({ acceptResponsesUntil: date }),
    });
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Are you sure?">
        <Stack>
          <Text size="sm">
            Removing your survey is irreversible. You will lose access to all
            your questions and responses. <b>Permanently</b>.
          </Text>
          <Text size="sm">
            If you understand, type <b>Understood</b> in the box below.
          </Text>
          <TextInput
            value={deleteModalInput}
            onChange={(e) => setDeleteModalInput(e.currentTarget.value)}
          />

          <Group justify="flex-end">
            <Button color="blue" onClick={close}>
              Get me outta here!
            </Button>
            <Button
              color="red"
              onClick={() => {
                close();
                deleteSurvey();
              }}
              disabled={!canDeleteSurvey}
            >
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
      {loaded && found && !surveyDeleted && (
        <Container fluid>
          <Center mb="xl">
            <Stack justify="center" align="center">
              <Title order={1}>{`"${survey.title}"`}</Title>
            </Stack>
          </Center>
          {showAlert && (
            <>
              <Confetti
                width={width}
                height={height}
                numberOfPieces={displayConfetti ? 400 : 0}
                recycle={false}
                onConfettiComplete={(confetti) => {
                  setDisplayConfetti(false);
                  confetti!.reset();
                }}
              />
              <Center mt="lg" mb="lg">
                <Alert
                  variant="light"
                  color="green"
                  title="Nice!"
                  withCloseButton
                  onClose={() => {
                    setShowAlert(false);
                  }}
                  icon={<IconConfetti />}
                >
                  <Stack justify="center" align="center">
                    <Text>Your survey has been created!</Text>
                    <Text>This is where you can manage your survey.</Text>
                    <Text>
                      Come back here anytime using your <b>manager link</b> to
                      see responses, edit your survey, and generate reports.
                    </Text>
                  </Stack>
                </Alert>
              </Center>
            </>
          )}

          <Center>
            <Stack justify="center" align="center">
              <Title order={3}>Share your Survey</Title>
              <Group>
                <TextInput
                  disabled
                  rightSection={
                    <CopyButton
                      value={`https://surveyowl.xyz/${params.id}`}
                      timeout={3000}
                    >
                      {({ copied, copy }) => (
                        <Tooltip
                          label={
                            copied ? `URL copied to clipboard!` : `Copy URL`
                          }
                          openDelay={500}
                        >
                          <ActionIcon
                            color={copied ? "teal" : "blue"}
                            onClick={copy}
                          >
                            {copied ? <IconCheck /> : <IconCopy />}
                          </ActionIcon>
                        </Tooltip>
                      )}
                    </CopyButton>
                  }
                  value={`https://surveyowl.xyz/${params.id}`}
                />
              </Group>
              <Title order={3} mt="lg">
                Your Manager Link
              </Title>
              <Group>
                <TextInput
                  disabled
                  rightSection={
                    <CopyButton
                      value={`https://surveyowl.xyz/${params.id}/${params.managerId}`}
                      timeout={3000}
                    >
                      {({ copied, copy }) => (
                        <Tooltip
                          label={
                            copied ? `URL copied to clipboard!` : `Copy URL`
                          }
                          openDelay={500}
                        >
                          <ActionIcon
                            color={copied ? "teal" : "blue"}
                            onClick={copy}
                          >
                            {copied ? <IconCheck /> : <IconCopy />}
                          </ActionIcon>
                        </Tooltip>
                      )}
                    </CopyButton>
                  }
                  value={`https://surveyowl.xyz/${params.id}/${params.managerId}`}
                />
              </Group>
              <Text c="red">
                Important: <b>DO NOT</b> share this link. This is used to view
                survey responses and manage your survey.
              </Text>
            </Stack>
          </Center>
          <Center mb="md">
            <Stack justify="center" align="center">
              <Title order={3} mt="lg">
                Survey Responses
              </Title>
              <Group>
                <CSVLink
                  data={csvData}
                  filename={`surveyowl-csv-export-${new Date().toISOString()}.csv`}
                >
                  <Button>Export to CSV</Button>
                </CSVLink>
                <Link href={`/${params.id}/${params.managerId}/report`}>
                  <Button color="red">View Report</Button>
                </Link>
              </Group>
            </Stack>
          </Center>
          <DataTable
            withTableBorder
            borderRadius="sm"
            height={300}
            withColumnBorders
            striped
            highlightOnHover
            // 👇 provide data
            records={tableData}
            // 👇 define columns
            columns={columns as unknown as DataTableColumn<any>[]}
            // 👇 execute this callback when a row is clicked
            onRowClick={({ record: { name, party, bornIn } }) =>
              showNotification({
                title: `Clicked on ${name}`,
                message: `You clicked on ${name}, a ${party.toLowerCase()} president born in ${bornIn}`,
                withBorder: true,
              })
            }
          />
          <Center mt="lg">
            <Stack justify="center" align="center">
              <DatePickerInput
                label="Accept survey responses until:"
                value={acceptResponsesUntil}
                onChange={(value) => {
                  setAcceptResponsesUntil(value as Date);
                  updateSurveyWindow(value as Date);
                }}
                placeholder="Pick date"
                minDate={new Date()}
                maxDate={
                  new Date(new Date().setDate(new Date().getDate() + 30))
                }
              />
              <Text>
                (You may extend the survey&apos;s response up to 30 days at a
                time)
              </Text>
              <Button mt="xl" color="red" onClick={open}>
                <IconTrash /> Delete survey
              </Button>
            </Stack>
          </Center>
        </Container>
      )}
      {!found && <NotFound />}
      {surveyDeleted && (
        <Center style={{ width: "100%", height: "100vh" }}>
          <Stack justify="center" align="center">
            <Title order={1}>Good-night, sweet prince.</Title>
            <Text size="xl">
              <i>And flights of angels sing thee to thy rest.</i>
            </Text>
            <Divider />
            <Title order={3}>Your survey was deleted.</Title>
            <Text size="xl">You can always create another one, though!</Text>
            <Link href={"/create"}>
              <Button size="md">Create survey</Button>
            </Link>
            <Text fw={700}>OR</Text>
            <Link href={"/"}>
              <Button size="md">Go home</Button>
            </Link>
          </Stack>
        </Center>
      )}
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
