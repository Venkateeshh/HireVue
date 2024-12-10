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
const callId = "3AYaWhE7J9YI"

export default function VideoCal() {
    const currentUser = useVideoCall() // Hook called inside the component
    const userId = "Anakin_Solo"

    const user: User = {
        id: userId, // Ensure this matches `user_id` in token
        name: currentUser.username || "Anonymous User",
        image: `https://api.dicebear.com/6.x/adventurer/svg?seed=${currentUser.username || "user"}`, // Generate avatar
    }

    const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3Byb250by5nZXRzdHJlYW0uaW8iLCJzdWIiOiJ1c2VyL0FuYWtpbl9Tb2xvIiwidXNlcl9pZCI6IkFuYWtpbl9Tb2xvIiwidmFsaWRpdHlfaW5fc2Vjb25kcyI6NjA0ODAwLCJpYXQiOjE3MzM3OTY1NDUsImV4cCI6MTczNDQwMTM0NX0.tKL7DIZGaLeNlOM-DenBCL7Ss6atO_e8MRdEivjRobI"

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
