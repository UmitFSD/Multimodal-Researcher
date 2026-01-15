import React, { useState, useRef, useEffect } from 'react';
import { SendHorizontal, Plus, Bot, User, X, Sparkles, Loader2, Paperclip } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// --- YENİ EKLENEN IMPORTLAR ---
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import 'katex/dist/katex.min.css'; // <-- Bu CSS çok önemli, yoksa formüller dağılır!
// ------------------------------

interface Message {
  role: 'user' | 'assistant';
  content: string;
  image?: string;
}

const App: React.FC = () => {
  // ... (Buradaki state ve logic kısımların AYNI kalacak, değiştirmene gerek yok) ...
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastResponseId, setLastResponseId] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
    e.target.value = '';
  };

  const startNewChat = () => {
    setMessages([]);
    setLastResponseId(null);
    setImage(null);
  };

  const handleSend = async () => {
    if (!input.trim() && !image) return;

    const userMsg: Message = { role: 'user', content: input, image: image || undefined };
    setMessages(prev => [...prev, userMsg]);
    
    const currentInput = input;
    const currentImage = image;
    
    setInput('');
    setImage(null);
    setIsLoading(true);

    try {
      // Burası senin backend URL'in
      const res = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput,
          image: currentImage,
          previous_response_id: lastResponseId
        })
      });

      const data = await res.json();
      if (data.response_id) setLastResponseId(data.response_id);

      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection Error.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 font-sans overflow-hidden">
      {/* Sidebar - AYNI */}
      <aside className="w-[280px] bg-white hidden md:flex flex-col p-4 border-r border-slate-200">
        <div className="flex items-center gap-2 mb-8 mt-2 px-2">
            <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-200">
                <Sparkles size={20} className="text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900">Multimodal Researcher</span>
        </div>
        <button onClick={startNewChat} className="flex items-center justify-center gap-2 w-full py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all mb-6 shadow-md">
           <Plus size={18} /> New Research
        </button>
        <div className="flex-1 overflow-y-auto font-medium text-slate-500 text-xs px-2 uppercase tracking-widest">History Empty</div>
        <div className="pt-4 border-t border-slate-100 text-[10px] text-slate-400 flex justify-between font-bold">
            <span>V2.2 STABLE</span>
            <span className="text-emerald-500">● ONLINE</span>
        </div>
      </aside>

      {/* Chat Area */}
      <main className="flex-1 flex flex-col relative bg-white">
         <div className="flex-1 overflow-y-auto pt-10 pb-40 px-4 scroll-smooth">
            {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 border border-blue-100"><Sparkles size={32} className="text-blue-600" /></div>
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Multimodal Researcher</h2>
                    <p className="text-slate-500 text-sm font-medium">Upload an image or ask a question to start a deep multi-modal analysis.</p>
                </div>
            ) : (
                <div className="max-w-3xl mx-auto space-y-10">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-blue-600 border border-slate-200'}`}>
                                    {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                                </div>
                                <div className={`p-4 rounded-2xl text-[15px] shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none'}`}>
                                    {msg.image && <img src={msg.image} className="max-h-64 rounded-lg mb-4 border border-slate-200" alt="input" />}
                                    
                                    {/* --- GÜNCELLENEN KISIM: REACT MARKDOWN --- */}
                                    <div className="prose prose-slate max-w-none prose-p:leading-relaxed prose-pre:bg-slate-100 prose-pre:border prose-pre:border-slate-200">
                                        <ReactMarkdown 
                                            remarkPlugins={[remarkMath, remarkGfm]} 
                                            rehypePlugins={[rehypeKatex]}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                    {/* ----------------------------------------- */}

                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-4 animate-in fade-in"><div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100 text-blue-600"><Bot size={18} /></div><div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl flex items-center gap-3"><Loader2 size={16} className="animate-spin text-blue-600" /><span className="text-sm text-blue-600 font-bold uppercase tracking-tighter">Analyzing...</span></div></div>
                    )}
                </div>
            )}
            <div ref={chatEndRef} />
         </div>

         {/* Input Area - AYNI */}
         <div className="absolute bottom-0 left-0 w-full px-4 pb-8 pt-10 bg-gradient-to-t from-white via-white/90 to-transparent">
            <div className="max-w-3xl mx-auto relative">
                {image && (
                   <div className="absolute -top-32 left-0 p-2 bg-white border border-slate-200 rounded-2xl shadow-xl animate-bounce-short">
                      <div className="relative"><img src={image} className="w-24 h-24 object-cover rounded-xl" /><button onClick={() => setImage(null)} className="absolute -top-3 -right-3 bg-white text-slate-800 rounded-full p-1 border border-slate-200 hover:text-red-500 shadow-md"><X size={14}/></button></div>
                   </div>
                )}
                <div className="flex items-end bg-white border border-slate-300 rounded-2xl shadow-2xl focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 transition-all p-2">
                    <input type="file" ref={fileInputRef} onChange={handleImage} className="hidden" accept="image/*" />
                    <button onClick={() => fileInputRef.current?.click()} className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl mb-1 ml-1 transition-colors"><Paperclip size={20} /></button>
                    <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}} className="flex-1 bg-transparent border-none outline-none text-slate-800 p-3 max-h-48 resize-none placeholder-slate-400 text-[15px] font-medium" placeholder="Describe or upload to research..." rows={1} style={{minHeight: '44px'}} />
                    <button onClick={handleSend} disabled={isLoading || (!input && !image)} className={`p-3 rounded-xl transition-all mb-1 mr-1 ${input || image ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg' : 'bg-slate-100 text-slate-300 shadow-none'}`}>{isLoading ? <Loader2 size={18} className="animate-spin" /> : <SendHorizontal size={18} />}</button>
                </div>
            </div>
         </div>
      </main>
    </div>
  );
};

export default App;