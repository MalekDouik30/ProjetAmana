using System.ComponentModel.DataAnnotations;

namespace BackendPlacement.Models
{
    public class Typeaction
    {
        [Key]
        public long typ_act_id { get; set; }
        public string typ_act_libelle { get; set; }
        //public virtual ICollection<Placement> Placements { get; set; }
    }
}
