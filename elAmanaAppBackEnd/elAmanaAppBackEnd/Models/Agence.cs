using System;
using System.Collections.Generic;

namespace elAmanaAppBackEnd.Models
{
    public partial class Agence
    {
        public Agence()
        {
            Utilisateurs = new HashSet<Utilisateur>();
        }

        public long AgeId { get; set; }
        public int AgeCode { get; set; }
        public string AgeLibelle { get; set; } = null!;
        public int? AgeCodification { get; set; }
        public bool? AgeEtat { get; set; }
        public bool? AgeAffichage { get; set; }



        public virtual ICollection<Utilisateur> Utilisateurs { get; set; }
    }
}
