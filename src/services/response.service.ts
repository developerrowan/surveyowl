import prisma from "@/lib/prisma";
import { QuestionResponse, Response } from "@/types";
import generateId from "@/utils/generateId";
import { getQuestionResponses } from "./questionResponse.service";

export async function createResponse(
  surveyId: string,
  responses: QuestionResponse[],
) {
  const responseId = generateId();
  const questionResponse = await prisma.response.create({
    data: {
      id: responseId,
      surveyId: surveyId,
      questionResponses: {
        create: responses.map((response) => {
          return {
            id: generateId(12),
            question: {
              connect: { id: response.questionId },
            },
            values: response.values,
          };
        }),
      },
    },
  });

  return questionResponse;
}

export async function getResponses(surveyId: string) {
  const responseFromDb = await prisma.response.findMany({
    where: {
      surveyId,
    },
  });

  const responses: Response[] = [];

  for (let i = 0; i < responseFromDb.length; i++) {
    const element = responseFromDb[i];

    const answers: QuestionResponse[] = await getQuestionResponses(element.id);
    const response: Response = {
      responseId: element.id,
      answers,
      createdAt: new Date(element.createdAt),
    };

    responses.push(response);
  }

  return responses;
}
