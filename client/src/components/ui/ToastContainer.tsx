import { motion, AnimatePresence } from 'framer-motion';
import { useToastStore } from '../../store/toastStore';

export default function ToastContainer() {
    const toasts = useToastStore(state => state.toasts);

    return (
        <div className="fixed top-8 right-8 z-[300] flex flex-col gap-4 pointer-events-none font-sans">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        className="pointer-events-auto bg-[#0a1a14] border border-rhum-gold/30 p-4 min-w-[300px] shadow-2xl backdrop-blur-xl flex items-center gap-4 rounded-sm"
                    >
                        {/* Point pulsant Or institutionnel */}
                        <div className={`w-2 h-2 rounded-full animate-pulse ${
                            toast.type === 'error' ? 'bg-red-500' : 'bg-rhum-gold'
                        }`} />

                        <p className="text-[10px] uppercase tracking-[0.2em] font-black text-rhum-cream">
                            {toast.message}
                        </p>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}