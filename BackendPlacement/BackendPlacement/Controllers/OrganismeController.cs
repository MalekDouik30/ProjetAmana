using BackendPlacement.Data;
using BackendPlacement.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BackendPlacement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrganismeController : ControllerBase
    {
        private readonly SuiviPlacementContext _context;


        public OrganismeController(SuiviPlacementContext SuiviPlacementContext)
        {
            _context = SuiviPlacementContext;

        }
        [HttpGet("GetOrganisme")]
        public IActionResult GetOrganisme()
        {
            var organismedetails = _context.Organismes;
            return Ok(organismedetails);
        }

        [HttpPost]
        public async Task<ActionResult<Organisme>> PostOrganisme(Organisme org)
        {

            var orgExist = _context.Organismes.FirstOrDefault(acc => acc.org_libelle == org.org_libelle);
            if (orgExist != null)
            {
                return BadRequest(new
                {
                    StatusCodes = 404,
                    Message = "Le libélle de cette institution financière existe deja dans la base de données"
                });
            }
            else
            {
                _context.Organismes.Add(org);
                await _context.SaveChangesAsync();
                return CreatedAtAction("PostOrganisme", new { id = org.org_id }, org);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveOrganisme(long id)
        {
            var organisme = await _context.Organismes.FindAsync(id);
            if (organisme == null)
            {
                return NotFound();
            }
            _context.Organismes.Remove(organisme);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrganisme(int id, Organisme org)
        {
            if (id != org.org_id)
            {
                return BadRequest();
            }
            _context.Entry(org).State = EntityState.Modified;
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