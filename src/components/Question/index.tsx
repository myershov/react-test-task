import { Card } from 'antd'
import { QuestionType } from '../../modules/lib/constants'
import type { Question as QuestionT } from '../../modules/models/Question'

export interface QuestionProps {
  question?: QuestionT
  onAnswer?: (item: QuestionT) => void
  className?: string
  style?: React.CSSProperties
}

export const Question: React.FC<QuestionProps> = ({ question, ...props }) => {
  switch (question?.type) {
    case QuestionType.SEX:
      return <SexQuestion question={question} {...props} />
    case QuestionType.CUSTOM:
      return <CustomQuestion question={question} {...props} />
    case QuestionType.SINGLE:
      return <SingleQuestion question={question} {...props} />
    default:
      return null
  }
}

const SexQuestion: React.FC<Omit<QuestionProps, 'type'>> = ({ question, className, style }) => {
  console.log({ question, className, style })

  return <Card>{/* TODO: question page */}</Card>
}

const CustomQuestion: React.FC<Omit<QuestionProps, 'type'>> = ({ question, className, style }) => {
  console.log({ question, className, style })

  return <Card>{/* TODO: question page */}</Card>
}

const SingleQuestion: React.FC<Omit<QuestionProps, 'type'>> = ({ question, className, style }) => {
  console.log({ question, className, style })

  return <Card>{/* TODO: question page */}</Card>
}
