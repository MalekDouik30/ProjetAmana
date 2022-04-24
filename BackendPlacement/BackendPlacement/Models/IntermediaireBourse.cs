using System.ComponentModel.DataAnnotations;

namespace BackendPlacement.Models
{
    public class IntermediaireBourse
    {
        [Key]
        public long inB_id { get; set; }
        public string inB_libelle { get; set; }
    }
}
