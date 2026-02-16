import { useEffect, useState, useMemo } from 'react';
import api from '../../api/axiosInstance';
import { Edit3, GraduationCap, Compass } from 'lucide-react';
import EditWorkshopModal from "../../components/admin/EditWorkshopModal.tsx";

export default function AdminWorkshops() {
    const [workshops, setWorkshops] = useState<any[]>([]);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedWorkshop, setSelectedWorkshop] = useState<any>(null);

    const fetchWorkshops = async () => {
        try {
            const res = await api.get('/workshops');
            setWorkshops(res.data);
        } catch (error) {
            console.error("Erreur de synchronisation du cursus");
        }
    };

    useEffect(() => { fetchWorkshops(); }, []);

    // 🏺 Classification institutionnelle des séances [cite: 2026-02-12]
    const { discovery, conception } = useMemo(() => {
        return {
            discovery: workshops.find(ws => ws.level === 0 || ws.title.toLowerCase().includes('initiation')),
            conception: workshops.filter(ws => ws.level > 0 && !ws.title.toLowerCase().includes('initiation'))
        };
    }, [workshops]);

    return (
        <section className="space-y-20 font-sans pb-20">
            <header className="border-b border-rhum-gold/10 pb-8">
                <h2 className="text-3xl font-serif text-white uppercase tracking-tight">Gestion des Ateliers</h2>
                <p className="text-[10px] text-rhum-gold/50 uppercase tracking-[0.4em] mt-2 font-black">Architecture du cursus technique</p>
            </header>

            {/* --- SECTION 1 : SÉANCE D'INITIATION --- */}
            {discovery && (
                <div className="space-y-8">
                    <div className="flex items-center gap-4">
                        <Compass className="text-rhum-gold/40" size={18} />
                        <h3 className="text-rhum-gold text-[10px] uppercase tracking-[0.4em] font-black">L'atelier découverte</h3>
                    </div>

                    <div className="relative bg-[#0a1a14] border border-rhum-gold/20 p-8 md:p-12 flex flex-col lg:flex-row gap-12 items-center overflow-hidden group">
                        <div className="relative w-full lg:w-1/3 aspect-square overflow-hidden border border-white/5 shadow-2xl">
                            <img src={discovery.image} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" alt="Initiation" />
                        </div>

                        <div className="flex-1 space-y-6">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <h4 className="text-4xl font-serif text-white uppercase tracking-tighter">{discovery.title}</h4>
                                    <p className="text-[11px] text-rhum-gold uppercase tracking-[0.3em] font-bold">{discovery.format}</p>
                                </div>
                                <button
                                    onClick={() => { setSelectedWorkshop(discovery); setIsEditOpen(true); }}
                                    className="p-4 bg-rhum-gold/5 text-rhum-gold hover:bg-rhum-gold hover:text-rhum-green transition-all rounded-full border border-rhum-gold/10"
                                >
                                    <Edit3 size={20} />
                                </button>
                            </div>
                            <p className="text-sm text-rhum-cream/60 leading-relaxed italic max-w-2xl">"{discovery.quote}"</p>
                            <div className="pt-8 flex gap-12 border-t border-white/5 items-center">
                                <div className="space-y-1 text-right">
                                    <p className="text-[8px] text-white/20 uppercase font-black">Tarification</p>
                                    <p className="text-rhum-gold font-serif text-lg">{discovery.price}€ <span className="text-[10px] opacity-40">/ pers.</span></p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className="text-[8px] text-white/20 uppercase font-black">Disponibilités</p>
                                    <p className="text-white/60 text-xs uppercase tracking-widest">{discovery.availability}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- SECTION 2 : CURSUS DE CONCEPTION TECHNIQUE --- */}
            <div className="space-y-10">
                <div className="flex items-center gap-4">
                    <GraduationCap className="text-rhum-gold/40" size={18} />
                    <h3 className="text-rhum-gold text-[10px] uppercase tracking-[0.4em] font-black">Les ateliers conception</h3>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {conception.sort((a, b) => a.level - b.level).map((ws) => (
                        <div
                            key={ws.id}
                            className="bg-[#050d0a] border border-white/5 p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between group hover:border-rhum-gold/30 transition-all duration-500"
                        >
                            <div className="flex items-center gap-10 flex-1">
                                <div className="flex flex-col items-center min-w-[80px]">
                                    <span className="text-rhum-gold font-serif text-2xl uppercase leading-none">Palier</span>
                                    <span className="text-rhum-gold font-serif text-5xl leading-none mt-2">{ws.level}</span>
                                </div>

                                <div className="h-16 w-px bg-white/5 hidden md:block" />

                                <div className="space-y-2 flex-1 max-w-xl">
                                    <h4 className="text-2xl font-serif text-white uppercase tracking-wide group-hover:text-rhum-gold transition-colors">
                                        {ws.title}
                                    </h4>
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest leading-loose">
                                        {ws.format} • {ws.description.split('.')[0]}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8 md:mt-0 flex items-center gap-12 border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-12">
                                <div className="text-right">
                                    <p className="text-white font-serif text-lg tracking-tight">Prix : {ws.price}€</p>
                                    <p className="text-[9px] text-rhum-gold/40 uppercase tracking-[0.2em] mt-1 font-black">{ws.availability || 'Sur Calendrier'}</p>
                                </div>
                                <button
                                    onClick={() => { setSelectedWorkshop(ws); setIsEditOpen(true); }}
                                    className="p-3 text-rhum-gold/70 hover:text-rhum-gold transition-colors"
                                >
                                    <Edit3 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <EditWorkshopModal
                isOpen={isEditOpen}
                workshop={selectedWorkshop}
                onClose={() => setIsEditOpen(false)}
                onRefresh={fetchWorkshops}
            />
        </section>
    );
}