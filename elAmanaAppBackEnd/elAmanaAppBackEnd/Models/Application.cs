using System;
using System.Collections.Generic;

namespace elAmanaAppBackEnd.Models
{
    public partial class Application
    {
        public Application()
        {
            Modules = new HashSet<Module>();
        }

        public long AppId { get; set; }
        public string AppLibelle { get; set; } = null!;
        public string? AppDescription { get; set; }
        public bool AppEtat { get; set; }

        public virtual ICollection<Module> Modules { get; set; }
    }
}
