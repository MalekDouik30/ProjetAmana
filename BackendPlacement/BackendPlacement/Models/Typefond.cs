using System.ComponentModel.DataAnnotations;

namespace BackendPlacement.Models
{
    public class Typefond
    {
        [Key]
        public long typ_fon_id { get; set; }
        public string type_fon_libelle { get; set; }
        //public virtual ICollection<Placement> Placements { get; set; }

    }
}
