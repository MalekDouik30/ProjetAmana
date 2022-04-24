using elAmanaAppBackEnd.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace elAmanaAppBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TypeUtilisateurController : ControllerBase
    {
        private readonly elAmanaAppContext _context;
        public TypeUtilisateurController(elAmanaAppContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TypeUtilisateur>>> GetTypeUtilisateur()
        {
            return await _context.TypeUtilisateurs.ToListAsync();
        }

    }
}
