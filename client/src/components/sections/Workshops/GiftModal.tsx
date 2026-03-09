import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * 🏺 MODALE DE SCELLAGE DE TITRE DE CURSUS
 * Design aligné sur le protocole de réservation : Sombre, Institutionnel, Plein Écran.
 */

interface GiftModalProps {
    onClose: () => void;
    onConfirm: (amount: number) => void;
}

export default function GiftModal({ onClose, onConfirm }: GiftModalProps) {
    const [amount, setAmount] = useState<number>(50);
    const presets = [50, 100, 150, 250];

    // 🏺 Verrouillage du scroll système
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden font-sans">
            {/* Overlay sombre avec flou artistique */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/98 backdrop-blur-md"
                onClick={onClose}
            />

            {/* Conteneur de Prestige */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-[#0a1a14] w-full max-w-xl h-[85vh] md:h-auto flex flex-col border border-white/5 shadow-2xl rounded-sm"
            >
                <div className="p-8 md:p-16 flex-1 flex flex-col justify-center text-center">
                    <p className="text-rhum-gold text-[10px] uppercase tracking-[0.4em] mb-4 font-black">
                        Valeur du Titre au Porteur
                    </p>
                    <h5 className="text-3xl md:text-4xl font-serif text-white mb-12 uppercase tracking-tighter">
                        Carte Cadeau
                    </h5>

                    {/* Affichage du Montant (Style Volume) */}
                    <div className="flex items-center justify-center gap-4 mb-12">
                        <span className="text-white text-7xl md:text-8xl font-serif tabular-nums">
                            {amount}
                        </span>
                        <span className="text-rhum-gold text-4xl font-serif">€</span>
                    </div>

                    {/* Paliers Prédéfinis (Style Onglets) */}
                    <div className="grid grid-cols-4 gap-2 mb-12">
                        {presets.map((p) => (
                            <button
                                key={p}
                                onClick={() => setAmount(p)}
                                className={`py-3 text-[10px] font-black border transition-all duration-300 ${
                                    amount === p
                                        ? 'bg-rhum-gold text-rhum-green border-rhum-gold'
                                        : 'border-white/10 text-white/40 hover:border-rhum-gold hover:text-rhum-gold'
                                }`}
                            >
                                {p}€
                            </button>
                        ))}
                    </div>

                    {/* Saisie Libre (Subtile) */}
                    <div className="mb-16 relative max-w-[200px] mx-auto">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Math.max(1, Number(e.target.value)))}
                            className="w-full bg-transparent border-b border-white/10 text-white py-2 text-center text-lg outline-none focus:border-rhum-gold transition-colors font-bold"
                            placeholder="AUTRE MONTANT"
                        />
                        <span className="absolute -top-4 left-0 w-full text-[7px] text-rhum-gold/50 font-black uppercase tracking-[0.2em]">Saisie libre</span>
                    </div>

                    {/* Actions de Scellage */}
                    <div className="space-y-4">
                        <button
                            onClick={() => onConfirm(amount)}
                            className="w-full bg-rhum-gold text-rhum-green py-5 font-black uppercase tracking-[0.3em] text-[11px] rounded-sm hover:bg-white transition-all shadow-xl"
                        >
                            Ajouter au Panier
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full py-2 text-white/20 uppercase text-[8px] tracking-[0.3em] font-bold hover:text-white transition-colors"
                        >
                            Annuler
                        </button>
                    </div>
                </div>

                {/* Note Institutionnelle de Bas de Page */}
                <div className="p-6 border-t border-white/5 text-center">
                    <p className="text-[8px] text-white/20 font-bold uppercase tracking-[0.2em]">
                        Validité : 12 mois à après l'achat
                    </p>
                </div>
            </motion.div>
        </div>,
        document.body
    );
}