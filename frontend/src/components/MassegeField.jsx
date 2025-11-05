import { useId, useState } from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function MessageField() {
  const id = useId()
  const [inputText, setInputText] = useState(
    `< How are you? @(02:30PM)
> I am fine. What about you?
Where is you father?
< I am also good. Where is your father? @(03:02PM)
> He is out of the station rightnow. @(03:05PM)`
  )
  
  // Function to get current time in 12-hour format
  const getCurrentTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutesStr}${ampm}`;
  };
  
  const messages = inputText.trim().split('\n');
  let currentMessage = null;
  let messageArray = [];
  
  for (const messageText of messages) {
    const trimmedText = messageText.trim();
    
    if (trimmedText.startsWith('<') || trimmedText.startsWith('>')) {
      const sender = trimmedText.startsWith('<') ? 'sender' : 'receiver';
      
      // Check if time is mentioned
      const timeMatch = trimmedText.match(/@\(\s*(.*?)\s*\)/);
      const time = timeMatch ? timeMatch[1] : getCurrentTime();
      
      // Extract message (everything between < or > and @( or end of line)
      let message;
      if (timeMatch) {
        // Time is present, extract message before @(
        const messageMatch = trimmedText.match(/[<>]\s*(.*?)\s*@\(/);
        message = messageMatch ? messageMatch[1] : '';
      } else {
        // No time present, extract everything after < or >
        const messageMatch = trimmedText.match(/[<>]\s*(.*)/);
        message = messageMatch ? messageMatch[1] : '';
      }
      
      currentMessage = { sender, message, time };
      messageArray.push(currentMessage);
    } else if (currentMessage && trimmedText) {
      // Append to the current message on a new line
      currentMessage.message += `\n${trimmedText}`;
    }
  }
  
  // Log to see the parsed messages
  console.log(messageArray);
  
  return (
    <div className="flex flex-col h-full">
      <Label htmlFor={id} className="mb-4">Type Your Messages Here...</Label>
      <Textarea
        id={id}
        placeholder="Leave a comment"
        className="flex-1 resize-none overflow-auto"
        value={inputText}
        onChange={e => {
          setInputText(e.target.value);
        }}
      />
    </div>
  )
}