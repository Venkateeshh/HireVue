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

const apiKey = "mmhfdzb5evj2"
const callId = "dZzsVbtNo3Gc"

export default function VideoCal() {
    const currentUser = useVideoCall() // Hook called inside the component
    const userId = "Bossk"

    const user: User = {
        id: userId, // Ensure this matches `user_id` in token
        name: currentUser.username || "Anonymous User",
        image: `https://api.dicebear.com/6.x/adventurer/svg?seed=${currentUser.username || "user"}`, // Generate avatar
    }

    const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3Byb250by5nZXRzdHJlYW0uaW8iLCJzdWIiOiJ1c2VyL0Jvc3NrIiwidXNlcl9pZCI6IkJvc3NrIiwidmFsaWRpdHlfaW5fc2Vjb25kcyI6NjA0ODAwLCJpYXQiOjE3MzI1MDk3MDcsImV4cCI6MTczMzExNDUwN30.IoVVmzSDhFulAeRBQIu0TmhgCMvoXZeJG5tg4km65Cs"

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
