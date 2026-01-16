import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import usePreviewData from "@/stores/usePreviewStore.js";
// import DropdownButton from "@/components/DropdownButton";
import { ArrowDownToLine } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { RotatingLines } from "react-loader-spinner";
import api from "@/api/axios";
import { toast } from "sonner";
export default function Download() {

    // state for download button
    const [isImageGenerating, setIsImageGenerating] = useState(false);
  const isDarkMode = usePreviewData((state) => state.isDarkMode);
  const queryClient = useQueryClient();

    // Handle download - background images are now handled on the backend
    const handleDownload = () => {

        const state = usePreviewData.getState(); // takes the snapshot of the latest info

        setIsImageGenerating(true)
        mutation.mutate({
            sender: state.sender,
            receiver: state.receiver,
            messages: state.messageArray,
            receiverAvatar: state.receiverAvatar,
            senderAvatar: state.senderAvatar,
            platform: state.platform,
            isDarkMode: state.isDarkMode,
            isHeaderFooterRendered: state.isHeaderFooterRendered,
        });
    };

    const sendData = async(data) => {
        const response = await api.post(
          '/preview/messages', 
          data, {
            headers: {
              'Content-Type': 'application/json'
            },
            responseType: 'blob', // Important: receive binary data
            withCredentials: true
          }
        )
        return response;
      }

    const mutation = useMutation({
        mutationFn: sendData,
        onSuccess: (response) => {
            // Create a blob URL from the response
            const blob = new Blob([response.data], { type: 'image/png' });
            const url = window.URL.createObjectURL(blob);

            // Create a temporary link and trigger download
            const link = document.createElement('a');
            link.href = url;
            link.download = `screenshot-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();

            // Clean up
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            setIsImageGenerating(false)
            toast.success('Image Downloaded Successfully!');
            console.log('Image generated successfully!');
            queryClient.invalidateQueries({ queryKey: ['userInfo'] })
        },
        onError: (error) => {
            setIsImageGenerating(false)
            toast.error('Failed to generate image.');
            console.error('Something went wrong!', error);
        }
    });


    return (
        <div className="flex-1 gap-2" id="downloadBtn-driver" >
            {(isImageGenerating) ?
            (
                <Button
                    variant="default"
                    className='w-full'
                    onClick={handleDownload}
                    
                >
                    {/* <ArrowDownToLine className="w-4 h-4" /> */}

                    {(isDarkMode) ? (
                        <RotatingLines
                            visible={true}
                            height="110"
                            width="110"
                            color="black"
                            strokeWidth="5"
                            animationDuration="0.75"
                            ariaLabel="rotating-lines-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                        />
                    ) : (
                        <RotatingLines
                            visible={true}
                            height="110"
                            width="110"
                            color="white"
                            strokeWidth="5"
                            animationDuration="0.75"
                            ariaLabel="rotating-lines-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                        />
                    )}


                    <span>Please Wait...</span>
                </Button>

            )
            :
            (
                    <Button
                        variant="default"
                        className='w-full'
                        onClick={handleDownload}
                    >
                        <ArrowDownToLine className="w-4 h-4" />
                        <span>Download</span>
                    </Button>

            )}
        </div>
        
    )
}