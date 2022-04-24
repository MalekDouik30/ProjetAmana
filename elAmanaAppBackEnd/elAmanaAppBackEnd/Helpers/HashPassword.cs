using System;

namespace elAmanaAppBackEnd.Helpers
{
    public class HashPassword
    {
        public HashPassword()
        {

        }

        public string HasingPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        public bool VerifyPassword(string newPassword, string hashedPassword)
        {
            try
            {
                return BCrypt.Net.BCrypt.Verify(newPassword, hashedPassword);
            }
            catch (Exception)
            {
                return false;
            }
        }

    }
}
