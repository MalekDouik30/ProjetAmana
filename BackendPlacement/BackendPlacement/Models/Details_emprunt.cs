using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendPlacement.Models
{
    public class Details_emprunt
    {
        [Key]
        public long Emp_id { get; set; }
        [ForeignKey("Placement")]
        public long pla_id { get; set; }
       // public virtual Placement Placement { get; set; }

        public double? Emp_PP { get; set; }
        public int? Emp_annee { get; set; }

    }
}
