import React, { useMemo, useState } from 'react'
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import * as Clipboard from 'expo-clipboard'
import { StatusBar } from 'expo-status-bar'

const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://bespoke-gumdrop-af2c79.netlify.app'

const CATEGORY_OPTIONS = [
  { id: 'c-unsorted', label: 'Unsorted' },
  { id: 'c-photo', label: 'Photography' },
  { id: 'c-food', label: 'Food' },
  { id: 'c-design', label: 'Design' },
  { id: 'c-travel', label: 'Travel' }
]

type SaveResponse = {
  ok?: boolean
  error?: string
  post?: {
    id: string
    caption: string
    author: string
    savedAt: string
  }
}

function isValidHttpUrl(value: string) {
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export default function App() {
  const [url, setUrl] = useState('')
  const [categoryId, setCategoryId] = useState('c-unsorted')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SaveResponse | null>(null)

  const endpoint = useMemo(() => `${API_BASE.replace(/\/$/, '')}/api/mobile/save`, [])

  async function handlePaste() {
    const text = await Clipboard.getStringAsync()
    if (text) setUrl(text.trim())
  }

  async function handleSave() {
    const candidate = url.trim()
    if (!isValidHttpUrl(candidate)) {
      Alert.alert('Invalid link', 'Paste a valid http(s) URL first.')
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: candidate, categoryId })
      })

      const data = (await response.json()) as SaveResponse
      setResult(data)

      if (!response.ok) {
        Alert.alert('Save failed', data.error || 'Unknown error')
        return
      }

      Alert.alert('Saved', 'Link was saved to your Insta Vault.')
    } catch {
      Alert.alert('Network error', 'Could not reach Insta Vault API.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Insta Vault</Text>
        <Text style={styles.subtitle}>Paste a post URL and save directly to your cloud vault.</Text>

        <Text style={styles.label}>Post URL</Text>
        <TextInput
          value={url}
          onChangeText={setUrl}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="https://instagram.com/p/..."
          placeholderTextColor="#94a3b8"
          style={styles.input}
        />

        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryWrap}>
          {CATEGORY_OPTIONS.map((category) => {
            const active = category.id === categoryId
            return (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryChip, active && styles.categoryChipActive]}
                onPress={() => setCategoryId(category.id)}
                disabled={loading}
              >
                <Text style={[styles.categoryChipText, active && styles.categoryChipTextActive]}>{category.label}</Text>
              </TouchableOpacity>
            )
          })}
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={[styles.button, styles.secondary]} onPress={handlePaste} disabled={loading}>
            <Text style={styles.secondaryText}>Paste</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.primary]} onPress={handleSave} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>Save Link</Text>}
          </TouchableOpacity>
        </View>

        <Text style={styles.helper}>API: {endpoint}</Text>

        {result?.post && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>Last Saved</Text>
            <Text style={styles.resultText}>{result.post.caption}</Text>
            <Text style={styles.resultMeta}>{result.post.author} • {new Date(result.post.savedAt).toLocaleString()}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f8fafc'
  },
  container: {
    padding: 20,
    gap: 12
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a'
  },
  subtitle: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 12
  },
  label: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '600'
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    backgroundColor: '#fff',
    color: '#0f172a',
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4
  },
  categoryWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  categoryChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  categoryChipActive: {
    backgroundColor: '#dbeafe',
    borderColor: '#60a5fa'
  },
  categoryChipText: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '600'
  },
  categoryChipTextActive: {
    color: '#1e3a8a'
  },
  button: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center'
  },
  primary: {
    backgroundColor: '#0f172a'
  },
  secondary: {
    backgroundColor: '#e2e8f0'
  },
  primaryText: {
    color: '#fff',
    fontWeight: '600'
  },
  secondaryText: {
    color: '#0f172a',
    fontWeight: '600'
  },
  helper: {
    marginTop: 8,
    fontSize: 11,
    color: '#64748b'
  },
  resultCard: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#f0fdf4'
  },
  resultTitle: {
    fontWeight: '700',
    color: '#166534',
    marginBottom: 4
  },
  resultText: {
    color: '#14532d'
  },
  resultMeta: {
    marginTop: 6,
    color: '#166534',
    fontSize: 12
  }
})
