import useRealtimeMongo from "../lib/hook"

const ChatRecords = ({ channel, name }) => {
  const data = useRealtimeMongo(`/chat?channel=${channel}`)
  return (<div>
    {Array.isArray(data) && data.map(({ created, name: him, text, _id }) => {
      return (<p key={_id} style={{
        lineHeight: '2em'
      }}>{name === him ? '[me]' : him}:{text}--{created && created.toString()}</p>)
    })}
  </div>)
}

export default ChatRecords