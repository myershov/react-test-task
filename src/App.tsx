import questions from '../questions.json'
import { Questionnaire } from './components/Questionnaire'
import { Question } from './modules/models/Question'

function App() {
  return <Questionnaire questions={questions as Question[]} />
}

export default App
