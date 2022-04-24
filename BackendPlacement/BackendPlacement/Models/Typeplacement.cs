using System.ComponentModel.DataAnnotations;

namespace BackendPlacement.Models
{
    public class Typeplacement
    {
        [Key]
        public long typ_pla_id { get; set; }
        public string typ_pla_libelle { get; set; }
        //public virtual ICollection<Placement> Placements { get; set; }
    }
}
