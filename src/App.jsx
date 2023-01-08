import './App.css';
import {EntryList} from './components/entry'
import {TaskList} from './components/task'
import { Card, Header, Container } from 'semantic-ui-react'
import Calendar from 'react-calendar';
const TasksCard = () => (
  <Card fluid>
  <Card.Content style={{paddingRight: "2em"}}>
      <Card.Header>
        <Header as='h1'>Tasks</Header>
      </Card.Header>
      <Card.Description>
        <TaskList/>
      </Card.Description>
    </Card.Content>
  </Card>
)

const JournalCard = () => (
  <Card fluid>
    <Card.Content style={{paddingRight: "2em"}}>
      <Card.Header>
        <Header as='h1'>Journal</Header>
      </Card.Header>
      <Card.Description>
        <EntryList/>
      </Card.Description>
    </Card.Content>
  </Card>
)

function App() {
  return (
    <Container>
      <div style={{display: "flex", flexDirection:"column"}}>
        <div>
          <Calendar/>
        </div>
        <div style={{display: "grid", gridTemplateColumns: "1fr 2fr", gap: "50px"}}>
          <div>
            <TasksCard/>
          </div>
          <div>
            <JournalCard/>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default App;
