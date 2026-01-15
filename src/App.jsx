import { useState } from 'react'
import './App.css'

const allHiragana = [
  { char: 'あ', romaji: 'a' }, { char: 'い', romaji: 'i' }, { char: 'う', romaji: 'u' }, { char: 'え', romaji: 'e' }, { char: 'お', romaji: 'o' },
  { char: 'か', romaji: 'ka' }, { char: 'き', romaji: 'ki' }, { char: 'く', romaji: 'ku' }, { char: 'け', romaji: 'ke' }, { char: 'こ', romaji: 'ko' },
  { char: 'さ', romaji: 'sa' }, { char: 'し', romaji: 'shi' }, { char: 'す', romaji: 'su' }, { char: 'せ', romaji: 'se' }, { char: 'そ', romaji: 'so' },
  { char: 'た', romaji: 'ta' }, { char: 'ち', romaji: 'chi' }, { char: 'つ', romaji: 'tsu' }, { char: 'て', romaji: 'te' }, { char: 'と', romaji: 'to' },
  { char: 'な', romaji: 'na' }, { char: 'に', romaji: 'ni' }, { char: 'ぬ', romaji: 'nu' }, { char: 'ね', romaji: 'ne' }, { char: 'の', romaji: 'no' },
  { char: 'は', romaji: 'ha' }, { char: 'ひ', romaji: 'hi' }, { char: 'ふ', romaji: 'fu' }, { char: 'へ', romaji: 'he' }, { char: 'ほ', romaji: 'ho' },
  { char: 'ま', romaji: 'ma' }, { char: 'み', romaji: 'mi' }, { char: 'む', romaji: 'mu' }, { char: 'め', romaji: 'me' }, { char: 'も', romaji: 'mo' },
  { char: 'や', romaji: 'ya' }, { char: 'ゆ', romaji: 'yu' }, { char: 'よ', romaji: 'yo' },
  { char: 'ら', romaji: 'ra' }, { char: 'り', romaji: 'ri' }, { char: 'る', romaji: 'ru' }, { char: 'れ', romaji: 're' }, { char: 'ろ', romaji: 'ro' },
  { char: 'わ', romaji: 'wa' }, { char: 'を', romaji: 'wo' }, { char: 'ん', romaji: 'n' }
]

const vocalizedHiragana = [
  { char: 'が', romaji: 'ga' }, { char: 'ぎ', romaji: 'gi' }, { char: 'ぐ', romaji: 'gu' }, { char: 'げ', romaji: 'ge' }, { char: 'ご', romaji: 'go' },
  { char: 'ざ', romaji: 'za' }, { char: 'じ', romaji: 'ji' }, { char: 'ず', romaji: 'zu' }, { char: 'ぜ', romaji: 'ze' }, { char: 'ぞ', romaji: 'zo' },
  { char: 'だ', romaji: 'da' }, { char: 'ぢ', romaji: 'ji' }, { char: 'づ', romaji: 'zu' }, { char: 'で', romaji: 'de' }, { char: 'ど', romaji: 'do' },
  { char: 'ば', romaji: 'ba' }, { char: 'び', romaji: 'bi' }, { char: 'ぶ', romaji: 'bu' }, { char: 'べ', romaji: 'be' }, { char: 'ぼ', romaji: 'bo' },
  { char: 'ぱ', romaji: 'pa' }, { char: 'ぴ', romaji: 'pi' }, { char: 'ぷ', romaji: 'pu' }, { char: 'ぺ', romaji: 'pe' }, { char: 'ぽ', romaji: 'po' }
]

function App() {
  const [enableVocalized, setEnableVocalized] = useState(() => {
    const saved = localStorage.getItem('enableVocalized')
    return saved ? JSON.parse(saved) : false
  })
  const hiraganaList = enableVocalized ? [...allHiragana, ...vocalizedHiragana] : allHiragana
  
  const [selected, setSelected] = useState(() => {
    const saved = localStorage.getItem('selected')
    return saved ? new Set(JSON.parse(saved)) : new Set(hiraganaList.map((_, i) => i))
  })
  const [mode, setMode] = useState('select')
  const [current, setCurrent] = useState(null)
  const [result, setResult] = useState('')
  const [history, setHistory] = useState([])
  const [testQueue, setTestQueue] = useState([])
  const [testResults, setTestResults] = useState([])
  const [input, setInput] = useState('')

  const toggleVocalized = () => {
    const newValue = !enableVocalized
    setEnableVocalized(newValue)
    localStorage.setItem('enableVocalized', JSON.stringify(newValue))
    const newList = newValue ? [...allHiragana, ...vocalizedHiragana] : allHiragana
    setSelected(new Set(newList.map((_, i) => i)))
    localStorage.setItem('selected', JSON.stringify([...newList.map((_, i) => i)]))
  }

  const toggle = (i) => {
    const newSet = new Set(selected)
    newSet.has(i) ? newSet.delete(i) : newSet.add(i)
    setSelected(newSet)
    localStorage.setItem('selected', JSON.stringify([...newSet]))
  }

  const unselectAll = () => {
    setSelected(new Set())
    localStorage.setItem('selected', JSON.stringify([]))
  }

  const startPractice = () => {
    if (selected.size === 0) return
    setMode('practice')
    setHistory([])
    newQuestion()
  }

  const startType = () => {
    if (selected.size === 0) return
    setMode('type')
    setHistory([])
    setInput('')
    newQuestion()
  }

  const startReverse = () => {
    if (selected.size === 0) return
    setMode('reverse')
    setHistory([])
    newQuestion()
  }

  const startTest = () => {
    if (selected.size === 0) return
    const queue = [...selected].sort(() => Math.random() - 0.5)
    setTestQueue(queue)
    setTestResults([])
    setCurrent(queue[0])
    setResult('')
    setMode('test')
  }

  const newQuestion = () => {
    const available = selected.size > 10 
      ? [...selected].filter(i => !history.includes(i))
      : [...selected]
    const randomIndex = available[Math.floor(Math.random() * available.length)]
    setCurrent(randomIndex)
    setHistory(prev => [...prev, randomIndex].slice(-10))
    setResult('')
    setInput('')
  }

  const check = (answer) => {
    if (answer === hiraganaList[current].romaji) {
      setResult('correct')
      setTimeout(newQuestion, 800)
    } else {
      setResult('incorrect')
    }
  }

  const checkReverse = (answer) => {
    if (answer === hiraganaList[current].char) {
      setResult('correct')
      setTimeout(newQuestion, 800)
    } else {
      setResult('incorrect')
    }
  }

  const checkType = (e) => {
    e.preventDefault()
    if (input.toLowerCase() === hiraganaList[current].romaji) {
      setResult('correct')
      setTimeout(newQuestion, 800)
    } else {
      setResult('incorrect')
    }
  }

  const checkTest = (answer) => {
    const correct = answer === hiraganaList[current].romaji
    setTestResults(prev => [...prev, { index: current, correct }])
    setResult(correct ? 'correct' : 'incorrect')
    
    setTimeout(() => {
      const remaining = testQueue.slice(1)
      if (remaining.length > 0) {
        setTestQueue(remaining)
        setCurrent(remaining[0])
        setResult('')
      } else {
        setMode('results')
      }
    }, 800)
  }

  if (mode === 'select') {
    return (
      <div className="container">
        <h1>Select Hiragana to Practice</h1>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '1.2rem', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={enableVocalized} 
              onChange={toggleVocalized}
              style={{ marginRight: '0.5rem' }}
            />
            Enable Vocalized (dakuten/handakuten)
          </label>
        </div>
        <div className="grid">
          {hiraganaList.map((h, i) => (
            <div key={i} className={`card ${selected.has(i) ? 'selected' : ''}`} onClick={() => toggle(i)}>
              <div className="char">{h.char}</div>
              <div className="romaji">{h.romaji}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="start-btn" style={{ background: '#e74c3c' }} onClick={unselectAll}>Unselect All</button>
          <button className="start-btn" onClick={startPractice} disabled={selected.size === 0}>
            Practice ({selected.size})
          </button>
          <button className="start-btn" style={{ background: '#3498db' }} onClick={startType} disabled={selected.size === 0}>
            Type Mode ({selected.size})
          </button>
          <button className="start-btn" style={{ background: '#e67e22' }} onClick={startReverse} disabled={selected.size === 0}>
            Reverse ({selected.size})
          </button>
          <button className="start-btn" style={{ background: '#9b59b6' }} onClick={startTest} disabled={selected.size === 0}>
            Test ({selected.size})
          </button>
        </div>
      </div>
    )
  }

  if (mode === 'results') {
    const incorrect = testResults.filter(r => !r.correct)
    const score = testResults.filter(r => r.correct).length
    
    return (
      <div className="container">
        <h1>Test Results</h1>
        <div className="question-char">{score} / {testResults.length}</div>
        {incorrect.length > 0 && (
          <>
            <h2>Characters to Review:</h2>
            <div className="grid">
              {incorrect.map(r => (
                <div key={r.index} className="card">
                  <div className="char">{hiraganaList[r.index].char}</div>
                  <div className="romaji">{hiraganaList[r.index].romaji}</div>
                </div>
              ))}
            </div>
          </>
        )}
        <button className="start-btn" onClick={() => setMode('select')}>Back to Selection</button>
      </div>
    )
  }

  if (mode === 'test') {
    const selectedHiragana = [...selected].map(i => hiraganaList[i])

    return (
      <div className="container">
        <div style={{ marginBottom: '1rem' }}>Question {testResults.length + 1} / {testQueue.length + testResults.length}</div>
        <div className="question-char">{hiraganaList[current].char}</div>
        <div className="options">
          {selectedHiragana.map((h, i) => (
            <button key={i} className="option-btn" onClick={() => checkTest(h.romaji)} disabled={result !== ''}>{h.romaji}</button>
          ))}
        </div>
        {result && <div className={`result ${result}`}>{result === 'correct' ? '✓ Correct!' : '✗ Incorrect'}</div>}
      </div>
    )
  }

  if (mode === 'type') {
    return (
      <div className="container">
        <button className="back-btn" onClick={() => setMode('select')}>← Back to Selection</button>
        <div className="question-char">{current !== null && hiraganaList[current].char}</div>
        <form onSubmit={checkType} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            autoFocus
            style={{ fontSize: '1.5rem', padding: '0.5rem', textAlign: 'center', width: '200px' }}
          />
          <button type="submit" className="start-btn">Submit</button>
        </form>
        {result && <div className={`result ${result}`}>{result === 'correct' ? '✓ Correct!' : '✗ Try again'}</div>}
      </div>
    )
  }

  if (mode === 'reverse') {
    const selectedHiragana = [...selected].map(i => hiraganaList[i])
    const choices = current !== null ? [
      hiraganaList[current],
      ...selectedHiragana.filter(h => h.char !== hiraganaList[current].char)
        .sort(() => Math.random() - 0.5).slice(0, 3)
    ].sort(() => Math.random() - 0.5) : []

    return (
      <div className="container">
        <button className="back-btn" onClick={() => setMode('select')}>← Back to Selection</button>
        <div className="question-char">{current !== null && hiraganaList[current].romaji}</div>
        <div className="options">
          {choices.map((h, i) => (
            <button key={i} className="option-btn" onClick={() => checkReverse(h.char)} style={{ fontSize: '2rem' }}>{h.char}</button>
          ))}
        </div>
        {result && <div className={`result ${result}`}>{result === 'correct' ? '✓ Correct!' : '✗ Try again'}</div>}
      </div>
    )
  }

  const selectedHiragana = [...selected].map(i => hiraganaList[i])
  const choices = current !== null ? [
    hiraganaList[current],
    ...selectedHiragana.filter(h => h.romaji !== hiraganaList[current].romaji)
      .sort(() => Math.random() - 0.5).slice(0, 3)
  ].sort(() => Math.random() - 0.5) : []

  return (
    <div className="container">
      <button className="back-btn" onClick={() => setMode('select')}>← Back to Selection</button>
      <div className="question-char">{current !== null && hiraganaList[current].char}</div>
      <div className="options">
        {choices.map((h, i) => (
          <button key={i} className="option-btn" onClick={() => check(h.romaji)}>{h.romaji}</button>
        ))}
      </div>
      {result && <div className={`result ${result}`}>{result === 'correct' ? '✓ Correct!' : '✗ Try again'}</div>}
    </div>
  )
}

export default App
