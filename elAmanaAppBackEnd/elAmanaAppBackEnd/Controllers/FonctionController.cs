using elAmanaAppBackEnd.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace elAmanaAppBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FonctionController : ControllerBase
    {
        private readonly elAmanaAppContext _context;
        public FonctionController(elAmanaAppContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Fonction>>> GetFonction()
        {
            return await _context.Fonctions.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Fonction>> GetFonction(long id)
        {
            var fonction = await _context.Fonctions.FindAsync(id);
            if (fonction == null)
            {
                return NotFound();
            }
            return fonction;
        }

        [HttpPost]
        public async Task<ActionResult<Fonction>> PostFonction(Fonction fonction)
        {
            // Verif if fonction exist in database
            var fonctionExist = _context.Fonctions.FirstOrDefault(acc => acc.FonLibelle == fonction.FonLibelle);
            if (fonctionExist != null)
            {
                return BadRequest(new
                {
                    StatusCodes = 404,
                    Message = " Le nom de cette fonction existe deja dans la base de données"
                });
            }
            else
            {
                fonction.FonEtat = true;
                _context.Fonctions.Add(fonction);
                await _context.SaveChangesAsync();
                return CreatedAtAction("PostFonction", new { id = fonction.FonId }, fonction);
            }
        }
        private bool FonctionExist(long id)
        {
            return _context.Fonctions.Any(u => u.FonId == id);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutFonction(int id, Fonction fonction)
        {
            if (id != fonction.FonId)
            {
                return BadRequest();
            }

            _context.Entry(fonction).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FonctionExist(id))
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
        public async Task<IActionResult> RemoveFonction(long id)
        {
            var fonction = await _context.Fonctions.FindAsync(id);
            if (fonction == null)
            {
                return NotFound();
            }
            _context.Fonctions.Remove(fonction);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("delete/{id}")]
        public async Task<IActionResult> DeleteFonction(long id)
        {
            var fonction = _context.Fonctions.Find(id);

            if (fonction == null)
            {
                return NotFound();
            }

            if (fonction != null)
            {
                if (fonction.FonEtat == true)
                {
                    fonction.FonEtat = false;
                }
                _context.Entry(fonction).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!FonctionExist(id))
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

        [HttpGet("searchs")]
        public ActionResult<Fonction> GetFonctionSearch(string? nom, string? description, string? etatInput, string? module)
        {
            bool? etat = null;
            string condition = null;

            if (etatInput == "true")
            {
                etat = true;
            }

            if (etatInput == "false")
            {
                etat = false;
            }

            if (nom != null)
            {
                if (condition != null)
                {
                    condition = condition + " AND fon_libelle LIKE '%" + nom + "%' ";
                }
                if (condition == null)
                {
                    condition = condition + "fon_libelle LIKE '%" + nom + "%' ";
                }

            }
            if (description != null)
            {
                if (condition != null)
                {
                    condition = condition + " AND fon_description LIKE '%" + description + "%' ";
                }
                if (condition == null)
                {
                    condition = condition + "fon_description LIKE '%" + description + "%' ";
                }
            }

            if (module != null)
            {
                if (condition != null)
                {
                    condition = condition + " AND fon_id_module LIKE '%" + module + "%' ";
                }
                if (condition == null)
                {
                    condition = condition + "fon_id_module LIKE '%" + module + "%' ";
                }
            }

            if (etat != null)
            {
                if (condition != null)
                {
                    condition = condition + " AND fon_etat = '" + etat + "' ";
                }
                if (condition == null)
                {
                    condition = condition + "fon_etat = '" + etat + "' ";
                }

            }
            if (condition != null)
            {
                try
                {
                    var result = _context.Fonctions.FromSqlRaw("SELECT * from dbo.fonction WHERE " + condition).ToList();
                    return Ok(result);
                }
                catch (Exception)
                {
                    return BadRequest();
                }
            }
            return NotFound();
        }





    }
}
