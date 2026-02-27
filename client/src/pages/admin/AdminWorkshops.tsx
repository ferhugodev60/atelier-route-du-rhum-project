import { useEffect, useState, useMemo } from 'react';
import api from '../../api/axiosInstance';
import { Edit3, ShieldCheck, Banknote } from 'lucide-react';
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
            console.error("Erreur de synchronisation du registre technique.");
        }
    };

    useEffect(() => { fetchWorkshops(); }, []);

    const sortedWorkshops = useMemo(() => {
        return [...workshops].sort((a, b) => a.level - b.level);
    }, [workshops]);

    const WorkshopEntry = ({ ws }: { ws: any }) => (
        /* 🏺 Carte Blanche Haute Visibilité */
        <div className="bg-white border-2 border-slate-200 p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between group hover:border-emerald-500 hover:shadow-xl transition-all duration-300 rounded-3xl">
            <div className="flex items-center gap-10 flex-1">
                {/* 🏺 Indicateur de Palier Emerald & Black */}
                <div className="flex flex-col items-center min-w-[100px] bg-emerald-50 py-4 rounded-2xl border border-emerald-100">
                    <span className="text-emerald-700 font-black text-xs uppercase tracking-tighter">Niveau</span>
                    <span className="text-slate-950 font-black text-6xl leading-none mt-1">{ws.level}</span>
                </div>

                <div className="h-20 w-1 bg-slate-100 hidden md:block rounded-full" />

                <div className="space-y-3 flex-1 max-w-xl">
                    <h4 className="text-3xl font-black text-black uppercase tracking-tighter group-hover:text-emerald-700 transition-colors">
                        {ws.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2 bg-slate-900 text-white px-3 py-1 rounded-lg">
                            <ShieldCheck size={12} />
                            <p className="text-[10px] uppercase font-black tracking-widest">{ws.format}</p>
                        </div>
                        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-1.5 rounded-xl">
                            <Banknote size={14} className="text-emerald-600" />
                            <p className="text-[11px] uppercase tracking-tighter font-black">
                                <span className="text-slate-500">Public :</span> <span className="text-black">{ws.price}€</span>
                                <span className="mx-3 text-slate-300">|</span>
                                <span className="text-emerald-700">Offre Pro :</span> <span className="text-emerald-800">{ws.priceInstitutional}€</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 md:mt-0 flex items-center border-t md:border-t-0 md:border-l-2 border-slate-100 pt-6 md:pt-0 md:pl-10">
                <button
                    onClick={() => { setSelectedWorkshop(ws); setIsEditOpen(true); }}
                    className="flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white text-[11px] uppercase tracking-widest font-black shadow-lg shadow-emerald-900/20 hover:bg-black transition-all rounded-2xl"
                >
                    <Edit3 size={16} strokeWidth={3} />
                    Modifier
                </button>
            </div>
        </div>
    );

    return (
        <section className="space-y-12 font-sans pb-20 selection:bg-emerald-100">
            {/* --- EN-TÊTE DE DIRECTION --- */}
            <header className="border-b-4 border-slate-100 pb-8 flex justify-between items-center">
                <div>
                    <h2 className="text-4xl font-black text-black tracking-tighter">Architecture des ateliers</h2>
                </div>
            </header>

            <div className="space-y-8">
                <div className="grid grid-cols-1 gap-8">
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