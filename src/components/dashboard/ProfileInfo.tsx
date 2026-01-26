import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ProfileInfo() {
    const [isEditing, setIsEditing] = useState(false);

    // Simulation de données (à relier plus tard à ton AuthContext ou API)
    const [userData, setUserData] = useState({
        firstName: "Hugo",
        lastName: "Frr",
        email: "hugo@exemple.com",
        phone: "06 12 34 56 78",
        address: "12 Rue de l'Alchimie, 75001 Paris"
    });

    return (
        <div className="space-y-12">
            <header className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-serif text-white">Profil de l'Alchimiste</h2>
                    <p className="text-white/40 text-xs mt-1 italic">Gérez vos informations personnelles et de livraison.</p>
                </div>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-[10px] uppercase tracking-[0.2em] text-rhum-gold border border-rhum-gold/30 px-4 py-2 hover:bg-rhum-gold hover:text-rhum-green transition-all font-bold"
                >
                    {isEditing ? "Annuler" : "Modifier"}
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {/* IDENTITÉ */}
                <InfoField
                    label="Prénom"
                    value={userData.firstName}
                    isEditing={isEditing}
                    onChange={(val) => setUserData({...userData, firstName: val})}
                />
                <InfoField
                    label="Nom"
                    value={userData.lastName}
                    isEditing={isEditing}
                    onChange={(val) => setUserData({...userData, lastName: val})}
                />

                {/* CONTACT */}
                <InfoField
                    label="Email"
                    value={userData.email}
                    isEditing={false} // L'email n'est généralement pas modifiable directement pour la sécurité
                />
                <InfoField
                    label="Téléphone"
                    value={userData.phone}
                    isEditing={isEditing}
                    onChange={(val) => setUserData({...userData, phone: val})}
                />

                {/* ADRESSE (Pleine largeur) */}
                <div className="md:col-span-2">
                    <InfoField
                        label="Adresse de Livraison"
                        value={userData.address}
                        isEditing={isEditing}
                        onChange={(val) => setUserData({...userData, address: val})}
                    />
                </div>
            </div>

            {isEditing && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pt-6 border-t border-white/5 flex justify-end"
                >
                    <button className="bg-rhum-gold text-rhum-green px-10 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-2xl">
                        Enregistrer les changements
                    </button>
                </motion.div>
            )}
        </div>
    );
}

// --- SOUS-COMPOSANT INTERNE POUR LES CHAMPS ---

interface InfoFieldProps {
    label: string;
    value: string;
    isEditing: boolean;
    onChange?: (val: string) => void;
}

function InfoField({ label, value, isEditing, onChange }: InfoFieldProps) {
    return (
        <div className="space-y-2 group">
            <label className="text-[9px] uppercase tracking-[0.3em] text-rhum-gold/40 font-bold group-hover:text-rhum-gold transition-colors">
                {label}
            </label>

            {isEditing ? (
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    className="w-full bg-white/[0.05] border-b border-rhum-gold/30 p-3 text-sm text-white outline-none focus:border-rhum-gold transition-all"
                />
            ) : (
                <p className="text-white font-serif text-lg py-2 border-b border-white/5">
                    {value || "—"}
                </p>
            )}
        </div>
    );
}