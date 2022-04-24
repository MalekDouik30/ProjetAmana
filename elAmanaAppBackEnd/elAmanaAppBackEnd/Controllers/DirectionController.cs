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
    public class DirectionController : ControllerBase
    {
        private readonly elAmanaAppContext _context;
        public DirectionController(elAmanaAppContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Direction>>> GetDirection()
        {
            return await _context.Directions.ToListAsync();
        }

        [HttpGet("{idDirection}")]
        public async Task<ActionResult<Direction>> GetDirectionById(int idDirection)
        {
            var DirectionExist = _context.Directions.FirstOrDefault(acc => acc.DirId == idDirection);
            if (DirectionExist == null)
            {
                return NotFound();
            }
            return DirectionExist;
        }

        [HttpPost]
        public async Task<ActionResult<Direction>> PostDirection(Direction direction)
        {
            var directionExist = _context.Directions.FirstOrDefault(acc => acc.DirLibelle == direction.DirLibelle);
            if (directionExist != null)
            {
                return BadRequest(new
                {
                    StatusCodes = 404,
                    Message = "  Le nom de cette direction existe deja dans la base de données"
                });
            }
            else
            {
                direction.DirEtat = true;
                direction.DirAffichage = true;
                _context.Directions.Add(direction);
                await _context.SaveChangesAsync();
                return CreatedAtAction("PostDirection", new { id = direction.DirId }, direction);
            }
        }
        private bool DirectionExist(long id)
        {
            return _context.Directions.Any(u => u.DirId == id);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutDirection(int id, Direction direction)
        {
            if (id != direction.DirId)
            {
                return BadRequest();
            }
            _context.Entry(direction).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DirectionExist(id))
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
        public async Task<IActionResult> RemoveDirection(long id)
        {
            var direction = await _context.Directions.FindAsync(id);
            if (direction == null)
            {
                return NotFound();
            }
            _context.Directions.Remove(direction);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("delete/{id}")]
        public async Task<IActionResult> DeleteDirection(long id)
        {
            var direction = _context.Directions.Find(id);

            if (direction == null)
            {
                return NotFound();
            }

            if (direction != null)
            {
                if (direction.DirEtat == true)
                {
                    direction.DirEtat = false;
                }
                _context.Entry(direction).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!DirectionExist(id))
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

    }
}
