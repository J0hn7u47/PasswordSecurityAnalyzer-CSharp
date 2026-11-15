# Password Security Analyzer

A password security application developed using C#, ASP.NET Core, and React Native with Expo.

This project analyzes password strength, provides suggestions for improving password security, and generates secure random passwords. It includes a C# application, a REST API, and a mobile application.

## Features

- Analyze password strength based on length and character variety.
- Detect common passwords, repeated characters, and predictable patterns.
- Display password strength ratings and improvement suggestions.
- Generate secure random passwords.
- Analyze and generate passwords through a mobile interface.
- Test password security functionality using xUnit.

## Technologies Used

- C# and .NET
- ASP.NET Core Web API
- React Native
- Expo
- TypeScript
- xUnit
- Git and GitHub

## Project Structure

```text
PasswordSecurityAnalyzer/
├── Program.cs
├── PasswordAnalyzer.cs
├── PasswordGenerator.cs
├── PasswordSecurityAnalyzer.csproj
├── PasswordSecurityAnalyzer.Api/
├── PasswordSecurityAnalyzer.Tests/
├── PasswordSecurityAnalyzerMobile/
└── README.md
```

## Running the C# Application

Install the .NET SDK, then open a terminal in the project directory.

```bash
dotnet run
```

## Running the API

Start the ASP.NET Core API on port 5000:

```bash
dotnet run --project PasswordSecurityAnalyzer.Api --urls http://localhost:5000
```

### API Endpoints

**POST /analyze**

Analyzes a password and returns its strength rating and suggestions.

**GET /generate**

Generates a random password using the requested length.

## Running the Mobile Application

Install Node.js and npm.

Open another terminal and navigate to the mobile application:

```bash
cd PasswordSecurityAnalyzerMobile
npm ci
npx expo start
```

Open the application using a supported Expo development environment.

The mobile application currently uses `http://10.0.2.2:5000` to connect to the API from an Android emulator. A physical device requires a different API address.

## Running Unit Tests

From the main project directory, run:

```bash
dotnet test PasswordSecurityAnalyzer.Tests/PasswordSecurityAnalyzer.Tests.csproj
```

The four existing unit tests passed during development.

## Future Improvements

- Add more unit tests and password security checks.
- Improve the mobile interface.
- Make the API address configurable for different devices.
- Expand password analysis and security recommendations.

## Project Purpose

This project was developed to strengthen my understanding of C# programming, password security, REST API development, mobile application development, and software testing.

The goal is to create a practical application that helps users understand password security while applying software engineering concepts.

## Security Note

The application is intended for educational purposes. Avoid submitting real passwords to an untrusted or publicly deployed API.