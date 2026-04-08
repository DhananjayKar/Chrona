import { motion } from "framer-motion";

export default function Confirm ({ open, taskCount, onConfirm, onCancel }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <motion.div initial = {{ scale: 0.9, opacity: 1 }}
            animate = {{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 w-[320px] shadow-xl text-center" >
                <div className="flex justify-center mb-4" >
                    <div className="bg-blue-100 p-3 rounded-full" >
                        ⚠️
                    </div>
                </div>
                <h2 className="text-xl font-semibold mb-2">Are you sure to import ${taskCount} tasks?</h2>
                <p className="text-gray-500 text-sm mb-6">
                    This action can't be undone.
                    Please confirm if you want to proceed.
                </p>
                <div className="flex justify-between gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 border border-gray-400 rounded-lg py-2"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        className="flex-1 bg-blue-500 text-white rounded-lg py-2"
                    >
                        Confirm
                    </button>
                </div>
            </motion.div>
        </div>
    )
}