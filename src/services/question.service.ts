import prisma from "@/lib/prisma";
import { Question, Survey } from "@/types";
import generateId from "@/utils/generateId";

export async function createQuestion(survey: Survey) {
  const newSurvey = await prisma.survey.create({
    data: {
      id: generateId(),
      managerId: generateId(),
      title: survey.title,
      questions: {
        create: survey.questions.map((question, i) => {
          return {
            id: generateId(12),
            index: i,
            title: question.title,
            required: question.required,
            type: question.type,
            values: question.responses || [],
          };
        }),
      },
    },
  });

  return newSurvey;
}

export async function getQuestions(surveyId: string) {
  const questionsQuery = await prisma.question.findMany({
    where: {
      surveyId,
    },
  });

  const questions: Question[] = [];
  const questionsFromDb = Array.from(questionsQuery);

  questionsFromDb.forEach((question: any) => {
    questions.push({
      id: question.id,
      title: question.title,
      type: question.type,
      required: question.required,
      responses: question.values,
    });
  });

  return questions;
}
