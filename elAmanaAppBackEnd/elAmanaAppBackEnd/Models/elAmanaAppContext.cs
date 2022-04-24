using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace elAmanaAppBackEnd.Models
{
    public partial class elAmanaAppContext : DbContext
    {
        public elAmanaAppContext()
        {
        }

        public elAmanaAppContext(DbContextOptions<elAmanaAppContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Agence> Agences { get; set; } = null!;
        public virtual DbSet<Application> Applications { get; set; } = null!;
        public virtual DbSet<Direction> Directions { get; set; } = null!;
        public virtual DbSet<Fonction> Fonctions { get; set; } = null!;
        public virtual DbSet<Module> Modules { get; set; } = null!;
        public virtual DbSet<ParametreGlobauxGAcce> ParametreGlobauxGAcces { get; set; } = null!;
        public virtual DbSet<Role> Roles { get; set; } = null!;
        public virtual DbSet<RoleFonction> RoleFonctions { get; set; } = null!;
        public virtual DbSet<RoleApplication> RoleApplications { get; set; } = null!;
        public virtual DbSet<Utilisateur> Utilisateurs { get; set; } = null!;

        public virtual DbSet<TypeUtilisateur> TypeUtilisateurs { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseSqlServer("Server=T00937\\SQLEXPRESS;Database=elAmanaApp;Trusted_Connection=True;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Agence>(entity =>
            {
                entity.HasKey(e => e.AgeId);

                entity.ToTable("agence");

                entity.Property(e => e.AgeId).HasColumnName("age_id");

                entity.Property(e => e.AgeCode).HasColumnName("age_code");

                entity.Property(e => e.AgeCodification).HasColumnName("age_codification");

                entity.Property(e => e.AgeEtat).HasColumnName("age_etat");

                entity.Property(e => e.AgeAffichage).HasColumnName("age_affichage");

                entity.Property(e => e.AgeLibelle)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("age_libelle");
            });

            modelBuilder.Entity<Application>(entity =>
            {
                entity.HasKey(e => e.AppId);

                entity.ToTable("application");

                entity.Property(e => e.AppId).HasColumnName("app_id");

                entity.Property(e => e.AppDescription)
                    .HasMaxLength(200)
                    .IsUnicode(false)
                    .HasColumnName("app_description");

                entity.Property(e => e.AppEtat).HasColumnName("app_etat");

                entity.Property(e => e.AppLibelle)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("app_libelle");
            });

            modelBuilder.Entity<Direction>(entity =>
            {
                entity.HasKey(e => e.DirId);

                entity.ToTable("direction");

                entity.Property(e => e.DirId).HasColumnName("dir_id");

                entity.Property(e => e.DirEtat).HasColumnName("dir_etat");

                entity.Property(e => e.DirAffichage).HasColumnName("dir_affichage");

                entity.Property(e => e.DirIdUtiulisateurChefHierarchique).HasColumnName("dir_id_utiulisateur_chef_hierarchique");

                entity.Property(e => e.DirLibelle)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("dir_libelle");

                entity.Property(e => e.DirMailGroupe)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("dir_mail_groupe");
            });

            modelBuilder.Entity<Fonction>(entity =>
            {
                entity.HasKey(e => e.FonId);

                entity.ToTable("fonction");

                entity.Property(e => e.FonId).HasColumnName("fon_id");

                entity.Property(e => e.FonDescription)
                    .HasMaxLength(200)
                    .IsUnicode(false)
                    .HasColumnName("fon_description");

                entity.Property(e => e.FonEtat).HasColumnName("fon_etat");

                entity.Property(e => e.FonIdModule).HasColumnName("fon_id_module");

                entity.Property(e => e.FonLibelle)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("fon_libelle");

                /*entity.HasOne(d => d.FonIdModuleNavigation)
                    .WithMany(p => p.Fonctions)
                    .HasForeignKey(d => d.FonIdModule)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_fonction_Module");
                */
            });

            modelBuilder.Entity<Module>(entity =>
            {
                entity.HasKey(e => e.ModId);

                entity.ToTable("module");

                entity.Property(e => e.ModId).HasColumnName("mod_id");

                entity.Property(e => e.ModApplication).HasColumnName("mod_application");

                entity.Property(e => e.ModDescription)
                    .HasMaxLength(200)
                    .IsUnicode(false)
                    .HasColumnName("mod_description");

                entity.Property(e => e.ModEtat).HasColumnName("mod_etat");

                entity.Property(e => e.ModLibelle)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("mod_libelle");

                entity.HasOne(d => d.ModApplicationNavigation)
                    .WithMany(p => p.Modules)
                    .HasForeignKey(d => d.ModApplication)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Module_application");
            });

            modelBuilder.Entity<ParametreGlobauxGAcce>(entity =>
            {
                entity.HasKey(e => e.ParId);

                entity.ToTable("parametre_globaux_gAcces");

                entity.Property(e => e.ParId).HasColumnName("par_id");

                entity.Property(e => e.ParMotPasseDefaut)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("par_mot_passe_defaut");

                entity.Property(e => e.ParNbeTentativeAuthentification).HasColumnName("par_nbeTentativeAuthentification");
            });

            modelBuilder.Entity<Role>(entity =>
            {
                entity.HasKey(e => e.RolId);

                entity.ToTable("role");

                entity.Property(e => e.RolId).HasColumnName("rol_id");

                entity.Property(e => e.RolDescription)
                    .HasMaxLength(200)
                    .IsUnicode(false)
                    .HasColumnName("rol_description");

                entity.Property(e => e.RolEtat).HasColumnName("rol_etat");

                entity.Property(e => e.RolIdRoleFonction).HasColumnName("rol_id_role_fonction");

                entity.Property(e => e.RolLibelle)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("rol_libelle");
            });

            modelBuilder.Entity<RoleFonction>(entity =>
            {
                entity.HasKey(e => new { e.RolId, e.FonId })
                    .HasName("PK__role_fon__406D1364758EB231");

                entity.ToTable("role_fonction");

                entity.Property(e => e.RolId).HasColumnName("rol_id");

                entity.Property(e => e.FonId).HasColumnName("fon_id");
            });

            modelBuilder.Entity<RoleApplication>(entity =>
            {
                entity.HasKey(e => new { e.RolId, e.AppId })
                    .HasName("pk_Constraint");

                entity.ToTable("role_application");

                entity.Property(e => e.RolId).HasColumnName("rol_id");

                entity.Property(e => e.AppId).HasColumnName("app_id");
            });

            modelBuilder.Entity<Utilisateur>(entity =>
            {
                entity.HasKey(e => e.UtiId);

                entity.ToTable("utilisateur");

                entity.Property(e => e.UtiId).HasColumnName("uti_id");

                entity.Property(e => e.UtiAgeIdAgence).HasColumnName("uti_age_id_agence");

                entity.Property(e => e.UtiDateCreation)
                    .HasColumnType("date")
                    .HasColumnName("uti_date_creation");
                
                entity.Property(e => e.UtiDescription)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("uti_description");

                entity.Property(e => e.UtiEmail)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("uti_email");
                

                entity.Property(e => e.UtiEmpIdDirection).HasColumnName("uti_emp_id_direction");

                entity.Property(e => e.UtiEmpMatricule).HasColumnName("uti_emp_matricule");

                entity.Property(e => e.UtiEtat).HasColumnName("uti_etat");

                entity.Property(e => e.UtiLogin)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("uti_login");

                entity.Property(e => e.UtiMotPasse)
                    .HasMaxLength(200)
                    .IsUnicode(false)
                    .HasColumnName("uti_mot_passe");

                entity.Property(e => e.UtiNbeEchecAuthentification).HasColumnName("uti_nbeEchecAuthentification");

               entity.Property(e => e.UtiNomPrenom).
                     IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("uti_nom_prenom");
            
                entity.Property(e => e.UtiRole).HasColumnName("uti_role");

                entity.Property(e => e.UtiTypeUtilisateur).HasColumnName("uti_type_utilisateur");

                entity.HasOne(d => d.UtiAgeIdAgenceNavigation)
                    .WithMany(p => p.Utilisateurs)
                    .HasForeignKey(d => d.UtiAgeIdAgence)
                    .HasConstraintName("FK_utilisateur_agence");
               
                entity.HasOne(d => d.UtiEmpIdDirectionNavigation)
                    .WithMany(p => p.Utilisateurs)
                    .HasForeignKey(d => d.UtiEmpIdDirection)
                    .HasConstraintName("FK_utilisateur_direction");
               
                entity.HasOne(d => d.UtiRoleNavigation)
                    .WithMany(p => p.Utilisateurs)
                    .HasForeignKey(d => d.UtiRole)
                    .HasConstraintName("FK_utilisateur_role");
               
            });

            modelBuilder.Entity<TypeUtilisateur>(entity =>
            {
                entity.HasKey(e => e.IdTypeUti);

                entity.ToTable("type_utilisateur");

                entity.Property(e => e.IdTypeUti).HasColumnName("id_type_uti");

                entity.Property(e => e.LibelleTypeUti)
                    .HasMaxLength(250)
                    .IsUnicode(false)
                    .HasColumnName("libelle_type_uti");

            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
