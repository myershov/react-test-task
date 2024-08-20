import questions from '../questions.json'
import { Questionnaire } from './components/Questionnaire'
import { Question } from './modules/models/Question'

function App() {
  return (
    <div className="container">
      <Questionnaire className="questionnaire" questions={questions as Question[]} />
    </div>
  )
}

export default App
