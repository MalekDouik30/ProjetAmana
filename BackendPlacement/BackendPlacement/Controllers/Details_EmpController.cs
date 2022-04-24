using BackendPlacement.Data;
using BackendPlacement.Models;
using Microsoft.AspNetCore.Mvc;

namespace BackendPlacement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Details_EmpController : ControllerBase
    {
        private readonly SuiviPlacementContext _context;


        public Details_EmpController(SuiviPlacementContext SuiviPlacementContext)
        {
            _context = SuiviPlacementContext;

        }
        [HttpPost("AjouterDetailsEmprunts")]
        public async Task<IActionResult> AjouterEmprunt(Details_emprunt value)
        {
            _context.Details_Emprunts.Add(value);
            _context.SaveChanges();
            return Ok(new
            {
                StatusCode = 200,
                Message = "Details Emprunts obligataires  ajouté avec succès"
            });
        }

        [HttpGet]
        public IActionResult GetEmprunt()
        {
            var detailEmprunt = _context.Details_Emprunts;
            return Ok(detailEmprunt);
        }
        [HttpGet("DEmpruntCountAndGroupBy")]
        public IActionResult GetDEmpruntCountAndGroupBy()
        {
            var placement = _context.Details_Emprunts.GroupBy(p => p.pla_id)
                            .Select(g => new { IdPlacement = g.Key, NombrePlacements = g.Count() }).ToList();

            return Ok(placement);
        }
    }

}
