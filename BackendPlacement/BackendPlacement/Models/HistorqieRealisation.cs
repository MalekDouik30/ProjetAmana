using System.ComponentModel.DataAnnotations;

namespace BackendPlacement.Models
{
    public class HistorqieRealisation
    {
        [Key]
        public long id_histo_rea { get; set; }
        public double montant_depot_histo_rea { get; set; }
        public double profit_histo_rea { get; set; }
        public string annee_histo_rea { get; set; }
        public bool etat_histo_rea { get; set; }

    }
}
