using backend.Services;
using backend.Data;

using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddHttpClient(); 

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=crypto.db"));

builder.Services.AddControllers();
builder.Services.AddScoped<CryptoService>();
builder.Services.AddCors(options => {
    options.AddPolicy("AllowAll", policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowAll");
app.UseHttpsRedirection();

app.MapControllers(); 

app.Run();