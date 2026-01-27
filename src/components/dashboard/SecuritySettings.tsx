export default function SecuritySettings() {
    return (
        <div className="max-w-2xl mx-auto lg:mx-0">
            {/* EN-TÊTE : Aligné sur ProfileInfo et OrderHistory */}
            <header className="mb-12">
                <h2 className="text-2xl lg:text-3xl font-serif text-white">
                    Modifier votre mot de passe
                </h2>
                <p className="text-rhum-gold/40 text-[10px] uppercase tracking-[0.3em] mt-2 font-bold">
                    Modifiez vos identifiants d'accès secrets.
                </p>
            </header>

            {/* FORMULAIRE : Utilise le gap-y de ProfileInfo */}
            <form className="space-y-10 max-w-lg">
                <div className="flex flex-col gap-2 border-b border-white/5 pb-4">
                    <label className="text-rhum-gold/40 text-[8px] uppercase tracking-[0.4em] font-black">
                        Mot de passe actuel
                    </label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-transparent text-white font-serif text-lg lg:text-xl tracking-tight outline-none italic placeholder:opacity-20"
                    />
                </div>

                <div className="flex flex-col gap-2 border-b border-white/5 pb-4">
                    <label className="text-rhum-gold/40 text-[8px] uppercase tracking-[0.4em] font-black">
                        Nouveau mot de passe
                    </label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-transparent text-white font-serif text-lg lg:text-xl tracking-tight outline-none italic placeholder:opacity-20"
                    />
                </div>

                {/* BOUTON D'ACTION */}
                <div className="pt-6">
                    <button className="w-full py-5 bg-rhum-gold text-rhum-green font-black uppercase tracking-widest text-[10px] hover:bg-white transition-all shadow-xl rounded-sm">
                        Mettre à jour les scellés
                    </button>
                </div>
            </form>
        </div>
    );
}