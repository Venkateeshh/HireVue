import SplitterComponent from "@/components/SplitterComponent"
import ConnectionStatusPage from "@/components/connection/ConnectionStatusPage"
import Sidebar from "@/components/sidebar/Sidebar"
import WorkSpace from "@/components/workspace"
import { useAppContext } from "@/context/AppContext"
import { useSocket } from "@/context/SocketContext"
import useUserActivity from "@/hooks/useUserActivity"
import { SocketEvent } from "@/types/socket"
import { USER_STATUS, User } from "@/types/user"
import { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { AlertTriangle } from "lucide-react"
import { Toast } from "@/components/toast/Toasts"

interface ToastState {
    isVisible: boolean
    message: string
    duration: number
}

interface LocationState {
    username?: string
    roomId?: string
}

function EditorPage() {
    useUserActivity()
    const navigate = useNavigate()
    const { roomId } = useParams<{ roomId: string }>()
    const { status, setCurrentUser, currentUser } = useAppContext()
    const { socket } = useSocket()
    const location = useLocation()
    const locationState = location.state as LocationState

    const [isFullscreen, setIsFullscreen] = useState<boolean>(
        !!document.fullscreenElement,
    )
    const [exitAttempts, setExitAttempts] = useState<number>(0)
    const [isRemoved, setIsRemoved] = useState<boolean>(false)
    const [toast, setToast] = useState<ToastState>({
        isVisible: false,
        message: "",
        duration: 5000,
    })

    const showToast = (message: string): void => {
        setToast({
            isVisible: true,
            message,
            duration: 5000,
        })
    }

    const hideToast = (): void => {
        setToast((prev) => ({ ...prev, isVisible: false }))
    }

    const enterFullscreen = async (): Promise<void> => {
        try {
            if (document.documentElement.requestFullscreen) {
                await document.documentElement.requestFullscreen()
                setIsFullscreen(true)
            }
        } catch (error) {
            console.error("Fullscreen request failed:", error)
        }
    }

    // Initial fullscreen entry
    useEffect(() => {
        enterFullscreen()
    }, [])

    // Monitor fullscreen state
    useEffect(() => {
        const handleFullscreenChange = (): void => {
            const isInFullscreen = !!document.fullscreenElement
            setIsFullscreen(isInFullscreen)

            if (!isInFullscreen && !isRemoved) {
                setExitAttempts((prev) => {
                    const newAttempts = prev + 1
                    if (newAttempts >= 3) {
                        setIsRemoved(true)
                    } else {
                        showToast(
                            `Please return to fullscreen mode to continue. Exit attempts: ${newAttempts}/2`,
                        )
                    }
                    return newAttempts
                })
            }
        }

        document.addEventListener("fullscreenchange", handleFullscreenChange)
        return () =>
            document.removeEventListener(
                "fullscreenchange",
                handleFullscreenChange,
            )
    }, [isRemoved])

    // Show toast when fullscreen is exited
    useEffect(() => {
        if (!isFullscreen && !isRemoved) {
            showToast(
                `Please return to fullscreen mode to continue. Exit attempts: ${exitAttempts}/2`,
            )
        }
    }, [isFullscreen, exitAttempts, isRemoved])

    useEffect(() => {
        if (currentUser.username.length > 0) return
        const username = locationState?.username
        if (username === undefined) {
            navigate("/", {
                state: { roomId },
            })
        } else if (roomId) {
            const user: User = { username, roomId }
            setCurrentUser(user)
            socket.emit(SocketEvent.JOIN_REQUEST, user)
        }
    }, [
        currentUser.username,
        locationState?.username,
        navigate,
        roomId,
        setCurrentUser,
        socket,
    ])

    if (status === USER_STATUS.CONNECTION_FAILED) {
        return <ConnectionStatusPage />
    }

    if (isRemoved) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-red-50 p-4">
                <div className="text-center">
                    <AlertTriangle className="mx-auto mb-4 h-16 w-16 text-red-500" />
                    <h1 className="mb-2 text-2xl font-bold text-red-700">
                        Access Denied
                    </h1>
                    <p className="text-red-600">
                        You have been removed from the room due to multiple
                        fullscreen violations.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <>
            {!isFullscreen && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/30 backdrop-blur-md">
                    <div className="mx-4 max-w-md rounded-lg bg-white p-6 text-center shadow-lg">
                        <Toast
                            isVisible={toast.isVisible}
                            message={toast.message}
                            onClose={hideToast}
                            duration={toast.duration}
                        />
                        <h2 className="mb-4 text-xl font-semibold text-gray-800">
                            Fullscreen Required
                        </h2>
                        <p className="mb-6 text-gray-600">
                            You are currently in{" "}
                            {isFullscreen ? "fullscreen" : "windowed"} mode.
                            Please enter fullscreen mode to continue using the
                            editor.
                        </p>
                        <button
                            onClick={enterFullscreen}
                            className="rounded-lg bg-blue-500 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-600"
                        >
                            Enter Fullscreen Mode
                        </button>
                    </div>
                </div>
            )}

            <SplitterComponent>
                <Sidebar />
                <WorkSpace />
            </SplitterComponent>
        </>
    )
}

export default EditorPage
