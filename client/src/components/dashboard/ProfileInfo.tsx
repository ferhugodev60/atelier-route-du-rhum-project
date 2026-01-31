import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axiosInstance';
import { useAuthStore } from '../../store/authStore';
import { UserProfileUpdate } from '../../types/user';

/**
 * Composant de gestion des informations personnelles
 * Utilise les types centralisés pour éviter les erreurs de propriétés manquantes
 */
export default function ProfileInfo() {
    const { user, setAuth, token } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

    // Initialisation de l'état local avec les données du Store
    const [userData, setUserData] = useState<UserProfileUpdate>({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        phone: user?.phone || ""
    });

    /**
     * Sauvegarde les modifications via l'API et met à jour le Store global
     */
    const handleSave = async () => {
        setLoading(true);
        setStatus(null);

        try {
            // Appel à ton endpoint backend sécurisé
            const response = await api.patch('/users/me', userData);

            // Si le serveur renvoie l'utilisateur mis à jour, on l'injecte dans le Store
            if (user && token) {
                setAuth({ ...user, ...response.data }, token);
            }

            setStatus({ type: 'success', msg: "Profil mis à jour avec succès." });
            setIsEditing(false);
        } catch (err: any) {
            setStatus({
                type: 'error',
                msg: err.response?.data?.error || "Erreur lors de la synchronisation."
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto lg:mx-0">
            <header className="mb-12 flex justify-between items-start">
                <div>
                    <h2 className="text-2xl lg:text-3xl font-serif text-white tracking-tight">Mon Profil</h2>
                    <p className="text-rhum-gold/40 text-[10px] uppercase tracking-[0.3em] mt-2 font-bold">
                        Identifiants pour le retrait à l'Atelier
                    </p>
                </div>

                <button
                    onClick={() => {
                        setIsEditing(!isEditing);
                        setStatus(null);
                    }}
                    className="text-[9px] uppercase tracking-widest text-rhum-gold border border-rhum-gold/20 px-4 py-2 hover:bg-rhum-gold hover:text-rhum-green transition-all font-black rounded-sm"
                >
                    {isEditing ? "Annuler" : "Modifier"}
                </button>
            </header>

            {/* Grille des informations */}
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

            {/* Message de confirmation ou d'erreur */}
            {status && (
                <p className={`mt-8 text-[10px] uppercase tracking-widest ${status.type === 'success' ? 'text-rhum-gold' : 'text-red-400'}`}>
                    {status.msg}
                </p>
            )}

            {/* Bouton de validation dynamique */}
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
                            disabled={loading}
                            className="w-full py-4 bg-rhum-gold text-rhum-green text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl disabled:opacity-50 rounded-sm"
                        >
                            {loading ? "Synchronisation avec l'Atelier..." : "Enregistrer les modifications"}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Footer informatif */}
            <div className="mt-16 p-6 border border-white/5 bg-white/[0.01] rounded-sm">
                <p className="text-[9px] uppercase tracking-widest text-rhum-gold font-black mb-2">Note de sécurité</p>
                <p className="text-xs text-white/40 italic leading-relaxed">
                    Ces informations permettent à notre équipe de vérifier votre identité lors du retrait de vos bouteilles. Veillez à ce qu'elles correspondent à votre pièce d'identité.
                </p>
            </div>
        </div>
    );
}

/**
 * Sous-composant pour un champ du profil
 */
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
            <span className="text-rhum-gold/40 text-[8px] uppercase tracking-[0.4em] font-black">
                {label}
            </span>
            {isEditing ? (
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="bg-transparent text-white font-serif text-lg lg:text-xl tracking-tight outline-none italic border-none p-0 focus:ring-0 w-full"
                    autoFocus={label === "Prénom"}
                />
            ) : (
                <span className="text-white font-serif text-lg lg:text-xl tracking-tight">
                    {value || "Non renseigné"}
                </span>
            )}
        </div>
    );
}