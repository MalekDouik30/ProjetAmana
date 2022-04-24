using elAmanaAppBackEnd.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace elAmanaAppBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ParametreGlobeauController : ControllerBase
    {
        private readonly elAmanaAppContext _context;

        public ParametreGlobeauController(elAmanaAppContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ParametreGlobauxGAcce>>> GetParametre()
        {
            return await _context.ParametreGlobauxGAcces.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<ParametreGlobauxGAcce>> PostParametre(ParametreGlobauxGAcce parametre)
        {
            if (_context.ParametreGlobauxGAcces.Count() >= 1)
            {
                return BadRequest(new
                {
                    StatusCodes = 404,
                    Message = "La liste des paramètres globaux ne doit pas contenir plus d'un paramètre"
                });
            }
            _context.ParametreGlobauxGAcces.Add(parametre);
            await _context.SaveChangesAsync();
            return CreatedAtAction("PostParametre", new { id = parametre.ParId }, parametre);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveParametre(long id)
        {
            var parametre = await _context.ParametreGlobauxGAcces.FindAsync(id);
            if (parametre == null)
            {
                return NotFound();
            }
            _context.ParametreGlobauxGAcces.Remove(parametre);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool ParametreExists(int id)
        {
            return _context.ParametreGlobauxGAcces.Any(u => u.ParId == id);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutParametre(int id, ParametreGlobauxGAcce param)
        {
            if (id != param.ParId)
            {
                return BadRequest();
            }
            _context.Entry(param).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ParametreExists(id))
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

    }
}
