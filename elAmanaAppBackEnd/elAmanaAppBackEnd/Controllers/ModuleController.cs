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
    public class ModuleController : ControllerBase
    {
        private readonly elAmanaAppContext _context;
        public ModuleController(elAmanaAppContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Module>>> GetModule()
        {
            return await _context.Modules.ToListAsync();
        }

        [HttpGet("{idModule}")]
        public async Task<ActionResult<Module>> GetModuleId(int idModule)
        {
            var moduleExist = _context.Modules.FirstOrDefault(acc => acc.ModId == idModule);
            if (moduleExist == null)
            {
                return NotFound();
            }
            return moduleExist;
        }
        private bool ModuleExist(long id)
        {
            return _context.Modules.Any(u => u.ModId == id);
        }

        [HttpPost]
        public async Task<ActionResult<Module>> PostModule(Module module)
        {
            var moduleExist = _context.Modules.FirstOrDefault(acc => acc.ModLibelle == module.ModLibelle);
            if (moduleExist != null)
            {
                return BadRequest(new
                {
                    StatusCodes = 404,
                    Message = "  Le libelle de ce module existe déja dans la base de données"
                });
            }
            else
            {
                module.ModEtat = true;
                _context.Modules.Add(module);
                await _context.SaveChangesAsync();
                return CreatedAtAction("PostModule", new { id = module.ModId }, module);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutModule(int id, Module module)
        {
            if (id != module.ModId)
            {
                return BadRequest();
            }
            _context.Entry(module).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ModuleExist(id))
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
        public async Task<IActionResult> RemoveModule(long id)
        {
            var module = await _context.Modules.FindAsync(id);
            if (module == null)
            {
                return NotFound();
            }
            _context.Modules.Remove(module);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("delete/{id}")]
        public async Task<IActionResult> DeleteModule(long id)
        {
            var module = _context.Modules.Find(id);

            if (module == null)
            {
                return NotFound();
            }

            if (module != null)
            {
                if (module.ModEtat == true)
                {
                    module.ModEtat = false;
                }
                _context.Entry(module).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ModuleExist(id))
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
        public ActionResult<Utilisateur> GetModuleSearch(string? libelle, string? etatInput, string? description, string? applicationId)
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
                    condition = condition + " AND mod_libelle LIKE '%" + libelle + "%' ";
                }
                if (condition == null)
                {
                    condition = condition + "mod_libelle LIKE '%" + libelle + "%' ";
                }
            }
            if (etat != null)
            {
                if (condition != null)
                {
                    condition = condition + " AND mod_etat = '" + etat + "' ";
                }
                if (condition == null)
                {
                    condition = condition + "mod_etat = '" + etat + "' ";
                }
            }

            if (description != null)
            {
                if (condition != null)
                {
                    condition = condition + " AND mod_description = '" + description + "' ";
                }
                if (condition == null)
                {
                    condition = condition + "mod_description = '" + description + "' ";
                }
            }

            if (applicationId != null)
            {
                if (condition != null)
                {
                    condition = condition + " AND mod_application = '" + applicationId + "' ";
                }
                if (condition == null)
                {
                    condition = condition + "mod_application = '" + applicationId + "' ";
                }
            }

            if (condition != null)
            {
                try
                {
                    //return Ok("SELECT * from dbo.module WHERE " + condition);
                    var result = _context.Modules.FromSqlRaw("SELECT * from dbo.module WHERE "
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
