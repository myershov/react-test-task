import { Button, Card, message, Space } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import type { Question } from '../../modules/models/Question'
import { isEmpty, isEqual } from '../../utils/helpers'
import { Answer, Question as QuestionComponent } from '../Question'

export interface QuestionnaireProps {
  questions?: Question[]
  className?: string
  style?: React.CSSProperties
}

export const Questionnaire: React.FC<QuestionnaireProps> = ({ questions: _questions = [], ...props }) => {
  const [step, setStep] = useState<number>(0)
  const [questions, setQuestions] = useState<Question[]>(_questions)
  const [answers, setAnswers] = useState<Record<number, any>>({})

  const handleNext = useCallback(() => {
    setStep(Math.min(step + 1, questions?.length))
  }, [step, questions?.length])

  const handleBack = useCallback(() => {
    setStep(Math.max(step - 1, 0))
  }, [step])

  const handleAnswer = useCallback(
    (answer?: Answer) => {
      if (isEmpty(answer?.questionId) || isEmpty(answer?.data)) {
        message.error('Unexpected answer!')
        return
      }

      setAnswers({ ...answers, [answer!.questionId!]: answer!.data })
      message.success('Answer saved!')
    },
    [answers]
  )

  useEffect(() => {
    const unwrap = (question: Question): Omit<Question, 'conditionalBlocks'>[] => {
      let result: Question[] = [question]

      if (question.conditionalBlocks) {
        const providedAnswer = answers[question.id]
        if (providedAnswer) {
          const conditionalQuestions = question.conditionalBlocks[providedAnswer]
          if (conditionalQuestions) {
            conditionalQuestions.forEach((conditionalQuestion) => {
              result = result.concat(unwrap(conditionalQuestion))
            })
          }
        }
      }

      return result
    }

    const newQuestions = _questions?.map((question) => unwrap(question)).flat()
    setQuestions(newQuestions)

    const newAnswers = Object.fromEntries(
      Object.entries(answers).filter(([questionId]) => newQuestions.some((question) => question.id === Number(questionId)))
    )
    if (!isEqual(newAnswers, answers)) {
      setAnswers(newAnswers)
    }
  }, [_questions, answers])

  return (
    <Card
      title={
        <Space>
          <Button type="text" onClick={handleBack}>
            Back
          </Button>
          <Button type="text" onClick={handleNext}>
            Next
          </Button>
        </Space>
      }
      {...props}>
      {step > questions?.length - 1 ? (
        'Questionnaire finished in TODO: time-track'
      ) : (
        <QuestionComponent
          question={questions[step]}
          answer={answers[questions[step]?.id]}
          onAnswer={(answer) => {
            handleAnswer(answer)
            handleNext()
          }}
        />
      )}
    </Card>
  )
}
