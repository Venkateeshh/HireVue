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

const apiKey = 'mmhfdzb5evj2';
const callId = 'BiGNZTxPgu4Y';

export default function VideoCal() {
    const currentUser = useVideoCall() // Hook called inside the component
    const userId = 'Jarael';

    const user: User = {
        id: userId, // Ensure this matches `user_id` in token
        name: currentUser.username || "Anonymous User",
        image: `https://api.dicebear.com/6.x/adventurer/svg?seed=${currentUser.username || "user"}`, // Generate avatar
    }

    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3Byb250by5nZXRzdHJlYW0uaW8iLCJzdWIiOiJ1c2VyL0phcmFlbCIsInVzZXJfaWQiOiJKYXJhZWwiLCJ2YWxpZGl0eV9pbl9zZWNvbmRzIjo2MDQ4MDAsImlhdCI6MTczMzM3MTk3MSwiZXhwIjoxNzMzOTc2NzcxfQ.SXNT-MWfpAbdDlx1RnsaKK_uLeucu3uKiF2XyPyOp5o';

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
