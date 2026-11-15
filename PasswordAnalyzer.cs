
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

public class PasswordAnalyzer
{
    public static PasswordResult Analyze(string password)
    {
        password ??= "";

        bool hasUppercase = password.Any(char.IsUpper);
        bool hasLowercase = password.Any(char.IsLower);
        bool hasNumber = password.Any(char.IsDigit);
        bool hasSpecial = password.Any(c => !char.IsLetterOrDigit(c));

        int score = 0;
        List<string> suggestions = new();

        // 1. Check password length
        if (password.Length >= 12)
            score += 40;
        else if (password.Length >= 8)
        {
            score += 20;
            suggestions.Add("Try using 12 or more characters.");
        }
        else
            suggestions.Add("Use at least 12 characters.");

        // 2. Check character variety
        if (hasUppercase)
            score += 15;
        else
            suggestions.Add("Add an uppercase letter.");

        if (hasLowercase)
            score += 15;
        else
            suggestions.Add("Add a lowercase letter.");

        if (hasNumber)
            score += 15;
        else
            suggestions.Add("Add a number.");

        if (hasSpecial)
            score += 15;
        else
            suggestions.Add("Add a special character.");

        // 3. Detect common passwords
        string[] commonPasswords =
        {
            "password", "password123", "admin123",
            "123456", "12345678", "qwerty",
            "letmein", "welcome123", "iloveyou"
        };

        bool isCommon = commonPasswords.Contains(
            password.ToLowerInvariant()
        );

        if (isCommon)
        {
            score -= 50;
            suggestions.Add("Avoid commonly used passwords.");
        }

        // 4. Detect predictable sequences
        string lowerPassword = password.ToLowerInvariant();

        bool hasSequence =
            lowerPassword.Contains("123456") ||
            lowerPassword.Contains("654321") ||
            lowerPassword.Contains("qwerty") ||
            lowerPassword.Contains("abcdef");

        if (hasSequence)
        {
            score -= 25;
            suggestions.Add("Avoid predictable sequences.");
        }

        // 5. Detect repeated characters
        bool hasRepeated = Regex.IsMatch(
            password,
            @"(.)\1{3,}"
        );

        if (hasRepeated)
        {
            score -= 20;
            suggestions.Add("Avoid repeating characters.");
        }

        // Keep score between 0 and 100
        score = Math.Clamp(score, 0, 100);

        
        // 6. Determine strength
        string strength;

        if (password.Length < 8 || score < 40 || isCommon)
        {
            strength = "Weak";
        }
        else if (password.Length < 12 ||
                 score < 85 ||
                 hasSequence ||
                 hasRepeated)
        {
            strength = "Moderate";
        }
        else
        {
            strength = "Strong";
        }


        string suggestion = suggestions.Count == 0
            ? "Good length and character variety."
            : string.Join(" ", suggestions);

        return new PasswordResult(
            strength,
            suggestion,
            score,
            hasUppercase,
            hasLowercase,
            hasNumber,
            hasSpecial
        );
    }
}

public record PasswordResult(
    string Strength,
    string Suggestion,
    int Score,
    bool HasUppercase,
    bool HasLowercase,
    bool HasNumber,
    bool HasSpecial
);
