using System.ComponentModel.DataAnnotations;

namespace BackendPlacement.Models
{
    public class TypeSousplacement
    {
        [Key]
        public long typ_sous_pla_id { get; set; }
        public string typ_sous_pla_libelle { get; set; }
        //public virtual ICollection<Placement> Placements { get; set; }
    }
}
