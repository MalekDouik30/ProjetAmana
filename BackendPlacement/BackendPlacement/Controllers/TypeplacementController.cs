using BackendPlacement.Data;
using Microsoft.AspNetCore.Mvc;

namespace BackendPlacement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TypeplacementController : ControllerBase
    {
        private readonly SuiviPlacementContext _context;


        public TypeplacementController(SuiviPlacementContext SuiviPlacementContext)
        {
            _context = SuiviPlacementContext;

        }
        [HttpGet("GetTypeplacement")]

        public IActionResult GetTypeplacement()
        {
            var Typeplacementdetails = _context.Typeplacements;
            return Ok(Typeplacementdetails);
        }

    }
}
