import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function HowToUsePopup() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" >Full Guide</Button>
      </DialogTrigger>
      <DialogContent
        className="flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-lg [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-4 text-base">
            🧭 How to Write Messages Correctly
          </DialogTitle>
          <div className="overflow-y-auto">
            <DialogDescription asChild>
              <div className="px-6 py-4">
                <div className="bg-white rounded-2xl max-w-3xl mx-auto text-gray-800 leading-relaxed dark:bg-[#262626] dark:text-gray-100">
                  <p className="mb-4">
                    Hey there 👋, welcome! Before you start creating your chat preview,
                    please read these simple rules carefully so your messages display
                    correctly on the right-hand side. Let’s go step by step 👇
                  </p>

                  <h2 className="text-xl font-semibold mt-6 mb-2 dark:text-gray-50">1️⃣ Sender and Receiver</h2>
                  <p className="mb-3">
                    Every message must start with a symbol that tells who is speaking:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-1">
                    <li>
                      <span className="font-semibold">$</span> → represents the <b>Sender</b> (your message).
                    </li>
                    <li>
                      <span className="font-semibold">#</span> → represents the <b>Receiver</b> (the other person’s message).
                    </li>
                  </ul>

                  <p className="mb-3 font-semibold">✅ Example:</p>
                  <div className="bg-gray-100 dark:bg-[#1f1f1f] p-3 rounded-lg font-mono text-sm mb-4">
                    $ How are you? @(01:23AM) <br />
                    # I am fine! Where is your father? 😟😟 @(01:55AM)
                  </div>

                  <p className="mb-4">
                    In the preview, the first message will appear on the <b>right</b> (sender)
                    and the second one on the <b>left</b> (receiver).
                  </p>

                  <h2 className="text-xl font-semibold mt-6 mb-2 dark:text-gray-50">2️⃣ Timestamps (Optional)</h2>
                  <p className="mb-3">
                    Adding time is optional. You can write the timestamp at the end of your message inside{" "}
                    <code className="bg-gray-200 dark:bg-[#333] px-1 rounded">@()</code>.  
                    If you don’t include it, the system automatically uses the <b>current time</b>.
                  </p>

                  <p className="mb-3 font-semibold">✅ Example:</p>
                  <div className="bg-gray-100 dark:bg-[#1f1f1f] p-3 rounded-lg font-mono text-sm mb-4">
                    $ Hey! Good morning ☀️ <br />
                    # Morning! Ready for work? @(09:10AM)
                  </div>

                  <p className="mb-4">
                    In the first line (no time written), the app will automatically fill in the
                    current time when you typed the message.
                  </p>

                  <h2 className="text-xl font-semibold mt-6 mb-2 dark:text-gray-50">3️⃣ Spaces After Symbols</h2>
                  <p className="mb-3">
                    Don’t worry — you can either write <code className="bg-gray-200 dark:bg-[#333] px-1 rounded">$Hello</code> or <code className="bg-gray-200 dark:bg-[#333] px-1 rounded">$ Hello</code>,
                    both will work perfectly fine. The system will detect it correctly.
                  </p>

                  <h2 className="text-xl font-semibold mt-6 mb-2 dark:text-gray-50">4️⃣ What if You Forget `$` or `#`?</h2>
                  <p className="mb-3">
                    If you forget to put <b>$</b> or <b>#</b> at the start of a line, that text
                    will be added to the <b>previous message</b> as a new line instead of creating
                    a new message.
                  </p>

                  <p className="mb-3 font-semibold">✅ Example:</p>
                  <div className="bg-gray-100 dark:bg-[#1f1f1f] p-3 rounded-lg font-mono text-sm mb-4">
                    $ I wanted to tell you something important.<br />
                    It’s about our trip tomorrow.<br />
                    # Oh really? What happened? @(08:20PM)
                  </div>

                  <p className="mb-4">
                    Here, the second line (no symbol) becomes part of the sender’s message.
                  </p>

                  <h2 className="text-xl font-semibold mt-6 mb-2 dark:text-gray-50">5️⃣ Multiline Messages</h2>
                  <p className="mb-3">
                    You can press <b>Enter</b> to start a new line within the same message.
                    Just make sure you <b>don’t add `$` or `#`</b> at the start of the next line.
                  </p>

                  <p className="mb-3 font-semibold">✅ Example:</p>
                  <div className="bg-gray-100 dark:bg-[#1f1f1f] p-3 rounded-lg font-mono text-sm mb-4">
                    $ Today was a really long day.<br />
                    I had so much work to do 😩.<br />
                    # Take some rest then! @(10:30PM)
                  </div>

                  <p className="mb-4">
                    Both the first and second lines (until the <b>#</b> line starts) will appear as
                    a single bubble in the preview.
                  </p>

                  <h2 className="text-xl font-semibold mt-6 mb-2 dark:text-gray-50">6️⃣ Timestamp Position</h2>
                  <p className="mb-3">
                    Always place the timestamp <b>at the end</b> of your message.  
                    If you put <code className="bg-gray-200 dark:bg-[#333] px-1 rounded">@()</code> somewhere in between, it will be treated as normal
                    text instead of time.
                  </p>

                  <p className="mb-3 font-semibold">🚫 Wrong Example:</p>
                  <div className="bg-red-100 dark:bg-red-900 p-3 rounded-lg font-mono text-sm mb-4">
                    $ How are you @(01:23AM) today?
                  </div>

                  <p className="mb-3 font-semibold">✅ Correct Example:</p>
                  <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg font-mono text-sm mb-4">
                    $ How are you today? @(01:23AM)
                  </div>

                  <h2 className="text-xl font-semibold mt-6 mb-2 dark:text-gray-50">7️⃣ Emojis & Symbols</h2>
                  <p className="mb-4">
                    You can freely use emojis 😄, special characters 💬, or even symbols like
                    <code className="bg-gray-200 dark:bg-[#333] px-1 rounded"> $ # ( ) </code> in your message.  
                    The system is smart enough to handle them correctly.
                  </p>

                  <h2 className="text-xl font-semibold mt-6 mb-2 dark:text-gray-50">🎯 Final Example</h2>
                  <div className="bg-gray-100 dark:bg-[#1f1f1f] p-3 rounded-lg font-mono text-sm mb-6">
                    $ How are you? @(01:23AM) <br />
                    # I am fine! Where is your father? 😟😟 @(01:55AM) <br />
                    $ My father is asking about him. @(02:00AM) <br />
                    # He is out of station 🏔️ right now. He will return tomorrow 😄😄😄. @(12:23PM)
                  </div>

                  <p className="text-center text-lg font-semibold text-gray-700 dark:text-gray-100">
                    That’s it! 🎉 Now you’re ready to create amazing chat previews.
                  </p>
                </div>

              </div>
            </DialogDescription>
            <DialogFooter className="px-6 pb-6 sm:justify-start">
              <DialogClose asChild>
                <Button type="button">Okay</Button>
              </DialogClose>
            </DialogFooter>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
