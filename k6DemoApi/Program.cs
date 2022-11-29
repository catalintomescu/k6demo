var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.UseRouting();
app.UseEndpoints(endpoints =>
    {
        endpoints.MapControllers();

        if (app.Environment.IsDevelopment())
        {
            endpoints.MapPost("/token", async context =>
            {
                using (var reader = new StreamReader(context.Request.Body))
                {
                    Globals._swaggerToken = await reader.ReadToEndAsync();
                }

                context.Response.StatusCode = 200;
                context.Response.ContentLength = 0;
                await context.Response.CompleteAsync();
            });

            endpoints.MapGet("/token", async context =>
            {
                context.Response.StatusCode = 200;
                context.Response.ContentType = "application/text";
                await context.Response.Body.WriteAsync(System.Text.UTF8Encoding.UTF8.GetBytes($"{Globals._swaggerToken}"));
            });
        }
    });
// app.MapControllers();

app.Run();

public static class Globals 
{    
    public static string _swaggerToken = "faketoken1234";
}
