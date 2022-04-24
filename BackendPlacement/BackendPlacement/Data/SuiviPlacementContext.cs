using BackendPlacement.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendPlacement.Data
{
    public class SuiviPlacementContext: DbContext
    {
        public SuiviPlacementContext()
        {
        }
        public SuiviPlacementContext(DbContextOptions<SuiviPlacementContext> options) : base(options)
        {
        }
        public Microsoft.EntityFrameworkCore.DbSet<Placement> Placements { get; set; }
        public Microsoft.EntityFrameworkCore.DbSet<Typeaction> Typeactions { get; set; }
        public Microsoft.EntityFrameworkCore.DbSet<Organisme> Organismes { get; set; }
        public Microsoft.EntityFrameworkCore.DbSet<Typeplacement> Typeplacements { get; set; }
        public Microsoft.EntityFrameworkCore.DbSet<Typefond> Typefonds { get; set; }
        public Microsoft.EntityFrameworkCore.DbSet<TypeSousplacement> TypeSousplacements { get; set; }
        public Microsoft.EntityFrameworkCore.DbSet<TypeSousSousPlacement> TypeSousSousPlacements { get; set; }
        public Microsoft.EntityFrameworkCore.DbSet<CoteeNonCotee> CoteeNonCotees { get; set; }

        public Microsoft.EntityFrameworkCore.DbSet<Delegation> Delegations { get; set; }

        public Microsoft.EntityFrameworkCore.DbSet<IntermediaireBourse> IntermediaireBourses { get; set; }

        public Microsoft.EntityFrameworkCore.DbSet<Details_emprunt> Details_Emprunts { get; set; }

        public Microsoft.EntityFrameworkCore.DbSet<ParametresGlobaux> parametresGlobauxes { get; set; }

        public Microsoft.EntityFrameworkCore.DbSet<HistorqieRealisation> historqieRealisations { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Placement>().ToTable("placement");
            modelBuilder.Entity<Typeaction>().ToTable("type_action");
            modelBuilder.Entity<Organisme>().ToTable("organisme");
            modelBuilder.Entity<Typeplacement>().ToTable("type_placement");
            modelBuilder.Entity<Typefond>().ToTable("Type_fond");
            modelBuilder.Entity<TypeSousplacement>().ToTable("Type_sous_placement");
            modelBuilder.Entity<TypeSousSousPlacement>().ToTable("Type_sous_sous_placement");
            modelBuilder.Entity<CoteeNonCotee>().ToTable("CoteeNonCotee");
            modelBuilder.Entity<Delegation>().ToTable("delegation");
            modelBuilder.Entity<IntermediaireBourse>().ToTable("intermediaire_bourse");
            modelBuilder.Entity<Details_emprunt>().ToTable("details_emprunts");
            modelBuilder.Entity<ParametresGlobaux>().ToTable("parametres_globaux");
            modelBuilder.Entity<HistorqieRealisation>().ToTable("historique_realisation");



        }
    }
}
