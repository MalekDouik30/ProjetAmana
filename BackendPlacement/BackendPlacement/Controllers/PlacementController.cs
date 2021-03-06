using BackendPlacement.Data;
using BackendPlacement.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;


namespace BackendPlacement.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class PlacementController : ControllerBase
    {
        private readonly SuiviPlacementContext _context;


        public PlacementController(SuiviPlacementContext SuiviPlacementContext)
        {
            _context = SuiviPlacementContext;

        }

        [HttpGet("GetNameEntrepriseBourse")]
        public IActionResult GetNameEntrepriseBourse()
        {
            List<string> tableNameEntreprise = new List<string>();

            try
            {
                HtmlAgilityPack.HtmlWeb web = new HtmlAgilityPack.HtmlWeb();
                HtmlAgilityPack.HtmlDocument doc = web.Load("https://www.ilboursa.com/marches/aaz.aspx");

                var NameEntreprisesValues = doc.DocumentNode.SelectNodes(".//td[1]").TakeWhile(tdTag => tdTag.Name == "td");
                foreach (var tdText in NameEntreprisesValues)
                {
                    tableNameEntreprise.Add(tdText.InnerText);
                }
                return Ok(tableNameEntreprise);
            }
            catch (Exception)
            {
                return Ok(tableNameEntreprise);
            }

        }

        [HttpGet("GetScrapPrix/{NomEntreprise}")]
        public IActionResult GetScrapPrix(string NomEntreprise)
        {
            string prixAction;
            HtmlAgilityPack.HtmlWeb web = new HtmlAgilityPack.HtmlWeb();
            HtmlAgilityPack.HtmlDocument doc = web.Load("https://www.ilboursa.com/marches/aaz.aspx");

            var NameEntreprisesValues = doc.DocumentNode.SelectNodes(".//td[1]").TakeWhile(tdTag => tdTag.Name == "td");
            List<string> tableNameEntreprise = new List<string>();
            foreach (var tdText in NameEntreprisesValues)
            {
                tableNameEntreprise.Add(tdText.InnerText);
            }

            var PrixActionValues = doc.DocumentNode.SelectNodes(".//td[7]").TakeWhile(tdTag => tdTag.Name == "td");
            List<string> tablePrixAction = new List<string>();
            foreach (var tdText in PrixActionValues)
            {
                tablePrixAction.Add(tdText.InnerText);
            }

            for (var i = 0; i < tableNameEntreprise.Count; i++)
            {
                if (NomEntreprise == tableNameEntreprise[i])
                {
                    prixAction = tablePrixAction[i];
                    return Ok(prixAction);
                }
            }
            return BadRequest();
        }

        private string VerifPrixEntrepriseCote(string NomEntreprise)
        {
            string prixAction;
            HtmlAgilityPack.HtmlWeb web = new HtmlAgilityPack.HtmlWeb();
            HtmlAgilityPack.HtmlDocument doc = web.Load("0.21");

            var NameEntreprisesValues = doc.DocumentNode.SelectNodes(".//td[1]").TakeWhile(tdTag => tdTag.Name == "td");
            List<string> tableNameEntreprise = new List<string>();
            foreach (var tdText in NameEntreprisesValues)
            {
                tableNameEntreprise.Add(tdText.InnerText);
            }

            var PrixActionValues = doc.DocumentNode.SelectNodes(".//td[7]").TakeWhile(tdTag => tdTag.Name == "td");
            List<string> tablePrixAction = new List<string>();
            foreach (var tdText in PrixActionValues)
            {
                tablePrixAction.Add(tdText.InnerText);
            }

            for (var i = 0; i < tableNameEntreprise.Count; i++)
            {
                if (NomEntreprise == tableNameEntreprise[i])
                {
                    prixAction = tablePrixAction[i];
                    return prixAction;
                }
            }
            return null;
        }

        [HttpPost("AjouterPlacementCapital")]
        public async Task<IActionResult> AjouterPlacement(Placement value)
        {
            _context.Placements.Add(value);
            _context.SaveChanges();
            return Ok(new
            {
                StatusCode = 200,
                Message = "Placement ajouté avec succès"
            });
        }

        [HttpGet("ActionCotee")]
        public async Task<ActionResult<IEnumerable<Placement>>> GetPlacementActionCotee()
        {

            /* Mettre à jour le prix d'une action cotée dans la base de données avant l'affichage des placements*/
            try
            {
                List<string> ListNameEntreprise = new List<string>();
                string prixActionJour;
                var placementCote = _context.Placements.Where(p => p.pla_societe != null);

                foreach (var item in placementCote.ToList())
                {
                    ListNameEntreprise.Add(item.pla_societe);
                }

                foreach (var item in ListNameEntreprise)
                {
                    prixActionJour = VerifPrixEntrepriseCote(item);
                    var placement = _context.Placements.Where(p => p.pla_societe == item).FirstOrDefault();
                    if (placement != null)
                    {
                        // return Ok(prixActionJour);
                        if (prixActionJour != null)
                        {
                            placement.pla_prix_jour = double.Parse(prixActionJour, CultureInfo.InvariantCulture);
                            placement.pla_montant_actualise = double.Parse(prixActionJour, CultureInfo.InvariantCulture) * placement.pla_nbr_action;
                            placement.pla_produits_placement_consommes_date_jour = placement.pla_montant_depot - placement.pla_montant_actualise;

                            _context.Entry(placement).State = EntityState.Modified;
                            await _context.SaveChangesAsync();
                        }
                    }
                }
                /* Affichage palcement */
                return await _context.Placements.ToListAsync();
            }
            catch (Exception ex)
            {
                /*Dans le cas d'une errure dans la mise ajour afficher directement les placements*/
                return await _context.Placements.ToListAsync();

            }

        }

        private int VerifAnneeBissextile()
        {
            var year = DateTime.Now.Year;

            if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0))
            {
                return 366;
            }
            return 365;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Placement>>> GetPlacement()
        {

            _context.Database.ExecuteSqlRaw("EXEC [dbo].[verifDateEchance]"); // verif date echance
            _context.Database.ExecuteSqlRaw("EXEC [dbo].[CalculateCompensation] @nbeJourAnnee = " + VerifAnneeBissextile());

            /*var placement2 = _context.Placements.Where(p => p.pla_etat == "en cours" && DateTime.Now.Year >= p.pla_date_echeance.Year  ).ToListAsync();
            return await placement2;*/

            return await _context.Placements.ToListAsync();
        }


        [HttpGet("GetPlacementByTypeAction")]
        public async Task<ActionResult<IEnumerable<Placement>>> GetPlacementByTypeAction(long? typeAction)
        {
            return await _context.Placements.FromSqlRaw("Select * from placement where pla_id_type_action = " + typeAction).ToListAsync();
        }

        [HttpGet("GetPlacementStatistique")]
        public ActionResult<Placement> GetPlacementStatistique()
        {
            try
            {
                var placement = _context.Placements
                       .Where(p => p.pla_etat == "en cours" || (p.pla_etat == "expire" && DateTime.Now.Year >= p.pla_date_echeance.Year))
                       .GroupBy(p => p.pla_date_echeance.Year)
                       .Select(g => new {
                           AnneEchance = g.Key,
                           SommeMontantPlacement = g.Sum(x => x.pla_montant_depot),
                           NombrePlacements = g.Count(),
                           Annee = g.Max(x => x.pla_date_echeance.Year)
                       }).ToList();

                return Ok(placement);

            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        [HttpGet("DernierTauxPlacementParBanque")]
        public ActionResult<Placement> GetDernierTauxPlacementParBanque()
        {
            /*
              SELECT DISTINCT(p.pla_organisme_societe),p.pla_taux_profit,p.pla_date_souscription,o.org_libelle
              from placement p  
              INNER JOIN organisme o ON o.org_id = p.pla_organisme_societe
              WHERE p.pla_organisme_societe != 0 AND  p.pla_date_souscription IN ( SELECT MAX(pla_date_souscription) as pla_MaxDate
              FROM placement WHERE pla_organisme_societe = p.pla_organisme_societe)
            */
            try
            {
                var placements = _context.Placements.ToList();
                var organismes = _context.Organismes.ToList();
                var placementCandition = _context.Placements
                                                .Where(p => p.pla_organisme_societe != 0)
                                                .GroupBy(p => p.pla_organisme_societe)
                                                .Select(g => new { InstitutionFinanciere = g.Key, date = g.Max(x => x.pla_date_souscription) }).ToList();
                var innerJoinQuery = from t in placementCandition
                                     from p in placements
                                     join o in organismes on p.pla_organisme_societe equals o.org_id
                                     where t.InstitutionFinanciere == p.pla_organisme_societe && t.date == p.pla_date_souscription
                                     select new
                                     {
                                         IdOrganisme = p.pla_organisme_societe,
                                         OrganismeLibelle = o.org_libelle,
                                         tauxProfit = p.pla_taux_profit,
                                         DateSouscription = p.pla_date_souscription
                                     };

                return Ok(innerJoinQuery);
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }


        [HttpGet("GetTotaux")]
        public ActionResult<Placement> GetTotaux()
        {
            // Fonction permettant de calculer le totaux de different colonnes :
            //  1- total Nbre Placement en cours
            //  2- total montant placement global
            //  3- total remuneration date du jour / trimestre comptable / année comptable
            try
            {
                var count = _context.Placements
                                       .Where(p => p.pla_etat == "en cours" || (p.pla_etat == "expire" && DateTime.Now.Year >= p.pla_date_echeance.Year) ).Count();

                var sommeMontantDepot = _context.Placements
                       .Where(p => p.pla_etat == "en cours" || (p.pla_etat == "expire" && DateTime.Now.Year >= p.pla_date_echeance.Year)).Sum(x => x.pla_montant_depot);

                var sommeRemunerationDateJour = _context.Placements
                    .Where(p => p.pla_etat == "en cours" || (p.pla_etat == "expire" && DateTime.Now.Year >= p.pla_date_echeance.Year)).Sum(x => x.pla_produits_placement_consommes_date_jour);

                var sommeRemunerationTrimestre = _context.Placements
                    .Where(p => p.pla_etat == "en cours" || (p.pla_etat == "expire" && DateTime.Now.Year >= p.pla_date_echeance.Year)).Sum(x => x.pla_produits_placement_consommes_trimestre_comptable);

                var sommeRemunerationAnnee = _context.Placements
                    .Where(p => p.pla_etat == "en cours" || (p.pla_etat == "expire" && DateTime.Now.Year >= p.pla_date_echeance.Year)).Sum(x => x.pla_produits_placement_consommes_annee_comptable);

                var totauxPlacement = new { nbreTotalPlacement = count,
                    sommeTotaleMontantDepot = sommeMontantDepot,
                    sommeTotalRemunerationDateJour = sommeRemunerationDateJour,
                    sommeTotalRemunerationTrimestre = sommeRemunerationTrimestre,
                    sommeTotalRemunerationAnnee = sommeRemunerationAnnee,
                };
                return Ok(totauxPlacement);
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        [HttpGet("GetTauxProfitMoyenParBanque")]
        public ActionResult<Placement> GetTauxProfitMoyenParBanque()
        {
            // Fonction permettant de calculer le taux moyen des placements en cours ou arrivés à échéance durant l'année en cours, regroupés par banque.
            try
            {
                var placement = _context.Placements
                                        .Where(p => p.pla_etat == "en cours" || (p.pla_etat == "expire" && DateTime.Now.Year >= p.pla_date_echeance.Year))
                                        .GroupBy(p => p.pla_organisme_societe)
                                        .Select(g => new { IdBanque = g.Key, 
                                            NombrePlacements = g.Count(),
                                            SommetotaleProfit = g.Sum(x => x.pla_taux_profit),
                                            MoyenneTauxProfit = g.Sum(x => x.pla_taux_profit) / g.Count()
                                        }).ToList();
                var organismes = _context.Organismes.ToList();
                var joinPlacementOrganisme = from p in placement
                                             join o in organismes on p.IdBanque equals o.org_id
                                             select new
                                             {
                                                 IdBanque = p.IdBanque,
                                                 NombrePlacements = p.NombrePlacements,
                                                 SommeMontantPlacement = p.SommetotaleProfit,
                                                 MoyenneTauxProfit = p.MoyenneTauxProfit,
                                                 OrganismeLibelle = o.org_libelle
                                             }; 
                return Ok(joinPlacementOrganisme);
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        [HttpGet("GetTotalMontantDepotParBanque")]
        public ActionResult<Placement> GetTotalMontantDepotParBanque()
        {
            // Fonction permettant de calculer la somme du montant depot des placements en cours ou arrivés à échéance durant l'année en cours, regroupés par banque.            try
            try
            {
                var placement = _context.Placements
                                        
                                        .GroupBy(p => p.pla_organisme_societe)
                                        .Select(g => new {
                                            IdBanque = g.Key,
                                            NombrePlacements = g.Count(),
                                            SommeMontantPlacement = g.Sum(x => x.pla_montant_depot),
                                        }).ToList();
                var organismes = _context.Organismes.ToList();
                var joinPlacementOrganisme = from p in placement
                                             join o in organismes on p.IdBanque equals o.org_id
                                             select new
                                             {
                                                 IdBanque = p.IdBanque,
                                                 NombrePlacements = p.NombrePlacements,
                                                 SommeMontantPlacement = p.SommeMontantPlacement,
                                                 OrganismeLibelle = o.org_libelle
                                             };
                return Ok(joinPlacementOrganisme);
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        [HttpGet("GetCountTypePlacement")]
        public ActionResult<Placement> GetCountTypePlacement()
        {
            try
            {
                var placement = _context.Placements.GroupBy(p => p.pla_id_typ_placement)
                                                    .Select(g => new { IdTypePlacement = g.Key, NombrePlacements = g.Count() }).ToList();
                var typePlacement = _context.Typeplacements.ToList();
                var innerJoinQuery = from p in placement
                                     join t in typePlacement on p.IdTypePlacement equals t.typ_pla_id
                                     select new
                                     {
                                         NombrePlacement = p.NombrePlacements,
                                         LibellePlacement = t.typ_pla_libelle
                                     };

                return Ok(innerJoinQuery);
            }
            catch (Exception)
            {
                return BadRequest();
            }

        }

        /*

        [HttpGet("GetTotalPlacement")]
        public ActionResult<Placement> GetTotalPlacement()
        {
            try
            {
                var placement = _context.Placements.ToList();
                var typeFonds = _context.Typefonds.ToList();
                var typeAction = _context.Typeactions.ToList();
                var typePlacement = _context.Typeplacements.ToList();
                var typeSousPlacement = _context.TypeSousplacements.ToList();
                var typeSousSousPlacement = _context.TypeSousSousPlacements.ToList();
                var organisme= _context.Organismes.ToList();

                var innerJoinPlacementFonds = from p in placement join f in typeFonds on p.pla_id_fonds equals f.typ_fon_id
                                     select new{ IdPlacement = p.pla_id, LibellePlacement = f.type_fon_libelle};
                var innerJoinPlacementAction = from p in placement join a in typeAction on p.pla_id_type_action equals a.typ_act_id
                                      select new { IdPlacement = p.pla_id, LibelleAction = a.typ_act_libelle};
                
                var innerJoinPlacementTypePlacement = from p in placement
                                             join t in typePlacement on p.pla_id_typ_placement equals t.typ_pla_id
                                             select new { IdPlacement = p.pla_id, LibelleTypePlacement = t.typ_pla_libelle };

                var innerJoinPlacementTypeSousPlacement= from p in placement
                                                         join ts in typeSousPlacement on p.pla_id_sous_placement equals ts.typ_sous_pla_id
                                                         select new { IdPlacement = p.pla_id, LibelleTypeSousPlacement = ts.typ_sous_pla_libelle };

                var innerJoinPlacementTypeSousSousPlacement = from p in placement
                                                          join tss in typeSousSousPlacement on p.pla_id_sous_placement equals tss.type_s_sous_plac_id
                                                          select new { IdPlacement = p.pla_id, LibelleTypeSousPlacement = tss.type_s_sous_plac_libelle };

                var query = from p in placement
                            join f in typeFonds
                              on p.pla_id_fonds equals f.typ_fon_id
                            join t in typePlacement
                             on p.pla_id_typ_placement equals t.typ_pla_id
                            join a in typeAction 
                             on p.pla_id_type_action equals a.typ_act_id
                            join ts in typeSousPlacement
                             on p.pla_id_sous_placement equals ts.typ_sous_pla_id
                            join tss in typeSousSousPlacement 
                             on p.pla_id_sous_placement equals tss.type_s_sous_plac_id
                            join o in organisme
                             on p.pla_organisme_societe equals o.org_id 
                            select new
                            {
                                IdPlacement = p.pla_id,
                                DateSouscriptionPlacement = p.pla_date_souscription,
                                LibelleFonds = f.type_fon_libelle,
                                LibelleTypePlacement = t.typ_pla_libelle,
                                LibelleAction = a.typ_act_libelle,
                                LibelleTypeSousPlacement = ts.typ_sous_pla_libelle,
                                LibelleOrganisme = o.org_libelle
                            };
                return Ok(query);

            }
            catch (Exception)
            {
                return BadRequest();
            }
        }*/

        private bool PlacementExist(long id)
        {
            return _context.Placements.Any(u => u.pla_id == id);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutPlacement(int id, Placement placement)
        {
            if (id != placement.pla_id)
            {
                return BadRequest();
            }
            _context.Entry(placement).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PlacementExist(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }


        [HttpPut("validate/{id}")]
        public async Task<IActionResult> ValidatePlacement(long id)
        {
            var placement = _context.Placements.Find(id);

            if (placement == null)
            {
                return NotFound();
            }

            if (placement != null)
            {
                if (placement.pla_etat == "non valide")
                {
                    placement.pla_etat = "en cours";
                }
                _context.Entry(placement).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    return NotFound(); 
                }
            }
            return NoContent();
        }



    }

}

