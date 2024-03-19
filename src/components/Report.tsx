import { QuestionResponseDisplay } from "@/types";
import { Stack, Table, Text, Title } from "@mantine/core";

interface ReportProps {
  allAnswers: QuestionResponseDisplay[];
}

export default function Report(props: ReportProps) {
  return (
    <Stack justify="left" align="left">
      {props.allAnswers.map((answer, i) => (
        <>
          <Title order={3}>{`${i}. ${answer.question.title}`}</Title>
          <Text>
            {answer.totalResponses} response
            {answer.totalResponses > 1 ? "s" : ""} (
            {(
              (answer.totalResponses / answer.totalResponsesAcrossSurveys) *
              100
            ).toFixed(0)}
            % response rate)
          </Text>
          {!answer.question.required && (
            <Text>
              <i>This question was optional.</i>
            </Text>
          )}
          <Text>
            Please export your responses to CSV to see responses to questions
            that are not single or multi-select.
          </Text>
          {(answer.question.type === "radio" ||
            answer.question.type === "multiselect") && (
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Response</Table.Th>
                  <Table.Th>Number of responses</Table.Th>
                  <Table.Th>% total</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {answer.responses.map((response, i) => (
                  <>
                    {response["value"] > 0 && (
                      <Table.Tr key={i}>
                        <Table.Td>{response["name"]}</Table.Td>
                        <Table.Td>{response["value"]}</Table.Td>
                        <Table.Td>
                          {(
                            (response["value"] / answer.totalResponses) *
                            100
                          ).toFixed(2)}
                        </Table.Td>
                      </Table.Tr>
                    )}
                  </>
                ))}
              </Table.Tbody>
            </Table>
          )}
        </>
      ))}
    </Stack>
  );
}
