export default function SecuritySettings() {
    return (
        <div className="max-w-md space-y-10">
            <header>
                <h2 className="text-2xl font-serif text-white">Modifier votre mot de passe</h2>
                <p className="text-white/40 text-xs mt-1 italic">Modifiez vos identifiants d'accès secrets.</p>
            </header>

            <form className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-[0.2em] text-rhum-gold font-bold">Mot de passe actuel</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-white/[0.03] border-b border-white/10 p-4 text-white focus:border-rhum-gold outline-none transition-all" />
                </div>
                <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-[0.2em] text-rhum-gold font-bold">Nouveau mot de passe</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-white/[0.03] border-b border-white/10 p-4 text-white focus:border-rhum-gold outline-none transition-all" />
                </div>
                <button className="w-full py-5 bg-rhum-gold text-rhum-green font-black uppercase tracking-widest text-[10px] hover:bg-white transition-all shadow-xl">
                    Mettre à jour
                </button>
            </form>
        </div>
    );
}