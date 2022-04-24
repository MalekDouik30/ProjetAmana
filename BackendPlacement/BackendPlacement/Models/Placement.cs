using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendPlacement.Models
{
    public class Placement
    {
        [Key]
        public long pla_id { get; set; }
        [ForeignKey("Typeplacement")]
        public long pla_id_typ_placement { get; set; }
        public virtual Typeplacement? Typeplacement { get; set; }

        [ForeignKey("Typefond")]
        public long pla_id_fonds { get; set; }
        public virtual Typefond? Typefond { get; set; }

        [ForeignKey("TypeSousplacement")]
        public long pla_id_sous_placement { get; set; }
        public virtual TypeSousplacement? TypeSousplacement { get; set; }

        [ForeignKey("TypeSousSousPlacement")]
        public long pla_id_sous_sous_placement { get; set; }
        public virtual TypeSousSousPlacement? TypeSousSousPlacement { get; set; }

        [ForeignKey("Organisme")]
        public long pla_id_type_action { get; set; }
        public virtual Typeaction? Typeaction { get; set; }
        [ForeignKey("Typeaction")]
        public long pla_organisme_societe { get; set; }
        public virtual Organisme? Organisme { get; set; }
        public string? pla_societe { get; set; }
        public double? pla_montant_depot { get; set; }
        public double? pla_taux_profit { get; set; }
        public DateTime pla_date_souscription { get; set; }
        public DateTime pla_date_echeance { get; set; }
        public int? pla_duree { get; set; }
        public int? pla_taux_retenue { get; set; }
        public int? pla_action_cotee { get; set; }
        public int? pla_nbr_action { get; set; }
        public double? pla_prix_achat { get; set; }
        public double? pla_prix_jour { get; set; }
        public double? pla_montant_actualise { get; set; }
        public double? pla_value_consome_date_jour { get; set; }
        public double? pla_value_consome_trimestre_comptable { get; set; }
        public int? pla_Vliqui { get; set; }

        public double? pla_value_consome_annee_comptable { get; set; }

        public double? pla_produits_placement_consommes_date_jour { get; set; }
        public double? pla_produits_placement_consommes_trimestre_comptable { get; set; }
        public double? pla_produits_placement_consommes_annee_comptable { get; set; }
        public int? taux_moudharba { get; set; }

       // public double? pla_prix_Aqui { get; set; }
        public double? pla_mont_inve { get; set; }
        public long? pla_delegation { get; set; }
        public long? pla_interB { get; set; }
        public int? pla_mois { get; set; }
        public double? pla_produits_placement_consommes_ech_final { get; set; }
        public string? pla_etat { get; set; }
        public double? pla_montant_rachat { get; set; }
        public double? pla_montant_avant_rachat { get; set; }
        public int? pla_nbre_action_gratuite { get; set; }
        public int? pla_emprunt_hypothese_2 { get; set; }

    }
}
