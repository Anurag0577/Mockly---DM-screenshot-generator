import WhatsApp from "@/plateform/WhatsApp";
import usePreviewData from "@/stores/previewData";

export default function RenderPlatformUI() {
  const sender = usePreviewData((s) => s.sender);
  const receiver = usePreviewData((s) => s.receiver);
  const receiverAvatar = usePreviewData((s) => s.receiverAvatar);
  const messages = usePreviewData((s) => s.messageArray);

  return (
    <WhatsApp
      sender={sender}
      receiver={receiver}
      receiverAvatar={receiverAvatar}
      messages={messages}
    />
  );
}
