
using System;

class Program
{
    static void Main()
    {
        Console.WriteLine("================================");
        Console.WriteLine("     PASSWORD SECURITY ANALYZER");
        Console.WriteLine("================================");

        Console.Write("Enter your password: ");
        string password = Console.ReadLine() ?? "";

        PasswordResult result = PasswordAnalyzer.Analyze(password);

        Console.WriteLine($"Password Strength: {result.Strength}");
        Console.WriteLine($"Suggestion: {result.Suggestion}");
    }
}

