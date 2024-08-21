import { Button, Flex, Input, Radio, Space, Typography } from 'antd'
import { useCallback, useMemo, useState } from 'react'
import { QuestionType, Sex } from '../../modules/lib/constants'
import type { Question as QuestionT, SingleVariantQuestion } from '../../modules/models/Question'
import { isEqual, toTitleCase } from '../../utils/helpers'

export type Answer = {
  questionId?: number
  data?: any
}

export interface QuestionProps<T = QuestionT> {
  question?: T
  answer?: Answer['data']
  onAnswer?: (answer?: Answer, item?: T) => void
  className?: string
  style?: React.CSSProperties
}

const SexQuestion: React.FC<Omit<QuestionProps, 'type'>> = ({ question, answer, onAnswer }) => {
  const options = useMemo(() => Object.values(Sex), [])

  return (
    <Flex gap={8}>
      {options.map((option) => (
        <Button
          key={option}
          type={answer === option ? 'primary' : 'default'}
          onClick={() => onAnswer?.({ questionId: question?.id, data: option })}>
          {toTitleCase(option)}
        </Button>
      ))}
    </Flex>
  )
}

const CustomQuestion: React.FC<Omit<QuestionProps, 'type'>> = ({ question, answer, onAnswer }) => {
  const [value, setValue] = useState<string>(answer)

  return (
    <Space direction="vertical">
      <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Type custom input here..." />
      <Button block disabled={!value} onClick={() => onAnswer?.({ questionId: question?.id, data: value })}>
        Next
      </Button>
    </Space>
  )
}

const SingleQuestion: React.FC<Omit<QuestionProps<SingleVariantQuestion>, 'type'>> = ({ question, answer, onAnswer }) => {
  return (
    <Space direction="vertical">
      {question?.options.map((option) => (
        <Radio
          key={option.value}
          checked={isEqual(answer, option.value)}
          onClick={() => onAnswer?.({ questionId: question.id, data: option.value })}>
          {option.label}
        </Radio>
      ))}
    </Space>
  )
}

const QuestionCollection = {
  [QuestionType.SEX]: SexQuestion,
  [QuestionType.CUSTOM]: CustomQuestion,
  [QuestionType.SINGLE]: SingleQuestion
}

export const Question: React.FC<QuestionProps> = ({ question, onAnswer, className, style, ...props }) => {
  const handleAnswer = useCallback(
    (answer?: Answer) => {
      onAnswer?.(answer, question)
    },
    [question, onAnswer]
  )

  const QuestionComponent = QuestionCollection[question!.type]

  return (
    <Space direction="vertical" className={className} style={style}>
      <Typography.Text strong>{question?.question}</Typography.Text>
      <QuestionComponent question={question as any} onAnswer={handleAnswer} {...props} />
    </Space>
  )
}
