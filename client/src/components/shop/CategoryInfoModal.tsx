import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface CategoryInfoModalProps {
    category: any;
    onClose: () => void;
}

export default function CategoryInfoModal({ category, onClose }: CategoryInfoModalProps) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 font-sans">
            {/* Overlay sombre */}
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/95 backdrop-blur-md"
                onClick={onClose}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative bg-[#050d0a] border border-white/5 w-full max-w-2xl overflow-hidden shadow-2xl rounded-sm"
            >
                {/* Image de la Collection */}
                <div className="h-64 w-full relative">
                    <img
                        src={category.image || '/placeholder-collection.jpg'}
                        alt={category.name}
                        className="w-full h-full object-cover hover:grayscale-0 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050d0a] to-transparent" />
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-rhum-gold transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Contenu textuel */}
                <div className="p-10 space-y-6">
                    <header>
                        <p className="text-rhum-gold text-[10px] uppercase tracking-[0.4em] mb-2 font-black">Collection</p>
                        <h2 className="text-3xl font-serif text-white uppercase tracking-tight">{category.name}</h2>
                    </header>

                    <p className="text-rhum-cream/60 text-sm leading-relaxed italic font-serif">
                        "{category.description || "Aucune description enregistrée dans le Registre."}"
                    </p>

                    <div className="pt-6 border-t border-white/5">
                        <button
                            onClick={onClose}
                            className="w-full py-4 bg-rhum-gold/10 text-rhum-gold border border-rhum-gold/20 text-[10px] uppercase tracking-widest font-black hover:bg-rhum-gold hover:text-rhum-green transition-all"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}