import { Button, Card, Flex, message, Space, Steps, Typography } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
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
  const [timeSpent, setTimeSpent] = useState<Record<number, number>>({})
  const [isFinished, setIsFinished] = useState<boolean>(false)

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

      const newAnswers = { ...answers, [answer!.questionId!]: answer!.data }
      setAnswers(newAnswers)
      message.success('Answer saved!')

      const newIsFinished = Object.values(newAnswers).length === questions?.length
      setIsFinished(newIsFinished)

      if (step + 1 === questions?.length && !newIsFinished) {
        message.error('Questionnaire not finished')
      } else {
        handleNext()
      }
    },
    [step, questions?.length, answers, handleNext]
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

  useEffect(() => {
    const currentQuestion = questions[step]

    if (currentQuestion) {
      const startTime = performance.now()

      return () => {
        setTimeSpent((prevTimeSpent) => ({
          ...prevTimeSpent,
          [currentQuestion.id]: (prevTimeSpent[currentQuestion.id] || 0) + Math.round(performance.now() - startTime)
        }))
      }
    }
  }, [step, questions])

  const totalTimeSpent = useMemo<number>(() => Object.values(timeSpent).reduce((acc, time) => acc + time, 0), [timeSpent])

  console.log(JSON.stringify(answers, null, 2))

  return (
    <Card
      title={
        <Flex align="center" justify="space-between">
          {step !== 0 && (
            <Button type="text" onClick={handleBack}>
              Back
            </Button>
          )}
          <Steps
            type="inline"
            current={step}
            items={[
              ...(questions?.map((_, index) => ({ title: index + 1, style: { flex: 1 } })) || []),
              { title: 'End', style: { flex: 1 } }
            ]}
            onChange={setStep}
            style={{ flex: 1 }}
          />
          {step < questions?.length && (
            <Button type="text" disabled={step === questions?.length - 1 && !isFinished} onClick={handleNext}>
              Next
            </Button>
          )}
        </Flex>
      }
      {...props}>
      {step > questions?.length - 1 ? (
        isFinished ? (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Typography.Text strong>Questionnaire finished in {totalTimeSpent} ms</Typography.Text>
            <Flex wrap gap={8}>
              <Typography.Paragraph style={{ flex: 1 }}>
                <pre style={{ margin: 0 }}>answers: {JSON.stringify(answers, null, 2)}</pre>
              </Typography.Paragraph>
              <Typography.Paragraph style={{ flex: 1 }}>
                <pre style={{ margin: 0 }}>timeSpent: {JSON.stringify(timeSpent, null, 2)}</pre>
              </Typography.Paragraph>
            </Flex>
          </Space>
        ) : (
          'Questionnaire not finished'
        )
      ) : (
        <QuestionComponent question={questions[step]} answer={answers[questions[step]?.id]} onAnswer={handleAnswer} />
      )}
    </Card>
  )
}
