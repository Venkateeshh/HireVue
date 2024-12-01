import illustration from "@/assets/illustration.svg"
import FormComponent from "@/components/forms/FormComponent"
import { motion } from "framer-motion"

function HomePage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-black p-6">
            <div className="container mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-1 items-center gap-12 md:grid-cols-2"
                >
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="flex justify-center"
                    >
                        <img
                            src={illustration}
                            alt="HireVue Illustration"
                            className="w-full max-w-[500px] transition-transform duration-300 ease-in-out hover:scale-105"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-2xl"
                    >
                        <div className="mb-6 text-center">
                            <h1 className="mb-4 text-3xl font-bold text-white">
                                Welcome to HireVue
                            </h1>
                            <p className="mb-6 text-gray-400">
                                Streamline your hiring process with our
                                intuitive platform
                            </p>
                        </div>
                        <FormComponent />
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}

export default HomePage
