using BackendPlacement.Data;
using BackendPlacement.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BackendPlacement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HistoriqueRealisationController : ControllerBase
    {
        private readonly SuiviPlacementContext _context;
        public HistoriqueRealisationController(SuiviPlacementContext SuiviPlacementContext)
        {
            _context = SuiviPlacementContext;
        }
        [HttpGet]
        public IActionResult GetHistoriqueRealisation()
        {
            try
            {
                var IntermediareBoursedetails = _context.historqieRealisations;
                return Ok(IntermediareBoursedetails);
            }
            catch
            {
                throw;
            }
        }

        [HttpPost]
        public async Task<ActionResult<HistorqieRealisation>> PostHistorqieRealisation(HistorqieRealisation histo)
        {
            var histoExist = _context.historqieRealisations.FirstOrDefault(acc => acc.annee_histo_rea == histo.annee_histo_rea);
            if (histoExist != null)
            {
                return BadRequest(new
                {
                    StatusCodes = 404,
                    Message = "L'année "+ histo.annee_histo_rea + " existe déja dans la base de données."
                });
            }
            else
            {
                _context.historqieRealisations.Add(histo);
                await _context.SaveChangesAsync();
                return CreatedAtAction("PostHistorqieRealisation", new { id = histo.id_histo_rea }, histo);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutHistorqieRealisation(int id, HistorqieRealisation histo)
        {
            if (id != histo.id_histo_rea)
            {
                return BadRequest();
            }
            _context.Entry(histo).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                return NotFound();
            }

        }



    }
}
