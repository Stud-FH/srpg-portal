using Microsoft.EntityFrameworkCore;
using SrpgApi.Auth.Domain;

namespace SrpgApi.Db;

public class DbContext : Microsoft.EntityFrameworkCore.DbContext
{
    public DbContext(DbContextOptions<DbContext> options)
        : base(options)
    { }

    public DbSet<User> Users { get; set; }
}