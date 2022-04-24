using BackendPlacement.Data;
using BackendPlacement.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BackendPlacement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ParametreGlobauxController : Controller
    {

        private readonly SuiviPlacementContext _context;
        public ParametreGlobauxController(SuiviPlacementContext SuiviPlacementContext)
        {
            _context = SuiviPlacementContext;

        }
        /*
        [HttpPost("Add")]
        public async Task<IActionResult> Add( MailRequest request)
        {
            if (_context.MailRequests.Count() >= 1)
            {
                return BadRequest(new
                {
                    StatusCodes = 404,
                    Message = "La liste des paramètres globaux ne doit pas contenir plus d'un paramètre"
                });
            }
            _context.MailRequests.Add(request);
            await _context.SaveChangesAsync();
            return CreatedAtAction("PostParametre", new { id = request.par_id }, request);

           


        }
        */
        [HttpGet("GetParametre")]
        public async Task<ActionResult<IEnumerable<ParametresGlobaux>>> GetParametre()
        {
            return await _context.parametresGlobauxes.ToListAsync();
        }
        /*
        [HttpPost("Send")]
         public async Task<IActionResult> Send()
         {
            MailRequest mail = new MailRequest();
            int param_nbrejours = _context.parametresGlobauxes.Select(u => u.par_nbrJours).SingleOrDefault();
            string param_mail_to = _context.parametresGlobauxes.Select(u => u.par_email_to).SingleOrDefault();

            mail.par_email= param_mail_to;
            //return Ok(param_mail_to);

            
            await mailService.SendEmailAsync(mail);
            return Ok();
            


        }
        private bool ParametreExists(int id)
        {
            return _context.parametresGlobauxes.Any(u => u.par_id == id);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> PutParametre(int id, ParametresGlobaux param)
        {
            if (id != param.par_id)
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
        }*/


    }
}
