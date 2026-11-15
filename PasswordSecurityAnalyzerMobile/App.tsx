
import React, { useState } from 'react';
import * as Clipboard from 'expo-clipboard'; 
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

type AnalysisResult = {
  strength: string;
  suggestion: string;
  score: number;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
};

export default function App() {
  const [copied, setCopied] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordLength, setPasswordLength] = useState(16);
  const [visible, setVisible] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzePassword = async () => {
    setResult(null);
    setError('');

    if (!password) {
      setError('Please enter a password.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        'http://10.0.2.2:5000/analyze',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password }),
        }
      );

      if (!response.ok) {
        throw new Error('API request failed.');
      }

      const data: AnalysisResult = await response.json();
      setResult(data);
    } catch {
      setError('Cannot connect to the C# API.');
    } finally {
      setLoading(false);
    }
  };
  
  const generatePassword = async () => {
    setCopied(false);
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const response = await fetch(
        `http://10.0.2.2:5000/generate?length=${passwordLength}`
      );

      if (!response.ok) {
        throw new Error('Password generation failed.');
      }

      const data: { password: string } = await response.json();

      setPassword(data.password);
      setVisible(true);
    } catch {
      setError('Cannot generate password. Check your C# API.');
    } finally {
      setLoading(false);
    }
  };
  
const copyPassword = async () => {
  if (!password) {
    setError('Generate or enter a password first.');
    return;
  }

  try {
    await Clipboard.setStringAsync(password);
    setError('');
    setCopied(true);
  } catch {
    setCopied(false);
    setError('Could not copy the password.');
  }
};



  const getStrengthColor = () => {
    if (result?.strength === 'Weak') return '#ef4444';
    if (result?.strength === 'Moderate') return '#f59e0b';
    return '#22c55e';
  };

  const renderCheck = (label: string, passed: boolean) => (
    <View style={styles.checkRow} key={label}>
      <Text style={[
        styles.checkIcon,
        { color: passed ? '#22c55e' : '#ef4444' }
      ]}>
        {passed ? '✓' : '✗'}
      </Text>
      <Text style={styles.checkText}>{label}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style="light" />

      <Text style={styles.icon}>🛡️</Text>

      <Text style={styles.title}>
        Password Security Analyzer
      </Text>

      <Text style={styles.subtitle}>
        Check your password strength and improve your security.
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Enter Password</Text>

        <View style={styles.inputRow}>
          
<TextInput
  style={styles.input}
  placeholder="Enter a test password"
  placeholderTextColor="#94a3b8"
  secureTextEntry={!visible}
  value={password}
  onChangeText={(value) => {
    setPassword(value);
    setResult(null);
    setError('');
    setCopied(false);
  }}
  autoCapitalize="none"
  autoCorrect={false}
/>


          <TouchableOpacity onPress={() => setVisible(!visible)}>
            <Text style={styles.showButton}>
              {visible ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={analyzePassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>
              Analyze Password
            </Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.generateButton}
          onPress={generatePassword}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            
        <View style={styles.lengthSection}>
          <Text style={styles.lengthLabel}>
            Password Length: {passwordLength}
          </Text>

          <View style={styles.lengthControls}>
            {[12, 16, 20, 24, 32].map((length) => (
              <TouchableOpacity
                key={length}
                style={[
                  styles.lengthOption,
                  passwordLength === length &&
                    styles.lengthOptionSelected,
                ]}
                onPress={() => setPasswordLength(length)}
              >
                <Text
                  style={[
                    styles.lengthOptionText,
                    passwordLength === length &&
                      styles.lengthOptionTextSelected,
                  ]}
                >
                  {length}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

            🔐 Generate Secure Password
          </Text>
        </TouchableOpacity>
        

        <TouchableOpacity
  style={styles.copyButton}
  onPress={copyPassword}
>
  <Text style={styles.buttonText}>
    {copied ? '✓ Password Copied!' : '📋 Copy Password'}
  </Text>
</TouchableOpacity>




        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : null}

        {result && (
          <View style={styles.result}>
            <Text style={styles.resultTitle}>
              Analysis Result
            </Text>

            <View style={styles.scoreHeader}>
              <Text style={[
                styles.strength,
                { color: getStrengthColor() }
              ]}>
                {result.strength}
              </Text>

              <Text style={styles.score}>
                {result.score}/100
              </Text>
            </View>

            <View style={styles.strengthTrack}>
              <View
                style={[
                  styles.strengthFill,
                  {
                    backgroundColor: getStrengthColor(),
                    width: `${Math.min(
                      100,
                      Math.max(0, result.score)
                    )}%`,
                  }
                ]}
              />
            </View>

            <Text style={styles.sectionTitle}>
              Security Checks
            </Text>

            <View style={styles.checkGrid}>
              {renderCheck('Uppercase letters', result.hasUppercase)}
              {renderCheck('Lowercase letters', result.hasLowercase)}
              {renderCheck('Numbers', result.hasNumber)}
              {renderCheck('Special characters', result.hasSpecial)}
            </View>

            <View style={styles.suggestionBox}>
              <Text style={styles.suggestion}>
                💡 {result.suggestion}
              </Text>
            </View>
          </View>
        )}
      </View>

      <Text style={styles.footer}>
        Built with React Native + C# ASP.NET Core
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#0f172a',
    padding: 24,
    paddingTop: 90,
    alignItems: 'center',
  },
  icon: {
    fontSize: 52,
    marginBottom: 15,
  },
  title: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 35,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 22,
    width: '100%',
  },
  label: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    color: '#ffffff',
    paddingVertical: 15,
    fontSize: 16,
  },
  showButton: {
    color: '#38bdf8',
    fontWeight: '600',
    padding: 8,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  error: {
    color: '#f87171',
    marginTop: 15,
    textAlign: 'center',
  },
  result: {
    marginTop: 25,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#475569',
  },
  resultTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  strength: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  score: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  strengthTrack: {
    backgroundColor: '#475569',
    height: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 10,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 15,
  },
  checkGrid: {
    gap: 12,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkIcon: {
    fontSize: 19,
    fontWeight: 'bold',
    width: 30,
  },
  checkText: {
    color: '#cbd5e1',
    fontSize: 15,
  },
  suggestionBox: {
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 14,
    marginTop: 22,
  },
  suggestion: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 22,
  },
  footer: {
    color: '#64748b',
    marginTop: 35,
    fontSize: 12,
    textAlign: 'center',
  },
  
  generateButton: {
    backgroundColor: '#0f766e',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  
  lengthSection: {
    marginTop: 20,
  },
  lengthLabel: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
  },
  lengthControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 5,
  },
  lengthOption: {
    flex: 1,
    backgroundColor: '#334155',
    paddingVertical: 12,
    borderRadius: 9,
    alignItems: 'center',
  },
  lengthOptionSelected: {
    backgroundColor: '#2563eb',
  },
  lengthOptionText: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '600',
  },
  lengthOptionTextSelected: {
    color: '#ffffff',
  },

  copyButton: {
    backgroundColor: '#475569',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },

});
