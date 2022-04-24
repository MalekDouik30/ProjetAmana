using BackendPlacement.Data;
using Microsoft.AspNetCore.Mvc;

namespace BackendPlacement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TypesousplacementController : ControllerBase
    {
        private readonly SuiviPlacementContext _context;


        public TypesousplacementController(SuiviPlacementContext SuiviPlacementContext)
        {
            _context = SuiviPlacementContext;

        }
        [HttpGet("GetTypesousplacement")]

        public IActionResult GetTypesousplacement()
        {
            var Typesousplacementdetails = _context.TypeSousplacements;
            return Ok(Typesousplacementdetails);
        }
    }
}
