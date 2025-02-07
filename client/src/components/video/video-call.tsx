import { useVideoCall } from "@/components/video/videocall"
import {
    CallControls,
    CallingState,
    SpeakerLayout,
    StreamCall,
    StreamTheme,
    StreamVideo,
    StreamVideoClient,
    useCallStateHooks,
    User,
} from "@stream-io/video-react-sdk"
import "@stream-io/video-react-sdk/dist/css/styles.css"
import "./styles.css"

const apiKey = "268wnazfrz7z"
const callId = "kYFLhjN2Ikw8"

export default function VideoCal() {
    const currentUser = useVideoCall() // Hook called inside the component
    const userId = "'Darth_Maul"

    const user: User = {
        id: userId, // Ensure this matches `user_id` in token
        name: currentUser.username || "Anonymous User",
        image: `https://api.dicebear.com/6.x/adventurer/svg?seed=${currentUser.username || "user"}`, // Generate avatar
    }

    const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3Byb250by5nZXRzdHJlYW0uaW8iLCJzdWIiOiJ1c2VyL0RhcnRoX01hdWwiLCJ1c2VyX2lkIjoiRGFydGhfTWF1bCIsInZhbGlkaXR5X2luX3NlY29uZHMiOjYwNDgwMCwiaWF0IjoxNzM4ODU1OTU3LCJleHAiOjE3Mzk0NjA3NTd9.HFgSkd__WQCdzZstadON4nkuI6SmrBJpnCy1PzajDRo"

    const client = new StreamVideoClient({ apiKey, user, token })
    const call = client.call("default", callId)

    call.join({ create: true })

    return (
        <StreamVideo client={client}>
            <StreamCall call={call}>
                <MyUILayout />
            </StreamCall>
        </StreamVideo>
    )
}

export const MyUILayout = () => {
    const { useCallCallingState } = useCallStateHooks()
    const callingState = useCallCallingState()

    if (callingState !== CallingState.JOINED) {
        return <div>Loading...</div>
    }

    return (
        <StreamTheme>
            <SpeakerLayout participantsBarPosition="bottom" />
            <CallControls />
        </StreamTheme>
    )
}
