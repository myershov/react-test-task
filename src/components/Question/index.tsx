import { Button, Flex, Input, Radio, Space, Typography } from 'antd'
import { useCallback, useState } from 'react'
import { QuestionType } from '../../modules/lib/constants'
import type { Question as QuestionT, SingleVariantQuestion } from '../../modules/models/Question'
import { isEqual } from '../../utils/helpers'

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

export const Question: React.FC<QuestionProps> = ({ question, onAnswer, className, style, ...props }) => {
  const handleAnswer = useCallback(
    (answer?: Answer) => {
      onAnswer?.(answer, question)
    },
    [question, onAnswer]
  )

  let component
  switch (question?.type) {
    case QuestionType.SEX:
      component = <SexQuestion question={question} onAnswer={handleAnswer} {...props} />
      break
    case QuestionType.CUSTOM:
      component = <CustomQuestion question={question} onAnswer={handleAnswer} {...props} />
      break
    case QuestionType.SINGLE:
      component = <SingleQuestion question={question as SingleVariantQuestion} onAnswer={handleAnswer} {...props} />
      break
    default:
      component = null
      break
  }

  return (
    <Space direction="vertical" className={className} style={style}>
      <Typography.Text strong>{question?.question}</Typography.Text>
      {component}
    </Space>
  )
}

const SexQuestion: React.FC<Omit<QuestionProps, 'type'>> = ({ question, answer, onAnswer }) => {
  return (
    <Flex gap={8}>
      <Button type={answer === 'male' ? 'primary' : 'default'} onClick={() => onAnswer?.({ questionId: question?.id, data: 'male' })}>
        Male
      </Button>
      <Button type={answer === 'female' ? 'primary' : 'default'} onClick={() => onAnswer?.({ questionId: question?.id, data: 'female' })}>
        Female
      </Button>
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
