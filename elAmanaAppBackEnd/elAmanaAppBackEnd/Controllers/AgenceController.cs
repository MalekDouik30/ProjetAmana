using elAmanaAppBackEnd.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace elAmanaAppBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AgenceController : ControllerBase
    {
        private readonly elAmanaAppContext _context;
        public AgenceController(elAmanaAppContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Agence>>> GetAgence()
        {
            return await _context.Agences.ToListAsync();
        }

        [HttpGet("{idAgence}")]
        public async Task<ActionResult<Agence>> GetAgenceById(int idAgence)
        {
            var AgenceExist = _context.Agences.FirstOrDefault(acc => acc.AgeId == idAgence);
            if (AgenceExist == null)
            {
                return NotFound();
            }
            return AgenceExist;
        }

        [HttpPost]
        public async Task<ActionResult<Agence>> PostAgence(Agence agence)
        {
            var agenceExist = _context.Agences.FirstOrDefault(acc => acc.AgeLibelle == agence.AgeLibelle);
            var agenceExist2 = _context.Agences.FirstOrDefault(acc => acc.AgeCode == agence.AgeCode);

            if (agenceExist != null)
            {
                return BadRequest(new
                {
                    StatusCodes = 404,
                    Message = "  Le nom de cette agence existe deja dans la base de données"
                });
            }
            if (agenceExist2 != null)
            {
                return BadRequest(new
                {
                    StatusCodes = 404,
                    Message = "  Le code de cette agence existe deja dans la base de données il est attribué à l'agence "+ agenceExist2.AgeLibelle
                });
            }
            else
            {
                agence.AgeEtat = true;
                agence.AgeAffichage = true;
                _context.Agences.Add(agence);
                await _context.SaveChangesAsync();
                return CreatedAtAction("PostAgence", new { id = agence.AgeId }, agence);
            }
        }
        private bool AgenceExist(long id)
        {
            return _context.Agences.Any(u => u.AgeId == id);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutAgence(int id, Agence agence)
        {
            if (id != agence.AgeId)
            {
                return BadRequest();
            }
            _context.Entry(agence).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AgenceExist(id))
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

        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveAgence(long id)
        {
            var agence = await _context.Agences.FindAsync(id);
            if (agence == null)
            {
                return NotFound();
            }
            _context.Agences.Remove(agence);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("delete/{id}")]
        public async Task<IActionResult> DeleteAgence(long id)
        {
            var agence = _context.Agences.Find(id);

            if (agence == null)
            {
                return NotFound();
            }

            if (agence != null)
            {
                if (agence.AgeEtat == true)
                {
                    agence.AgeEtat = false;
                }
                _context.Entry(agence).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!AgenceExist(id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
            }
            return NoContent();
        }





    }
}
