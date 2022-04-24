using BackendPlacement.Data;
using Microsoft.AspNetCore.Mvc;

namespace BackendPlacement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TypeActionController : ControllerBase
    {
        private readonly SuiviPlacementContext _context;


        public TypeActionController(SuiviPlacementContext SuiviPlacementContext)
        {
            _context = SuiviPlacementContext;

        }
        [HttpGet("GetTypeAction")]

        public IActionResult GetTypeAction()
        {
            var typesactionsdetails = _context.Typeactions;
            return Ok(typesactionsdetails);
        }

    }
}
