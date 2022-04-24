using elAmanaAppBackEnd.Models;
using Microsoft.AspNetCore.Mvc;

using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// JWT
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
// Hasing Password with BCrypt 
using BCrypt.Net;
using System.Globalization;
using System.Diagnostics;
using Microsoft.AspNetCore.Authorization;
using elAmanaAppBackEnd.Helpers;
using System;

namespace elAmanaAppBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UtilisateurController : ControllerBase
    {
        private readonly elAmanaAppContext _context;
        public HashPassword hpwd = new HashPassword();
        public UtilisateurController(elAmanaAppContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Utilisateur>>> GetUtilisateur()
        {
            return await _context.Utilisateurs.ToListAsync();
        }

        private bool UtilisateurExist(long id)
        {
            return _context.Utilisateurs.Any(u => u.UtiId == id);
        } 

        [HttpPost]
        public async Task<ActionResult<Utilisateur>> PostUtilisateur(Utilisateur uti)
        {
            //haspassword
            uti.UtiMotPasse = hpwd.HasingPassword(uti.UtiMotPasse);

            var utiExist = _context.Utilisateurs.FirstOrDefault(acc => acc.UtiLogin == uti.UtiLogin);
            if (utiExist != null)
            {
                return BadRequest(new
                {
                    StatusCodes = 404,
                    Message = "  Le login de cet utilisateur existe deja dans la base de données"
                });
            }

            if (uti.UtiAgeIdAgence !=0 && uti.UtiEmpIdDirection!=0)
            {
                return BadRequest(new
                {
                    StatusCodes = 404,
                    Message = "L'utilisateur ne peut pas etre Agent et personnel elamana à la fois"
                });
            }

            else
            {
                if (uti.UtiAgeIdAgence == 0)
                {
                    // L'utilisateur donnée est un employée Amana donc on lui affecte l'id de l'agence centrale
                    uti.UtiAgeIdAgence = 1;
                }
                if (uti.UtiEmpIdDirection == 0)
                {
                    // L'utilisateur donnée est un Agent donc on lui affecte l'id de la direction centrale
                    uti.UtiEmpIdDirection = 1;
                }
                uti.UtiEtat = true;
                _context.Utilisateurs.Add(uti);
                await _context.SaveChangesAsync();
                return CreatedAtAction("PostUtilisateur", new { id = uti.UtiId }, uti);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutUtilisateur(int id, Utilisateur utilisateur)
        {
            if (id != utilisateur.UtiId)
            {
                return BadRequest();
            }
            _context.Entry(utilisateur).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UtilisateurExist(id))
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
        public async Task<IActionResult> RemoveUtilisateur(long id)
        {
            var utilisateur = await _context.Utilisateurs.FindAsync(id);
            if (utilisateur == null)
            {
                return NotFound();
            }
            _context.Utilisateurs.Remove(utilisateur);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("delete/{id}")]
        public async Task<IActionResult> DeleteUtilisateur(long id)
        {
            var utilisateur = _context.Utilisateurs.Find(id);

            if (utilisateur == null)
            {
                return NotFound();
            }

            if (utilisateur != null)
            {
                if (utilisateur.UtiEtat == true)
                {
                    utilisateur.UtiEtat = false;
                }
                _context.Entry(utilisateur).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!UtilisateurExist(id))
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

        
        [Route("login")]
        [HttpPost]
        public async Task<ActionResult<Utilisateur>> Login([FromBody] Utilisateur utilisateur)
        {
            int param_nbreTentative = _context.ParametreGlobauxGAcces.Select(u => u.ParNbeTentativeAuthentification).SingleOrDefault();

            if (utilisateur == null)
            {
                return BadRequest("Invalid client Request");
            }
            else
            {
                if (utilisateur.UtiLogin != null)
                {
                    var user = _context.Utilisateurs.Where(u => u.UtiLogin == utilisateur.UtiLogin).FirstOrDefault();
                    //Authentication with login 
                    if (user != null)
                    {
                        if (user.UtiNbeEchecAuthentification > param_nbreTentative)
                        {
                            return NotFound(new
                            {
                                StatusCodes = 404,
                                Message = "Le compte est bloqué, le nombre de tentatives d'accès incorrectes à dépassé :  " + param_nbreTentative
                            });
                        }

                        // verify password
                        if (hpwd.VerifyPassword(utilisateur.UtiMotPasse, user.UtiMotPasse))
                        {
                            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("superSecretKey@345"));
                            var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

                            var claims = new List<Claim>{
                            new Claim(ClaimTypes.NameIdentifier, user.UtiId.ToString()),
                            new Claim(ClaimTypes.Name, user.UtiNomPrenom),
                            new Claim(ClaimTypes.Email, user.UtiEmail),
                            new Claim(ClaimTypes.Surname, user.UtiLogin),
                            new Claim(ClaimTypes.AuthorizationDecision, user.UtiEtat.ToString()),
                            new Claim(ClaimTypes.Role, user.UtiRole.ToString()), // We use to string to convert the role from long to string because ClaimTypes.Role is of type string
                            };
                            var tokenOptions = new JwtSecurityToken(
                                issuer: "https://localhost:44343",
                                audience: "https://localhost:44343",
                                claims: claims,
                                expires: DateTime.Now.AddMinutes(120),
                                signingCredentials: signinCredentials
                                );
                            var tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);

                            user.UtiNbeEchecAuthentification = 0;
                            await _context.SaveChangesAsync();
                            return Ok(new { Token = tokenString });
                        }
                        else
                        {
                            user.UtiNbeEchecAuthentification = user.UtiNbeEchecAuthentification + 1;
                            _context.Entry(user).State = EntityState.Modified;
                            await _context.SaveChangesAsync();

                            return NotFound(new { StatusCodes = 404, Message = "Le mot de passe est incorrect avec une authentification avec le login" });
                        }
                    }
                    else
                    {
                        return NotFound(new { StatusCodes = 404, Message = "L'utilisateur avec ce login n'existe pas" });
                    }
                }
                else
                {
                    return NotFound(new
                    {
                        StatusCodes = 404,
                        Message = "L'utilisateur donnée n'est pas null mais le mail et le mot de passe données n'existe pas"
                    });
                }
            }
        }

        [HttpPut("initialize/{id}")]
        public async Task<IActionResult> initializeUser(long id)
        {
            var utilisateur = _context.Utilisateurs.Find(id);
            // To get default password from parameter table
            var parameter = _context.ParametreGlobauxGAcces.FirstOrDefault();

            if (utilisateur == null)
            {
                return NotFound();
            }

            utilisateur.UtiEtat = true;
            utilisateur.UtiMotPasse = hpwd.HasingPassword(parameter.ParMotPasseDefaut);
            utilisateur.UtiNbeEchecAuthentification = 0;

            _context.Entry(utilisateur).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UtilisateurExist(id))
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

        [HttpPut("resetPassword/{login}/{newPassword}")]
        public async Task<IActionResult> resetPassword(string login, string newPassword)
        {

            var utilisateur = _context.Utilisateurs.Where(u => u.UtiLogin == login).FirstOrDefault();

            if (utilisateur == null)
            {
                return NotFound();
            }

            if (newPassword == null)
            {
                return BadRequest();
            }

            utilisateur.UtiEtat = true;
            utilisateur.UtiMotPasse = hpwd.HasingPassword(newPassword);

            _context.Entry(utilisateur).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpGet("verifyPassword/{login}/{password}")]
        public async Task<IActionResult> VerifyPswd(string login, string password)
        {
            var user = _context.Utilisateurs.Where(u => u.UtiLogin == login).FirstOrDefault();

            if (user == null)
            {
                return NotFound();
            }
            
            if (hpwd.VerifyPassword(password, user.UtiMotPasse))
            {
                return Ok("true");
            }

            return BadRequest("false");
        }

        [HttpPut("BlockAuthentification/{login}")]
        public async Task<ActionResult<Utilisateur>> DeleteUtilisateurByLogin(String login)
        {
            var utilisateur = _context.Utilisateurs.FirstOrDefault(acc => acc.UtiLogin == login);

            if (utilisateur == null)
            {
                // Authentication was done with the email
               // var utilisateur2 = _context.Utilisateurs.FirstOrDefault(acc => acc.UtiEmail == login);
               // utilisateur = utilisateur2;
            }

            if (utilisateur != null)
            {
                if (utilisateur.UtiEtat == true)
                {
                    utilisateur.UtiEtat = false;
                }
                _context.Entry(utilisateur).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (utilisateur == null)
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
            }

            if (utilisateur == null)
            {
                return NotFound();
            }
            return NoContent();
        }

        [HttpGet("searchs")]
        public ActionResult<Utilisateur> GetUtilisateurSearch(string? nom, string? mail, string? description, string? login, string? etatInput, int role,string? type, string? dated, string? datef)
        {
            bool? etat = null;
            string? condition = null;

            if (etatInput == "true"){
                etat = true;
            }

            if (etatInput == "false"){
                etat = false;
            }

            if (dated != null && datef != null){
                if (condition == null){
                    condition = condition + " uti_date_creation between '" + dated + "' AND '" + datef + "' ";
                }
            }

            if (nom != null){
                if (condition != null){
                    condition = condition + " AND uti_nom_prenom LIKE '%" + nom + "%' ";
                }
                if (condition == null)
                {
                    condition = condition + "uti_nom_prenom LIKE '%" + nom + "%' ";
                }
            }

            if (mail != null)
            {
                if (condition != null)
                {
                    condition = condition + " AND uti_email LIKE '%" + mail + "%' ";
                }
                if (condition == null)
                {
                    condition = condition + "uti_email LIKE '%" + mail + "%' ";
                }
            }
            if (description != null)
            {
                if (condition != null)
                {
                    condition = condition + " AND uti_description LIKE '%" + description + "%' ";
                }
                if (condition == null)
                {
                    condition = condition + "uti_description LIKE '%" + description + "%' ";
                }
            }
            if (login != null)
            {
                if (condition != null)
                {
                    condition = condition + " AND uti_login LIKE '%" + login + "%' ";
                }
                if (condition == null)
                {
                    condition = condition + "uti_login LIKE '%" + login + "%' ";
                }
            }
            if (etat != null){
                if (condition != null)
                {
                    condition = condition + " AND uti_etat = '" + etat + "' ";
                }
                if (condition == null)
                {
                    condition = condition + "uti_etat = '" + etat + "' ";
                }
            }
            if (role != 0 )
            {
                if (condition != null)
                {
                    condition = condition + " AND uti_role ='" + role + "' ";
                }
                if (condition == null)
                {
                    condition = condition + "uti_role ='" + role + "' ";
                }
            }
            if (type != null)
            {
                if (condition != null)
                {
                    condition = condition + " AND uti_type_utilisateur = '" + type + "' ";
                }
                if (condition == null)
                {
                    condition = condition + "uti_type_utilisateur = '" + type + "' ";
                }
            }

            if (condition != null){
                try
                {
                    //return Ok("SELECT * from dbo.utilisateur WHERE " + condition);
                    var result = _context.Utilisateurs.FromSqlRaw("SELECT * from dbo.utilisateur WHERE "
                       + condition).ToList();
                    return Ok(result);
                }
                catch (Exception)
                {
                    return BadRequest();
                }
            }
            return NotFound();
        }



    }
}
