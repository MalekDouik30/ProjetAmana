using BackendPlacement.Data;
using Microsoft.AspNetCore.Mvc;

namespace BackendPlacement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TypeSousSousplacementController : ControllerBase
    {
        private readonly SuiviPlacementContext _context;


        public TypeSousSousplacementController(SuiviPlacementContext SuiviPlacementContext)
        {
            _context = SuiviPlacementContext;

        }
        [HttpGet("GetTypeSousSousplacement")]

        public IActionResult GetTypeSousSousplacement()
        {
            var TypeSousSousplacementdetails = _context.TypeSousSousPlacements;
            return Ok(TypeSousSousplacementdetails);
        }
    }
}
