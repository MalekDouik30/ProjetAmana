using System;
using System.Collections.Generic;

namespace elAmanaAppBackEnd.Models
{
    public partial class Module
    {
        public Module()
        {
           // Fonctions = new HashSet<Fonction>();
        }

        public long ModId { get; set; }
        public string ModLibelle { get; set; } = null!;
        public string? ModDescription { get; set; }
        public bool ModEtat { get; set; }
        public long ModApplication { get; set; }

        public virtual Application? ModApplicationNavigation { get; set; } = null!;
        //public virtual ICollection<Fonction> Fonctions { get; set; }
    }
}
