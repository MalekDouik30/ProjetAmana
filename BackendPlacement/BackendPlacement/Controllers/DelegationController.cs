using BackendPlacement.Data;
using BackendPlacement.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BackendPlacement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DelegationController : ControllerBase
    {
        private readonly SuiviPlacementContext _context;


        public DelegationController(SuiviPlacementContext SuiviPlacementContext)
        {
            _context = SuiviPlacementContext;

        }
        [HttpGet("GetDelegation")]

        public IActionResult GetDelegation()
        {
            var Delegationdetails = _context.Delegations;
            return Ok(Delegationdetails);
        }
        [HttpPost]
        public async Task<ActionResult<Delegation>> PostDelegation(Delegation delegation)
        {
            var delegationExist = _context.Delegations.FirstOrDefault(acc => acc.del_id == delegation.del_id);
            if (delegationExist != null)
            {
                return BadRequest(new
                {
                    StatusCodes = 404,
                    Message = "Le libélle de cette delegation existe deja dans la base de données"
                });
            }
            else
            {
                _context.Delegations.Add(delegation);
                await _context.SaveChangesAsync();
                return CreatedAtAction("PostDelegation", new { id = delegation.del_id }, delegation);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveDelegation(long id)
        {
            var delegation = await _context.Delegations.FindAsync(id);
            if (delegation == null)
            {
                return NotFound();
            }
            _context.Delegations.Remove(delegation);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutDelegation(int id, Delegation delegation)
        {
            if (id != delegation.del_id)
            {
                return BadRequest();
            }
            _context.Entry(delegation).State = EntityState.Modified;
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
