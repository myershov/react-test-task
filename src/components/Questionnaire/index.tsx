import { Button, Card, message, Space } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import type { Question } from '../../modules/models/Question'
import { isEmpty } from '../../utils/helpers'
import { Answer, Question as QuestionComponent } from '../Question'

export interface QuestionnaireProps {
  questions?: Question[]
  className?: string
  style?: React.CSSProperties
}

export const Questionnaire: React.FC<QuestionnaireProps> = ({ questions: _questions = [], ...props }) => {
  const [step, setStep] = useState<number>(0)
  const [currentQuestion, setCurrentQuestion] = useState<Question>()
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
    setCurrentQuestion(questions[step])
  }, [step, questions])

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

    setQuestions(_questions?.map((question) => unwrap(question)).flat())
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
      {questions?.length <= Object.keys(answers || {}).length && !currentQuestion ? (
        'Questionnaire finished in TODO: time-track'
      ) : (
        <QuestionComponent
          question={currentQuestion}
          onAnswer={(answer) => {
            handleAnswer(answer)
            handleNext()
          }}
        />
      )}
    </Card>
  )
}
