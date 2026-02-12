import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';

export default function PaymentError() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isVisible, setIsVisible] = useState(false);

    const isCancelled = searchParams.get('payment_cancelled') === 'true';

    useEffect(() => {
        if (isCancelled) {
            setIsVisible(true);
            const timer = setTimeout(() => handleClose(), 8000);
            return () => clearTimeout(timer);
        }
    }, [isCancelled]);

    const handleClose = () => {
        setIsVisible(false);
        searchParams.delete('payment_cancelled');
        setSearchParams(searchParams);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] w-full max-w-md px-4"
                >
                    <div className="bg-[#0a1a14] border border-red-900/50 p-6 shadow-2xl flex items-center gap-6 backdrop-blur-xl">
                        <div className="flex-shrink-0 w-12 h-12 border border-red-500/20 rounded-full flex items-center justify-center text-red-500 text-xl font-serif">
                            !
                        </div>

                        <div className="flex-1">
                            <p className="text-[10px] uppercase tracking-[0.3em] text-red-400 font-black mb-1">
                                Transaction Interrompue
                            </p>
                            <p className="text-white/60 font-serif italic text-sm">
                                "L'alambic n'a pas reçu votre signature. Votre sélection est toujours en attente."
                            </p>
                        </div>

                        <button
                            onClick={handleClose}
                            className="text-white/20 hover:text-white transition-colors text-xl"
                        >
                            &times;
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}