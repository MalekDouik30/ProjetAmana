using System.ComponentModel.DataAnnotations;

namespace BackendPlacement.Models
{
    public class Delegation
    {
        [Key]
        public long del_id { get; set; }
        public string del_libelle { get; set; }
        //public virtual ICollection<Placement> Placements { get; set; }
    }
}
