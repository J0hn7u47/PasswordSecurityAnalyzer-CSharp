
var builder = WebApplication.CreateBuilder(args);

var app = builder.Build();

app.MapGet("/", () =>
{
    return "Password Security Analyzer API is running!";
});

app.MapPost("/analyze", (AnalyzeRequest request) =>
{
    string password = request.Password ?? "";

    PasswordResult result = PasswordAnalyzer.Analyze(password);

    return Results.Ok(result);
});


app.MapGet("/generate", (int? length) =>
{
    int passwordLength = length ?? 16;

    if (passwordLength < 12 || passwordLength > 32)
    {
        return Results.BadRequest(new
        {
            error = "Password length must be between 12 and 32."
        });
    }

    string password = PasswordGenerator.Generate(passwordLength);

    return Results.Ok(new
    {
        password = password
    });
});


app.Run();

public record AnalyzeRequest(string? Password);
