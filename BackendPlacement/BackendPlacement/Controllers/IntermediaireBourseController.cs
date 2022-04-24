using BackendPlacement.Data;
using BackendPlacement.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BackendPlacement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IntermediaireBourseController : ControllerBase
    {
        private readonly SuiviPlacementContext _context;


        public IntermediaireBourseController(SuiviPlacementContext SuiviPlacementContext)
        {
            _context = SuiviPlacementContext;

        }
        [HttpGet("GetIntermediareBourse")]

        public IActionResult GetIntermediareBourse()
        {
            var IntermediareBoursedetails = _context.IntermediaireBourses;
            return Ok(IntermediareBoursedetails);
        }

        [HttpPost]
        public async Task<ActionResult<IntermediaireBourse>> PostIntermediaireBourse(IntermediaireBourse intermedBourse)
        {
            var intermedBourseExist = _context.IntermediaireBourses.FirstOrDefault(acc => acc.inB_id == intermedBourse.inB_id);
            if (intermedBourseExist != null)
            {
                return BadRequest(new
                {
                    StatusCodes = 404,
                    Message = "Le libélle de cet intérmediaire en bourse existe deja dans la base de données"
                });
            }
            else
            {
                _context.IntermediaireBourses.Add(intermedBourse);
                await _context.SaveChangesAsync();
                return CreatedAtAction("PostIntermediaireBourse", new { id = intermedBourse.inB_id }, intermedBourse);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveIntermediaireBourse(long id)
        {
            var intermedBourse = await _context.IntermediaireBourses.FindAsync(id);
            if (intermedBourse == null)
            {
                return NotFound();
            }
            _context.IntermediaireBourses.Remove(intermedBourse);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutIntermediaireBourse(int id, IntermediaireBourse intermedBourse)
        {
            if (id != intermedBourse.inB_id)
            {
                return BadRequest();
            }
            _context.Entry(intermedBourse).State = EntityState.Modified;
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
