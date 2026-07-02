import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import './App.css';

const MODELS = [
  "@cf/meta/llama-3.1-8b-instruct",
  "@cf/meta/llama-3.2-3b-instruct",
  "@cf/meta/llama-3.2-1b-instruct",
  "@cf/mistral/mistral-7b-instruct-v0.2",
  "@cf/qwen/qwen1.5-14b-chat-awq",
  "@cf/qwen/qwen1.5-7b-chat-awq",
  "@cf/deepseek-ai/deepseek-math-7b-instruct"
];

function OmniDashboard() {
  const [model, setModel] = useState(MODELS[0]);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => scrollToBottom(), [messages]);

  const triggerEdgeModel = async () => {
    if (!input.trim()) return;
    const updatedConversation = [...messages, { role: 'user', content: input }];
    setMessages(updatedConversation);
    setInput('');
    setLoading(true);
    
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, conversation: updatedConversation })
      });
      const data = await res.json();
      let aiText = data.error ? `[ERROR]: ${data.error}` : data.response || JSON.stringify(data);
      setMessages([...updatedConversation, { role: 'assistant', content: aiText }]);
    } catch (err) {
      setMessages([...updatedConversation, { role: 'assistant', content: `[FETCH EXCEPTION]: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); triggerEdgeModel(); }
  };

  return (
    <div className="omni-app">
      <aside className="arsenal-sidebar">
        <div className="sidebar-header">MODEL MANIFOLD</div>
        <select className="model-select" value={model} onChange={(e) => setModel(e.target.value)}>
          {MODELS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <div className="telemetry-widget">
          <h3>TRI-POLAR CRUCIBLE</h3>
          <div className="status-box alert">[-1] SIN (DECAY)</div>
          <div className="status-box">[0] MUJI (VOID)</div>
          <div className="status-box">[+1] SEN (GROWTH)</div>
        </div>
      </aside>
      
      <div className="chat-interface">
        <header className="chat-header">
          <h1 className="cyber-title">CONVERGENCE EPOCH COMMAND CENTER</h1>
        </header>
        
        <div className="chat-history">
          {messages.length === 0 && (
            <div className="empty-state"><h2>AWAITING STRUCTURAL IGNITION</h2></div>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className={`message-row ${msg.role}`}>
              <div className="message-bubble"><ReactMarkdown>{msg.content}</ReactMarkdown></div>
            </div>
          ))}
          {loading && <div className="message-row assistant"><div className="message-bubble loading">... [ROUTING PAYLOAD] ...</div></div>}
          <div ref={chatEndRef} />
        </div>

        <div className="chat-input-area">
          <textarea className="prompt-box" placeholder="Transmit payload..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} />
        </div>
      </div>
    </div>
  );
}
export default OmniDashboard;
