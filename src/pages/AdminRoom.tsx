import logoImg from '../assets/images/logo.svg';
import { database } from '../services/firebase';
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { useParams } from 'react-router-dom'
import '../styles/rooms.scss'
import { useHistory } from 'react-router-dom';
//import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
import { Question } from '../components/Question';
import deleteImg from '../assets/images/delete.svg';


type RoomParams = {
  id: string
}


export function AdminRoom() {
  const params = useParams<RoomParams>();
  const history = useHistory();
  const roomId = params.id;

  const { title, questions } = useRoom(roomId)

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm("Você tem certeza que deseja excluir esta pergunta?")) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
    }

  }

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
       endedAt: new Date()
    })
    history.push('/');
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="letmeask" />
          <div>
            <RoomCode code={params.id} />
            <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
          </div>
        </div>
      </header>

      <main>
        <div>
          <div className="room-title">
            <h1>Sala {title}</h1>
            {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
          </div>
        </div>

        <div className="question-list">
          {questions.map(question => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
              >
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="" />

                </button>

              </Question>
            )

          })}
        </div>
      </main>
    </div>
  )
}
