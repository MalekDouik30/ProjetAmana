using System;
using System.Collections.Generic;

namespace elAmanaAppBackEnd.Models
{
    public partial class Fonction
    {
        public long FonId { get; set; }
        public string FonLibelle { get; set; } = null!;
        public string? FonDescription { get; set; }
        public bool FonEtat { get; set; }
        public long FonIdModule { get; set; }

       // public virtual Module FonIdModuleNavigation { get; set; } = null!;
    }
}
