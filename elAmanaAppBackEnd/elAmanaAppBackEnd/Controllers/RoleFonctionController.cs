using Microsoft.AspNetCore.Mvc;
using elAmanaAppBackEnd.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace elAmanaAppBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleFonctionController : ControllerBase
    {
        private readonly elAmanaAppContext _context;

        public RoleFonctionController(elAmanaAppContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoleFonction>>> GetRoleFonction()
        {
            return await _context.RoleFonctions.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<RoleFonction>> PostRoleFonction(RoleFonction rolefonction)
        {
            // Verif if fonction exist in database
            var rolefonctionExist = _context.RoleFonctions.FirstOrDefault(acc =>
            acc.RolId == rolefonction.RolId && acc.FonId == rolefonction.FonId);

            if (rolefonctionExist != null)
            {
                return BadRequest(new
                {
                    StatusCodes = 404,
                    Message = "L'attribution du rôle et de la fonction existe deja dans la base de données"
                });
            }
            else
            {
                _context.RoleFonctions.Add(rolefonction);
                await _context.SaveChangesAsync();
                return CreatedAtAction("PostRoleFonction", new { id = rolefonction.FonId }, rolefonction);
            }
        }
        [HttpGet("{idRole}")]
        public async Task<ActionResult<RoleFonction>> GetRoleFonctionByRole(int idRole)
        {
            var rolefonctionExist = _context.RoleFonctions.Where(acc => acc.RolId == idRole);
            if (rolefonctionExist == null)
            {
                return NotFound();
            }
            return Ok(rolefonctionExist);
        }

        [HttpDelete("{idRole}/{idFonction}")]
        public async Task<IActionResult> RemoveRoleFonction(int idRole, int idFonction)
        {
            var rolefonctionExist = _context.RoleFonctions.FirstOrDefault(acc =>
            acc.RolId == idRole && acc.FonId == idFonction);
            if (rolefonctionExist == null)
            {
                return NotFound();
            }
            _context.RoleFonctions.Remove(rolefonctionExist);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("{idRole}/{idFonction}")]
        public async Task<ActionResult<RoleFonction>> VerifRoleFonction(long idRole, long idFonction)
        {
            var rolefonctionExist = _context.RoleFonctions.Where(acc => acc.RolId == idRole && acc.FonId == idFonction);
            if (rolefonctionExist != null)
            {
                return Ok(rolefonctionExist);
            }
            return NotFound();
        }


    }
}
