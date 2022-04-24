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
    public class ApplicationController : ControllerBase
    {
        private readonly elAmanaAppContext _context;
        public ApplicationController(elAmanaAppContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Application>>> GetApplication()
        {
            return await _context.Applications.ToListAsync();
        }

        [HttpGet("{idApplication}")]
        public async Task<ActionResult<Application>> GetApplicationById(int idApplication)
        {
            var applicationExist = _context.Applications.FirstOrDefault(acc => acc.AppId == idApplication);
            if (applicationExist == null)
            {
                return NotFound();
            }
            return applicationExist;
        }

        private bool ApplicationExist(long id)
        {
            return _context.Applications.Any(u => u.AppId == id);
        }

        [HttpPost]
        public async Task<ActionResult<Application>> PostApplication(Application application)
        {
            var applicationExist = _context.Applications.FirstOrDefault(acc => acc.AppLibelle == application.AppLibelle);
            if (applicationExist != null)
            {
                return BadRequest(new
                {
                    StatusCodes = 404,
                    Message = "  Le libelle de cette application existe deja dans la base de données"
                });
            }
            else
            {
                application.AppEtat = true;
                _context.Applications.Add(application);
                await _context.SaveChangesAsync();
                return CreatedAtAction("PostApplication", new { id = application.AppId }, application);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutApplication(int id, Application application)
        {
            if (id != application.AppId)
            {
                return BadRequest();
            }
            _context.Entry(application).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ApplicationExist(id))
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
        public async Task<IActionResult> RemoveApplication(long id)
        {
            var application = await _context.Applications.FindAsync(id);
            if (application == null)
            {
                return NotFound();
            }
            _context.Applications.Remove(application);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("delete/{id}")]
        public async Task<IActionResult> DeleteApplication(long id)
        {
            var application = _context.Applications.Find(id);

            if (application == null)
            {
                return NotFound();
            }

            if (application != null)
            {
                if (application.AppEtat == true)
                {
                    application.AppEtat = false;
                }
                _context.Entry(application).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ApplicationExist(id))
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
        public ActionResult<Utilisateur> GetApplicationSearch(string? libelle, string? etatInput, string? description)
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
                    condition = condition + " AND app_libelle LIKE '%" + libelle + "%' ";
                }
                if (condition == null)
                {
                    condition = condition + "app_libelle LIKE '%" + libelle + "%' ";
                }
            }
            if (etat != null)
            {
                if (condition != null)
                {
                    condition = condition + " AND app_etat = '" + etat + "' ";
                }
                if (condition == null)
                {
                    condition = condition + "app_etat = '" + etat + "' ";
                }
            }

            if (description != null)
            {
                if (condition != null)
                {
                    condition = condition + " AND app_description = '" + description + "' ";
                }
                if (condition == null)
                {
                    condition = condition + "app_description = '" + description + "' ";
                }
            }

            if (condition != null)
            {
                try
                {
                    //return Ok("SELECT * from dbo.application WHERE " + condition);
                    var result = _context.Applications.FromSqlRaw("SELECT * from dbo.application WHERE "
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
