using System;
using System.Collections.Generic;

namespace elAmanaAppBackEnd.Models
{
    public partial class Utilisateur
    {
        public long UtiId { get; set; }
        public string? UtiNomPrenom { get; set; } = null!;
        public string? UtiEmail { get; set; } = null!;
        public string? UtiDescription { get; set; } 
        public string UtiLogin { get; set; } = null!;
        public DateTime UtiDateCreation { get; set; } 
        public bool UtiEtat { get; set; }
        public string UtiMotPasse { get; set; }
        public long UtiRole { get; set; }
        public int UtiNbeEchecAuthentification { get; set; }
        public long UtiTypeUtilisateur { get; set; }
        public long UtiEmpIdDirection { get; set; }
        public int UtiEmpMatricule { get; set; }
        public long UtiAgeIdAgence { get; set; }

        public virtual Agence? UtiAgeIdAgenceNavigation { get; set; }
        public virtual Direction? UtiEmpIdDirectionNavigation { get; set; }
        public virtual Role? UtiRoleNavigation { get; set; } = null!;
    }
}
