using System;
using System.Collections.Generic;

namespace elAmanaAppBackEnd.Models
{
    public partial class Direction
    {
        public Direction()
        {
            Utilisateurs = new HashSet<Utilisateur>();
        }

        public long DirId { get; set; }
        public long? DirIdUtiulisateurChefHierarchique { get; set; }
        public string? DirMailGroupe { get; set; }
        public string? DirLibelle { get; set; }
        public bool? DirEtat { get; set; }
        public bool? DirAffichage { get; set; }

        public virtual ICollection<Utilisateur> Utilisateurs { get; set; }
    }
}
