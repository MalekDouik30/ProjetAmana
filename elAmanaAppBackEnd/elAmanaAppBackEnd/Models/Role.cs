using System;
using System.Collections.Generic;

namespace elAmanaAppBackEnd.Models
{
    public partial class Role
    {
        public Role()
        {
            Utilisateurs = new HashSet<Utilisateur>();
        }

        public long RolId { get; set; }
        public string RolLibelle { get; set; } = null!;
        public string? RolDescription { get; set; }
        public bool RolEtat { get; set; }
        public long? RolIdRoleFonction { get; set; }

        public virtual ICollection<Utilisateur> Utilisateurs { get; set; }
    }
}
