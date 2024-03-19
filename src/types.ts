import { ReactNode } from "react";

export interface Column {
  accessor: string;
  title: string;
  sortable: boolean;
  textAlign?: string;
  filter?: ReactNode;
  filtering?: boolean;
}

export interface EditableQuestionProps {
  data: Question;
  updateQuestion: Function;
  index: number;
}

export interface Question {
  title: string;
  type: string;
  required: boolean;
  id: string;
  responses?: string[];
}

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

export interface Response {
  responseId: string;
  answers: QuestionResponse[];
  createdAt: Date;
}

export interface Survey {
  title: string;
  acceptResponsesUntil?: Date;
  questions: Question[];
}
