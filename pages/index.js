import ChatInput from "../components/ChatInput"
import ChatRecords from "../components/ChatRecords"
import random from 'random-name'


const name = random()

const Index = ({ channel }) => {
  return (<div>
    <p>chat channel: {channel}</p>
    <ChatRecords name={name} channel={channel} />
    <ChatInput name={name} channel={channel} />
  </div>)
}

Index.getInitialProps = async (ctx) => {
  let { req, query } = ctx
  if (req) return req.query
  return query
}

export default Index