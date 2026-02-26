import { useEffect, useState, useMemo } from 'react';
import api from '../../api/axiosInstance';
import { Edit3, Layers } from 'lucide-react';
import EditWorkshopModal from "../../components/admin/EditWorkshopModal.tsx";

export default function AdminWorkshops() {
    const [workshops, setWorkshops] = useState<any[]>([]);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedWorkshop, setSelectedWorkshop] = useState<any>(null);

    const fetchWorkshops = async () => {
        try {
            const res = await api.get('/workshops');
            // On filtre pour ne garder que les 5 niveaux uniques (type PARTICULIER par défaut)
            setWorkshops(res.data);
        } catch (error) {
            console.error("Erreur de synchronisation du registre technique");
        }
    };

    useEffect(() => { fetchWorkshops(); }, []);

    // 🏺 Classement simple par niveau technique
    const sortedWorkshops = useMemo(() => {
        return [...workshops].sort((a, b) => a.level - b.level);
    }, [workshops]);

    const WorkshopEntry = ({ ws }: { ws: any }) => (
        <div className="bg-[#050d0a] border border-white/5 p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between group hover:border-rhum-gold/30 transition-all duration-500 rounded-sm">
            <div className="flex items-center gap-10 flex-1">
                <div className="flex flex-col items-center min-w-[80px]">
                    <span className="text-rhum-gold font-serif text-2xl uppercase leading-none">Niveau</span>
                    <span className="text-rhum-gold font-serif text-5xl leading-none mt-2">{ws.level}</span>
                </div>
                <div className="h-16 w-px bg-white/5 hidden md:block" />
                <div className="space-y-2 flex-1 max-w-xl">
                    <h4 className="text-2xl font-serif text-white uppercase tracking-wide group-hover:text-rhum-gold transition-colors">
                        {ws.title}
                    </h4>
                    <div className="flex items-center gap-4">
                        <p className="text-[10px] text-white/40 uppercase tracking-widest leading-loose">
                            {ws.format}
                        </p>
                        <span className="h-1 w-1 rounded-full bg-white/10" />
                        <p className="text-[10px] uppercase tracking-widest font-bold">
                            <span className="text-white/40">Public :</span> <span className="text-white">{ws.price}€</span>
                            <span className="mx-3 text-white/10">|</span>
                            <span className="text-rhum-gold/60">Pro :</span> <span className="text-rhum-gold">{ws.priceInstitutional}€</span>
                        </p>
                    </div>
                </div>
            </div>
            <div className="mt-8 md:mt-0 flex items-center gap-12 border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-12">
                <button
                    onClick={() => { setSelectedWorkshop(ws); setIsEditOpen(true); }}
                    className="flex items-center gap-3 px-6 py-3 bg-rhum-gold/5 text-rhum-gold text-[9px] uppercase tracking-widest font-black border border-rhum-gold/10 hover:bg-rhum-gold hover:text-rhum-green transition-all rounded-sm"
                >
                    <Edit3 size={14} />
                    Modifier
                </button>
            </div>
        </div>
    );

    return (
        <section className="space-y-16 font-sans pb-20 selection:bg-rhum-gold/30">
            <header className="border-b border-rhum-gold/10 pb-8 flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-serif text-white uppercase tracking-tight">Architecture du Cursus</h2>
                    <p className="text-[10px] text-rhum-gold/50 uppercase tracking-[0.4em] mt-2 font-black">Registre consolidé (5 Niveaux • Double Tarification)</p>
                </div>
            </header>

            <div className="space-y-6">
                <header className="flex items-center gap-6 border-l-2 border-rhum-gold pl-6 mb-10">
                    <Layers className="text-rhum-gold/40" size={24} />
                    <div>
                        <h3 className="text-white text-xl font-serif uppercase tracking-wider">Les Ateliers</h3>
                        <p className="text-[9px] text-rhum-gold/60 uppercase tracking-widest font-bold mt-1">Contrôle des flux Particuliers et Institutionnels</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 gap-6">
                    {sortedWorkshops.map(ws => (
                        <WorkshopEntry key={ws.id} ws={ws} />
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