using System.ComponentModel.DataAnnotations;

namespace BackendPlacement.Models
{
    public class CoteeNonCotee
    {
        [Key]
        public long CoNoCo_id { get; set; }
        public string CoNoCo_libelle { get; set; }
        //public virtual ICollection<Placement> Placements { get; set; }
    }
}
