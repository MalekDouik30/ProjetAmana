using System.ComponentModel.DataAnnotations;

namespace BackendPlacement.Models
{
    public class TypeSousSousPlacement
    {
        [Key]
        public long type_s_sous_plac_id { get; set; }
        public string type_s_sous_plac_libelle { get; set; }
        //public virtual ICollection<Placement> Placements { get; set; }
    }
}
