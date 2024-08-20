import type { Question } from '../../modules/models/Question'
import { Question as QuestionComponent } from '../Question'

export interface QuestionnaireProps {
  questions?: Question[]
  className?: string
  style?: React.CSSProperties
}

export const Questionnaire: React.FC<QuestionnaireProps> = ({ questions = [], ...props }) => {
  console.log({ questions, props })

  return (
    <>
      {questions?.map((question) => (
        <QuestionComponent key={question.id} question={question} />
      ))}
    </>
  )
}
