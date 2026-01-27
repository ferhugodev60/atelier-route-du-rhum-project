import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

export default function ProfileInfo() {
    // ÉTATS POUR LA MODIFICATION
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState<UserProfile>({
        firstName: "Hugo",
        lastName: "Frr",
        email: "hugo@exemple.com",
        phone: "06 12 34 56 78"
    });

    const handleSave = () => {
        setIsEditing(false);
        // Ici, vous pourrez ajouter la logique de synchronisation avec une API
    };

    return (
        <div className="max-w-2xl mx-auto lg:mx-0">
            <header className="mb-12 flex justify-between items-start">
                <div>
                    <h2 className="text-2xl lg:text-3xl font-serif text-white">Mon Profil</h2>
                    <p className="text-rhum-gold/40 text-[10px] uppercase tracking-[0.3em] mt-2 font-bold">Identifiants pour le retrait</p>
                </div>

                {/* BOUTON DE BASCULE */}
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-[9px] uppercase tracking-widest text-rhum-gold border border-rhum-gold/20 px-4 py-2 hover:bg-rhum-gold hover:text-rhum-green transition-all font-black"
                >
                    {isEditing ? "Annuler" : "Modifier"}
                </button>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-12">
                <ProfileItem
                    label="Prénom"
                    value={userData.firstName}
                    isEditing={isEditing}
                    onChange={(val) => setUserData({...userData, firstName: val})}
                />
                <ProfileItem
                    label="Nom"
                    value={userData.lastName}
                    isEditing={isEditing}
                    onChange={(val) => setUserData({...userData, lastName: val})}
                />
                <ProfileItem
                    label="Adresse Email"
                    value={userData.email}
                    isEditing={isEditing}
                    onChange={(val) => setUserData({...userData, email: val})}
                />
                <ProfileItem
                    label="Téléphone"
                    value={userData.phone}
                    isEditing={isEditing}
                    onChange={(val) => setUserData({...userData, phone: val})}
                />
            </div>

            {/* BOUTON DE SAUVEGARDE */}
            <AnimatePresence>
                {isEditing && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="mt-12"
                    >
                        <button
                            onClick={handleSave}
                            className="w-full py-4 bg-rhum-gold text-rhum-green text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl"
                        >
                            Enregistrer les modifications
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mt-16 p-6 border border-white/5 bg-white/[0.01] rounded-sm">
                <p className="text-[9px] uppercase tracking-widest text-rhum-gold font-black mb-2">Note Importante</p>
                <p className="text-xs text-white/40 italic leading-relaxed">
                    Ces informations permettent à notre équipe de vérifier votre identité lors du retrait de vos bouteilles à l'Atelier, ainsi que pour votre participation à nos ateliers.
                </p>
            </div>
        </div>
    );
}

// COMPOSANT INTERNE MIS À JOUR
function ProfileItem({
                         label,
                         value,
                         isEditing,
                         onChange
                     }: {
    label: string,
    value: string,
    isEditing: boolean,
    onChange: (val: string) => void
}) {
    return (
        <div className="flex flex-col gap-2 border-b border-white/5 pb-4">
            <span className="text-rhum-gold/40 text-[8px] uppercase tracking-[0.4em] font-black">{label}</span>
            {isEditing ? (
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="bg-transparent text-white font-serif text-lg lg:text-xl tracking-tight outline-none italic border-none p-0 focus:ring-0"
                    autoFocus={label === "Prénom"}
                />
            ) : (
                <span className="text-white font-serif text-lg lg:text-xl tracking-tight">{value}</span>
            )}
        </div>
    );
}