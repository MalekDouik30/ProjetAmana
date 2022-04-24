using System.ComponentModel.DataAnnotations;

namespace BackendPlacement.Models
{
    public class ParametresGlobaux
    {
        [Key]
        public long par_id { get; set; }

        public int par_nbrJours { get; set; }

        public string par_email_from { get; set; }
        public string par_email_to { get; set; }
    }
}
