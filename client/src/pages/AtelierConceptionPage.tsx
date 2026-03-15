import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, Lock, ShieldAlert, Clock, Flame, ArrowRight } from 'lucide-react';
import api from '../api/axiosInstance';
import { Workshop } from '../types/workshop';
import { useAuthStore } from '../store/authStore';

export default function AtelierConceptionPage() {
    const [workshops, setWorkshops] = useState<Workshop[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuthStore();
    const navigate = useNavigate();

    const currentLevel = user?.conceptionLevel ?? 0;

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchWorkshops = async () => {
            try {
                const { data } = await api.get('/workshops');
                setWorkshops(data.filter((w: Workshop) => w.level > 0).sort((a: any, b: any) => a.level - b.level));
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchWorkshops();
    }, []);

    if (loading) return <div className="min-h-screen bg-[#0a1a14]" />;

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-[#0a1a14] pt-32 md:pt-48 pb-32 px-4 md:px-8 font-sans selection:bg-rhum-gold/30"
        >
            <div className="max-w-6xl mx-auto">
                <header className="text-center mb-20 md:mb-32">
                    <h1 className="text-4xl md:text-7xl font-serif text-white uppercase mb-8 tracking-tighter">
                        Atelier <span className="text-rhum-gold">Conception</span>
                    </h1>
                    <div className="w-24 h-px bg-rhum-gold/30 mx-auto mb-8" />
                    <p className="text-white/80 text-[11px] md:text-xs uppercase tracking-[0.3em] font-bold max-w-2xl mx-auto leading-relaxed">
                        L'art de l'assemblage est un cheminement. Franchissez chaque palier technique pour sceller votre maîtrise.
                    </p>
                </header>

                <div className="relative space-y-12 md:space-y-24">
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5 hidden lg:block -translate-x-1/2" />

                    {workshops.map((step, index) => {
                        const isMastered = step.level <= currentLevel;
                        const isLocked = step.level > currentLevel + 1;
                        const isEven = index % 2 === 0;

                        return (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                className={`relative flex flex-col items-center ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 md:gap-16 ${isLocked ? 'grayscale' : ''}`}
                            >
                                {/* 🏺 LE CERCLE DE NIVEAU */}
                                <div className="relative z-20 shrink-0">
                                    <div
                                        className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center border-2 transition-all duration-700 backdrop-blur-md
                                            ${isMastered ? 'border-rhum-gold shadow-[0_0_40px_rgba(197,158,95,0.2)]' :
                                            isLocked ? 'border-white/10' : 'border-white'}`}
                                        style={{
                                            backgroundColor: isMastered
                                                ? 'rgba(197, 158, 95, 0.2)'
                                                : (isLocked ? 'transparent' : `${step.color}40`)
                                        }}
                                    >
                                        {isMastered ? (
                                            <Check className="text-rhum-gold" size={28} />
                                        ) : isLocked ? (
                                            <Lock className="text-white/20" size={20} />
                                        ) : (
                                            <span className="text-white font-serif text-3xl md:text-4xl leading-none flex items-center justify-center translate-y-[1px]">
                                                {step.level}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* 🏺 LA CARTE IMMERSIVE */}
                                <div className={`w-full lg:w-1/2 group relative overflow-hidden rounded-sm border border-white/10 shadow-2xl transition-all duration-500 ${isLocked ? 'grayscale' : 'hover:border-rhum-gold/40'}`}>

                                    <div className="absolute inset-0 z-0">
                                        <img
                                            src={step.image}
                                            alt={step.title}
                                            className={`w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 ${isLocked ? 'brightness-[0.4]' : ''}`}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1a14] via-[#0a1a14]/90 to-transparent" />
                                    </div>

                                    <div className="relative z-10 p-8 md:p-12 min-h-[350px] md:min-h-[400px] flex flex-col justify-between">
                                        <div className="space-y-4">
                                            <h3 className={`text-3xl md:text-5xl font-serif uppercase tracking-tighter leading-none ${isLocked ? 'text-white/40' : 'text-white'}`}>
                                                {step.title}
                                            </h3>
                                            <p className="text-rhum-gold font-serif italic text-lg md:text-xl">
                                                {isLocked ? "Contenu verrouillé" : `"${step.quote}"`}
                                            </p>
                                        </div>

                                        {!isLocked && (
                                            <div className="space-y-8">
                                                <div className="flex flex-wrap gap-6 pt-6">
                                                    <div className="flex items-center gap-2">
                                                        <Clock size={14} className="text-rhum-gold" />
                                                        <span className="text-[10px] text-white font-black uppercase tracking-widest">{step.duration || "2h30"}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Flame size={14} className="text-rhum-gold" />
                                                        <span className="text-[10px] text-white font-black uppercase tracking-widest">Niveau {step.level}</span>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => navigate(`/ateliers/${step.id}`)}
                                                    className="w-full md:w-auto px-10 py-5 bg-rhum-gold text-rhum-green text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-white transition-all group/btn"
                                                >
                                                    {isMastered ? 'Réserver à nouveau' : 'En savoir plus'}
                                                    <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                                </button>
                                            </div>
                                        )}

                                        {isLocked && (
                                            <div className="flex items-center gap-3 text-white/60 mt-auto"> {/* 🏺 Opacité passée de 20 à 60 */}
                                                <Lock size={12} className="text-rhum-gold/50" />
                                                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Validation du niveau précédent requise</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="hidden lg:block lg:w-1/2" />
                            </motion.div>
                        );
                    })}
                </div>

                {/* --- 🏺 FOOTER INFO --- */}
                <div className="mt-40 flex flex-col md:flex-row items-center gap-10 bg-white/[0.02] p-8 md:p-12 border border-white/5 rounded-sm">
                    <div className="w-16 h-16 rounded-full border border-rhum-gold/20 flex items-center justify-center shrink-0">
                        <ShieldAlert className="text-rhum-gold" size={28} />
                    </div>
                    <div className="space-y-3 text-center md:text-left">
                        <h4 className="text-rhum-gold text-[10px] font-black uppercase tracking-[0.4em]">Note de Synchronisation</h4>
                        <p className="text-[11px] text-white/50 font-medium leading-relaxed uppercase tracking-widest">
                            Si vous avez validé des formations avant l'ouverture du site, contactez l'Établissement pour synchroniser votre Registre.
                        </p>
                    </div>
                </div>
            </div>
        </motion.main>
    );
}