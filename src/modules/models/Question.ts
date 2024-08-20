import { QuestionType } from '../lib/constants'

export type Question = {
  id: number
  type: QuestionType
  question: string
  additionalOptions?: Record<string, any>
  conditionalBlocks?: Record<string, Question>
}
