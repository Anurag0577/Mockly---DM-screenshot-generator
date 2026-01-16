import Instagram from "@/plateform/Instagram";
import WhatsApp from "@/plateform/WhatsApp";
import usePreviewData from "@/stores/usePreviewStore";

export default function RenderPlatformUI() {
  const sender = usePreviewData((s) => s.sender);
  const receiver = usePreviewData((s) => s.receiver);
  const receiverAvatar = usePreviewData((s) => s.receiverAvatar);
  const messages = usePreviewData((s) => s.messageArray);
  const platform = usePreviewData((s) => s.platform);
  const isHeaderFooterRendered = usePreviewData((s) => s.isHeaderFooterRendered);

  console.log('this is in the renderPlateform', platform)

  switch (platform) {
    case "Instagram":
      return <Instagram sender={sender} receiver={receiver} messages={messages} receiverAvatar={receiverAvatar}  isHeaderFooterRendered={isHeaderFooterRendered} />;
    case "WhatsApp":
      return <WhatsApp sender={sender} receiver={receiver} messages={messages} receiverAvatar={receiverAvatar} isHeaderFooterRendered={isHeaderFooterRendered} />;
    default:
      return <WhatsApp sender={sender} receiver={receiver} messages={messages} receiverAvatar={receiverAvatar} isHeaderFooterRendered={isHeaderFooterRendered} />; 
  }
}
