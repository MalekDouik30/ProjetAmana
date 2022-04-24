using BackendPlacement.Data;
using Microsoft.AspNetCore.Mvc;

namespace BackendPlacement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CoNonCoController : ControllerBase
    {
        private readonly SuiviPlacementContext _context;
        public CoNonCoController(SuiviPlacementContext SuiviPlacementContext)
        {
            _context = SuiviPlacementContext;

        }
        [HttpGet("GetCoteeNonCotee")]

        public IActionResult GetCoNoCo()
        {
            var typeCoteedetails = _context.CoteeNonCotees;
            return Ok(typeCoteedetails);
        }
    }
}