
using Xunit;

public class PasswordAnalyzerTests
{
    [Fact]
    public void ShortPassword_ShouldBeWeak()
    {
        var result = PasswordAnalyzer.Analyze("abc123");

        Assert.Equal("Weak", result.Strength);
    }

    [Fact]
    public void RepeatedCharacters_ShouldNotBeStrong()
    {
        var result = PasswordAnalyzer.Analyze("AAAA1234!xyz");

        Assert.Equal("Moderate", result.Strength);
        Assert.Contains(
            "repeating characters",
            result.Suggestion
        );
    }

    [Fact]
    public void CommonPassword_ShouldBeWeak()
    {
        var result = PasswordAnalyzer.Analyze("password123");

        Assert.Equal("Weak", result.Strength);
    }

    [Fact]
    public void PasswordScore_ShouldStayWithinRange()
    {
        var result = PasswordAnalyzer.Analyze("Test123!");

        Assert.InRange(result.Score, 0, 100);
    }
}

