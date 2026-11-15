
using System;
using System.Collections.Generic;
using System.Security.Cryptography;

public static class PasswordGenerator
{
    public static string Generate(int length = 16)
    {
        if (length < 12 || length > 128)
        {
            throw new ArgumentException(
                "Password length must be between 12 and 128."
            );
        }

        const string uppercase = "ABCDEFGHJKLMNPQRSTUVWXYZ";
        const string lowercase = "abcdefghijkmnopqrstuvwxyz";
        const string numbers = "23456789";
        const string symbols = "!@#$%^&*-_?";

        string allCharacters =
            uppercase + lowercase + numbers + symbols;

        List<char> password = new();

        // Guarantee at least one character from each category
        password.Add(GetRandomCharacter(uppercase));
        password.Add(GetRandomCharacter(lowercase));
        password.Add(GetRandomCharacter(numbers));
        password.Add(GetRandomCharacter(symbols));

        // Fill the remaining positions securely
        while (password.Count < length)
        {
            password.Add(GetRandomCharacter(allCharacters));
        }

        // Securely shuffle the characters
        for (int i = password.Count - 1; i > 0; i--)
        {
            int j = RandomNumberGenerator.GetInt32(i + 1);

            (password[i], password[j]) =
                (password[j], password[i]);
        }

        return new string(password.ToArray());
    }

    private static char GetRandomCharacter(string characters)
    {
        int index = RandomNumberGenerator.GetInt32(
            characters.Length
        );

        return characters[index];
    }
}
