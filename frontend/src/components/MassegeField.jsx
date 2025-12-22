import { useId, useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import usePreviewData from "@/stores/usePreviewStore"

export default function MessageField() {
  const id = useId()
  const [inputText, setInputText] = useState(
`
$ Oye Nawab,  @(6:00PM) 
$ sunn. Instagram pe story dekhi teri, bade cafe mein baitha hai? ☕ @(6:00PM) 
# Haan bhai, bas thoda 'High Class' feel le raha tha. 😎 @(6:01PM) 
$ Sahi hai. Toh wo jo 500 rupaye udhar liye the, wo GPay kar de? Bill wahi se bhar dena. @(6:02PM) 
# Are bhai... @(6:05PM) 
# Hello? Bhai network gaya achanak se. Kya bola tune? @(6:06PM) 
$ Natak mat kar. Text message hai ye, awaz nahi kat rahi. 'Khopdi tod saale ka'. 💀 @(6:07PM) 
# Arre bhai, wo cafe wale ne kidney rakh li meri bill mein. Ab main auto ke paise maangne wala tha tujhse. 🥺 @(6:08PM) 
`
  )

  const updatePreviewData = usePreviewData((state) => state.updatePreviewData)

  // Function to get current time in 12-hour format
  const getCurrentTime = () => {
    const now = new Date()
    let hours = now.getHours()
    const minutes = now.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12
    hours = hours ? hours : 12
    const minutesStr = minutes < 10 ? '0' + minutes : minutes
    return `${hours}:${minutesStr}${ampm}`
  }

  // Parse input text with debouncing for better performance
  useEffect(() => {
    // Debounce: wait 300ms after user stops typing
    const timeoutId = setTimeout(() => {
      parseInputText()
    }, 300)
    
    return () => clearTimeout(timeoutId)
  }, [inputText])

  const parseInputText = () => {
    // Handle empty input
    if (!inputText.trim()) {
      updatePreviewData([])
      return
    }

    // Create fresh array
    const messageArray = []
    const messages = inputText.trim().split('\n')
    let currentMessage = null

    for (const messageText of messages) {
      const trimmedText = messageText.trim()
      
      // Skip empty lines
      if (!trimmedText) continue
      
      if (trimmedText.startsWith('$') || trimmedText.startsWith('#')) {
        const sender = trimmedText.startsWith('$') ? 'sender' : 'receiver'
        
        // Check if time is mentioned - simplified regex
        const timeMatch = trimmedText.match(/@\(([^)]+)\)/)
        const time = timeMatch ? timeMatch[1].trim() : getCurrentTime()
        
        // Extract message
        let message
        if (timeMatch) {
          const messageMatch = trimmedText.match(/[$#]\s*(.*?)\s*@\(/)
          message = messageMatch ? messageMatch[1].trim() : ''
        } else {
          const messageMatch = trimmedText.match(/[$#]\s*(.*)/)
          message = messageMatch ? messageMatch[1].trim() : ''
        }
        
        // Only add if message is not empty
        if (message) {
          currentMessage = { sender, message, time }
          messageArray.push(currentMessage)
        }
      } else if (currentMessage && trimmedText) {
        // Append to the current message on a new line
        currentMessage.message += `\n${trimmedText}`
      }
    }

    // Update store with parsed messages
    // console.log('Parsed messages:', messageArray)
    updatePreviewData(messageArray)
  }

  return (
    <div className="flex flex-col h-full" id="massageField-driver" >
      <Label htmlFor={id} className="mb-4">
        Type Your Messages Here...
      </Label>
      <Textarea
        id={id} 
        placeholder={`< Your message here @(time)\n> Receiver's message`}
        className="flex-1 md:resize-none overflow-auto p-2"
        value={inputText}
        onChange={e => setInputText(e.target.value)}
      />
    </div>
  )
}