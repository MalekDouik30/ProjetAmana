using System.ComponentModel.DataAnnotations;

namespace BackendPlacement.Models
{
    public class Organisme
    {
        [Key]
        public long org_id { get; set; }
        public string org_libelle { get; set; }
        //public virtual ICollection<Placement> Placements { get; set; }
    }
}
