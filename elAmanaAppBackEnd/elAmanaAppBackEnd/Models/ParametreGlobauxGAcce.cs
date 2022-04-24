using System;
using System.Collections.Generic;

namespace elAmanaAppBackEnd.Models
{
    public partial class ParametreGlobauxGAcce
    {
        public long ParId { get; set; }
        public string? ParMotPasseDefaut { get; set; }
        public int ParNbeTentativeAuthentification { get; set; }
    }
}
