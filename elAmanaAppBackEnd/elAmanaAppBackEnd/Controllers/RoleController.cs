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
    public class RoleController : ControllerBase
    {
        private readonly elAmanaAppContext _context;
        public RoleController(elAmanaAppContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Role>>> GetRole()
        {
            return await _context.Roles.ToListAsync();
        }
        [HttpGet("{idRole}")]
        public async Task<ActionResult<Role>> GetRolById(int idRole)
        {
            var roleExist = _context.Roles.FirstOrDefault(acc => acc.RolId == idRole);
            if (roleExist == null)
            {
                return NotFound();
            }
            return roleExist;
        }

        [HttpPost]
        public async Task<ActionResult<Role>> PostRole(Role role)
        {
            // Verif if fonction exist in database
            var fonctionExist = _context.Roles.FirstOrDefault(acc => acc.RolLibelle == role.RolLibelle);
            if (fonctionExist != null)
            {
                return BadRequest(new
                {
                    StatusCodes = 404,
                    Message = "  Le nom de ce role existe deja dans la base de données"
                });
            }
            else
            {
                // Add Role
                // Role takes false by default
                role.RolEtat = true;
                _context.Roles.Add(role);
                await _context.SaveChangesAsync();
                return CreatedAtAction("PostRole", new { id = role.RolId }, role);
            }
        }
        private bool RoleExist(long id)
        {
            return _context.Roles.Any(u => u.RolId == id);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutRole(int id, Role role)
        {
            if (id != role.RolId)
            {
                return BadRequest();
            }
            _context.Entry(role).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RoleExist(id))
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
        public async Task<IActionResult> RemoveRole(long id)
        {
            var role = await _context.Roles.FindAsync(id);
            if (role == null)
            {
                return NotFound();
            }
            _context.Roles.Remove(role);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("delete/{id}")]
        public async Task<IActionResult> DeleteRole(long id)
        {
            var role = _context.Roles.Find(id);
            if (role == null)
            {
                return NotFound();
            }
            if (role != null)
            {
                if (role.RolEtat == true)
                {
                    role.RolEtat = false;
                }
                _context.Entry(role).State = EntityState.Modified;
                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!RoleExist(id))
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
        public ActionResult<Utilisateur> GetRoleSearch(string? libelle, string? description ,string? etatInput)
        {
            bool? etat = null;
            string? condition = null;

            if (etatInput == "true")
            {
                etat = true;
            }

            if (etatInput == "false")
            {
                etat = false;
            }

            if (libelle != null)
            {
                if (condition != null)
                {
                    condition = condition + " AND rol_libelle LIKE '%" + libelle + "%' ";
                }
                if (condition == null)
                {
                    condition = condition + "rol_libelle LIKE '%" + libelle + "%' ";
                }
            }
            if (etat != null)
            {
                if (condition != null)
                {
                    condition = condition + " AND rol_etat = '" + etat + "' ";
                }
                if (condition == null)
                {
                    condition = condition + "rol_etat = '" + etat + "' ";
                }
            }

            if (description != null)
            {
                if (condition != null)
                {
                    condition = condition + " AND rol_description = '" + description + "' ";
                }
                if (condition == null)
                {
                    condition = condition + "rol_description = '" + description + "' ";
                }
            }

            if (condition != null)
            {
                try
                {
                    //return Ok("SELECT * from dbo.application WHERE " + condition);
                    var result = _context.Roles.FromSqlRaw("SELECT * from dbo.role WHERE "
                       + condition).ToList();
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
