import { useId, useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import usePreviewData from "@/stores/previewData"

export default function MessageField() {
  const id = useId()
  const [inputText, setInputText] = useState(
`$ Bro did you push the latest code? @(10:15AM)
# Nope 😅 
# Git said “merge conflicts” 
# and I said “not today.” @(10:17AM)
$ 😂 Classic. So what did you do then?
# I closed VS Code and opened YouTube. Problem solved. @(10:18AM)
$ That’s the spirit! By the way, did you see that meme — “I don’t always test my code, but when I do, I do it in production”? 😂
# Yeah bro 💀 that’s literally our project last week.
$ Don’t remind me… my heart still skips a beat when I hear the word “deployment.” @(10:25AM)
# Same. I think our server still has PTSD. 😭
$ Also, I just realized my bug fix created two new bugs. Is that recursion? 😂
# Nah bro, that’s just your feature multiplying. 🐛🐛 @(10:28AM)
$ Okay fine, next time I’m pushing code with a prayer. 🙏 @(10:30AM)
# Don’t forget to commit your sins too. 😈 @(10:31AM)
$ Bro… why does my React component re-render 10 times? 😩 @(10:33AM)
# Because React loves drama. It just can’t let go. 🎭 @(10:34AM)
$ I swear, useEffect is haunting me. @(10:35AM)
# You probably forgot the dependency array again. Typical dev move. 😏 @(10:36AM)
$ Maybe I should switch to Vue.
# Vue? 😂 bro you can’t even view your own console errors.
$ Fair enough. Maybe I’ll learn Angular. @(10:38AM)
# Angular? Bro, your mental health is already on edge. Don’t do that. 😭 @(10:39AM)
$ True, last time I opened an Angular project I aged 5 years instantly.
# Same here. The folder structure gave me existential crisis. 😩
$ Anyway, you free this evening?
# Why? Another debugging session? 🪲 @(10:45AM)
$ Nah bro, let’s go for chai. Maybe caffeine will fix my async issues. ☕ @(10:46AM)
# Sure, but make sure you don’t call await before the tea is ready. 😂 @(10:47AM)
$ Deal! I’ll await chai properly this time. Promise. 🙌 @(10:48AM)
# Good. Otherwise, exception: “Uncaught hunger error.” 🍵 @(10:49AM)
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
    console.log('Parsed messages:', messageArray)
    updatePreviewData(messageArray)
  }

  return (
    <div className="flex flex-col h-full">
      <Label htmlFor={id} className="mb-4">
        Type Your Messages Here...
      </Label>
      <Textarea
        id={id}
        placeholder={`< Your message here @(time)\n> Receiver's message`}
        className="flex-1 resize-none overflow-auto p-2"
        value={inputText}
        onChange={e => setInputText(e.target.value)}
      />
    </div>
  )
}