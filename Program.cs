//This is just the first basic stage of password checker

using 
System;

class Program
{
    static void Main()
    {
        Console.WriteLine("================================");
        Console.WriteLine("     PASSWORD SECURITY ANALYZER");
        Console.WriteLine("================================");

        Console.Write("Enter your password: ");
        string password = Console.ReadLine() ?? "";

        if (password.Length < 8)
        {
            Console.WriteLine("Password Strength: Weak");
            Console.WriteLine("Suggestion: Use at least 8 characters.");
        }
        else if (password.Length < 12)
        {
            Console.WriteLine("Password Strength: Moderate");
            Console.WriteLine("Suggestion: Try using 12 or more characters.");
        }
        else
        {
            Console.WriteLine("Password Strength: Good Length");
            Console.WriteLine("Your password has a good length.");
        }
    }
}
