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
    public class RoleApplicationController : ControllerBase
    {
        private readonly elAmanaAppContext _context;

        public RoleApplicationController(elAmanaAppContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoleApplication>>> GetRoleApplication()
        {
            return await _context.RoleApplications.ToListAsync();
        }

        [HttpGet("{idRole}")]
        public async Task<ActionResult<RoleApplication>> GetRoleApplicationByRole(int idRole)
        {
            var roleapplicationExist = _context.RoleApplications.Where(acc => acc.RolId == idRole);
            if (roleapplicationExist == null)
            {
                return NotFound();
            }
            return Ok(roleapplicationExist);
        }

        [HttpPost]
        public async Task<ActionResult<RoleApplication>> PostRoleApplication(RoleApplication roleapplication)
        {
            // Verif if fonction exist in database
            var roleapplicationExist = _context.RoleApplications.FirstOrDefault(acc =>
            acc.RolId == roleapplication.RolId && acc.AppId == roleapplication.AppId);

            //return Ok(roleapplicationExist);
            if (roleapplicationExist != null)
            {
                return BadRequest(new
                {
                    StatusCodes = 404,
                    Message = "L'attribution du rôle et de l'application existe deja dans la base de données"
                });
            }
            else
            {
                _context.RoleApplications.Add(roleapplication);
                await _context.SaveChangesAsync();
                return CreatedAtAction("PostRoleApplication", new { id = roleapplication.AppId, roleapplication.RolId }, roleapplication);
            }
        }

        [HttpDelete("{idRole}/{idApplication}")]
        public async Task<IActionResult> RemoveRoleApplication(int idRole, int idApplication)
        {
            var roleapplicationExist = _context.RoleApplications.FirstOrDefault(acc =>
            acc.RolId == idRole && acc.AppId == idApplication);
            if (roleapplicationExist == null)
            {
                return NotFound();
            }
            _context.RoleApplications.Remove(roleapplicationExist);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
