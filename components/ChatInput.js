import { useState } from "react"
import axios from '../lib/axios'

const ChatInput = ({ channel, name }) => {
  let [text, setText] = useState('')
  return (<div>
    <span>{name}:</span>
    <input value={text} onKeyUp={e => {
      if (e.keyCode === 13) {
        if (text) axios.post('/chat', { name, channel, text })
        setText('')
      }
    }} onChange={e => setText(e.target.value)}></input>
  </div>)
}

export default ChatInput