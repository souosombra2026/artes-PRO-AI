
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ImagePicker from './components/ImagePicker';
import { AppTab, GeneratedContent } from './types';
import { BACKGROUND_STYLES, TONES } from './constants';
import { 
  transformProductImage, 
  generateMarketingContent, 
  generateMascot 
} from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<GeneratedContent[]>([]);
  
  // Studio State
  const [studioImage, setStudioImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState(BACKGROUND_STYLES[0].id);
  const [studioResult, setStudioResult] = useState<string | null>(null);

  // Writer State
  const [writerProductName, setWriterProductName] = useState('');
  const [writerDesc, setWriterDesc] = useState('');
  const [writerTone, setWriterTone] = useState(TONES[0].id);
  const [writerTarget, setWriterTarget] = useState<'caption' | 'stories'>('caption');
  const [writerResult, setWriterResult] = useState<string | null>(null);

  // Branding State
  const [mascotPrompt, setMascotPrompt] = useState('');
  const [mascotResult, setMascotResult] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('artesapro_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const saveToHistory = (item: Omit<GeneratedContent, 'id' | 'timestamp'>) => {
    const newItem: GeneratedContent = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };
    const newHistory = [newItem, ...history];
    setHistory(newHistory);
    localStorage.setItem('artesapro_history', JSON.stringify(newHistory));
  };

  const handleStudioTransform = async () => {
    if (!studioImage) return;
    setLoading(true);
    try {
      const style = BACKGROUND_STYLES.find(s => s.id === selectedStyle);
      const result = await transformProductImage(studioImage, style?.prompt || '');
      setStudioResult(result);
      saveToHistory({ type: 'image', content: result, title: `Foto ${style?.label}` });
    } catch (error) {
      alert("Houve um erro ao transformar sua imagem. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleWriterGenerate = async () => {
    if (!writerProductName) return;
    setLoading(true);
    try {
      const toneLabel = TONES.find(t => t.id === writerTone)?.label || '';
      const result = await generateMarketingContent({
        productName: writerProductName,
        description: writerDesc,
        tone: toneLabel,
        target: writerTarget
      });
      setWriterResult(result);
      saveToHistory({ 
        type: writerTarget === 'stories' ? 'story' : 'text', 
        content: result, 
        title: `${writerTarget === 'stories' ? 'Stories' : 'Legenda'}: ${writerProductName}` 
      });
    } catch (error) {
      alert("Houve um erro ao criar seu texto.");
    } finally {
      setLoading(false);
    }
  };

  const handleMascotGenerate = async () => {
    if (!mascotPrompt) return;
    setLoading(true);
    try {
      const result = await generateMascot(mascotPrompt);
      setMascotResult(result);
      saveToHistory({ type: 'mascot', content: result, title: `Mascote: ${mascotPrompt}` });
    } catch (error) {
      alert("Houve um erro ao criar seu mascote.");
    } finally {
      setLoading(false);
    }
  };

  const renderHome = () => (
    <div className="p-6 flex flex-col gap-8">
      <div className="bg-pink-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-serif font-bold mb-2">Olá, Artesã! 💖</h2>
          <p className="opacity-90 leading-relaxed mb-4">Pronta para transformar seu talento em uma marca profissional?</p>
          <button 
            onClick={() => setActiveTab(AppTab.STUDIO)}
            className="bg-white text-pink-600 px-6 py-2 rounded-full font-bold shadow-lg hover:bg-pink-50 transition-colors"
          >
            Começar Agora
          </button>
        </div>
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => setActiveTab(AppTab.STUDIO)} className="bg-white p-4 rounded-2xl shadow-sm border border-pink-100 flex flex-col items-center text-center gap-2 hover:border-pink-300 transition-all">
          <span className="text-3xl">📸</span>
          <span className="font-bold text-gray-800 text-sm">Estúdio de Fotos</span>
        </button>
        <button onClick={() => setActiveTab(AppTab.WRITER)} className="bg-white p-4 rounded-2xl shadow-sm border border-pink-100 flex flex-col items-center text-center gap-2 hover:border-pink-300 transition-all">
          <span className="text-3xl">✍️</span>
          <span className="font-bold text-gray-800 text-sm">Legendas & Stories</span>
        </button>
        <button onClick={() => setActiveTab(AppTab.BRANDING)} className="bg-white p-4 rounded-2xl shadow-sm border border-pink-100 flex flex-col items-center text-center gap-2 hover:border-pink-300 transition-all">
          <span className="text-3xl">🎨</span>
          <span className="font-bold text-gray-800 text-sm">Mascotes & Adesivos</span>
        </button>
        <button onClick={() => setActiveTab(AppTab.HISTORY)} className="bg-white p-4 rounded-2xl shadow-sm border border-pink-100 flex flex-col items-center text-center gap-2 hover:border-pink-300 transition-all">
          <span className="text-3xl">📂</span>
          <span className="font-bold text-gray-800 text-sm">Meus Arquivos</span>
        </button>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex gap-3">
        <span className="text-xl">💡</span>
        <div>
          <h4 className="font-bold text-yellow-800 text-sm">Dica Pro</h4>
          <p className="text-xs text-yellow-700 leading-tight">Use fotos com boa luz natural para que a IA consiga criar fundos ainda mais realistas!</p>
        </div>
      </div>
    </div>
  );

  const renderStudio = () => (
    <div className="p-6">
      <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">Estúdio Profissional</h2>
      {!studioResult ? (
        <div className="space-y-6">
          <ImagePicker onImageSelected={setStudioImage} selectedImage={studioImage} />
          
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700 block">Escolha o Cenário:</label>
            <div className="grid grid-cols-1 gap-2">
              {BACKGROUND_STYLES.map(style => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`px-4 py-3 rounded-xl border text-left text-sm transition-all ${
                    selectedStyle === style.id 
                    ? 'border-pink-500 bg-pink-50 text-pink-700 ring-2 ring-pink-500/20' 
                    : 'border-gray-200 bg-white text-gray-600'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleStudioTransform}
            disabled={!studioImage || loading}
            className="w-full py-4 bg-pink-600 text-white rounded-2xl font-bold shadow-lg shadow-pink-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Transformando sua peça...' : 'Gerar Foto Profissional ✨'}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-white">
            <img src={studioResult} alt="Resultado" className="w-full" />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setStudioResult(null)}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold"
            >
              Fazer Outra
            </button>
            <a
              href={studioResult}
              download="artesa_pro_photo.png"
              className="flex-1 py-3 bg-pink-600 text-white rounded-xl font-bold text-center"
            >
              Salvar Foto
            </a>
          </div>
        </div>
      )}
    </div>
  );

  const renderWriter = () => (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-serif font-bold text-gray-800">Copi da Artesã</h2>
      
      {!writerResult ? (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-bold text-gray-700 block mb-1">Qual é a peça?</label>
            <input 
              type="text" 
              placeholder="Ex: Amigurumi Leãozinho, Tapete de Crochê"
              value={writerProductName}
              onChange={(e) => setWriterProductName(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 block mb-1">Detalhes (Opcional)</label>
            <textarea 
              placeholder="Ex: Feito à mão com fios de algodão, ideal para quarto de bebê"
              value={writerDesc}
              onChange={(e) => setWriterDesc(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 h-24 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-gray-700 block mb-1">Tom de Voz</label>
              <select 
                value={writerTone}
                onChange={(e) => setWriterTone(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 outline-none"
              >
                {TONES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 block mb-1">Formato</label>
              <select 
                value={writerTarget}
                onChange={(e) => setWriterTarget(e.target.value as any)}
                className="w-full p-3 rounded-xl border border-gray-200 outline-none"
              >
                <option value="caption">Legenda Post</option>
                <option value="stories">Roteiro Stories</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleWriterGenerate}
            disabled={!writerProductName || loading}
            className="w-full py-4 bg-pink-600 text-white rounded-2xl font-bold shadow-lg disabled:opacity-50"
          >
            {loading ? 'Escrevendo...' : 'Gerar Texto Mágico 🪄'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-sm whitespace-pre-wrap text-gray-700 leading-relaxed max-h-[400px] overflow-y-auto">
            {writerResult}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setWriterResult(null)}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold"
            >
              Criar Outro
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(writerResult);
                alert("Copiado para a área de transferência!");
              }}
              className="flex-1 py-3 bg-pink-600 text-white rounded-xl font-bold"
            >
              Copiar Texto
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderBranding = () => (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-serif font-bold text-gray-800">Criação de Mascote</h2>
      <p className="text-gray-600 text-sm">Crie um personagem único para sua marca de artesanato ou adesivos de WhatsApp.</p>
      
      {!mascotResult ? (
        <div className="space-y-4">
          <textarea 
            placeholder="Ex: Uma ovelhinha fofa segurando agulhas de tricô com um laço rosa na cabeça"
            value={mascotPrompt}
            onChange={(e) => setMascotPrompt(e.target.value)}
            className="w-full p-4 rounded-2xl border border-gray-200 h-32 outline-none focus:border-pink-500"
          />
          <button
            onClick={handleMascotGenerate}
            disabled={!mascotPrompt || loading}
            className="w-full py-4 bg-pink-600 text-white rounded-2xl font-bold shadow-lg disabled:opacity-50"
          >
            {loading ? 'Dando vida ao seu mascote...' : 'Criar Mascote 🎨'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-white">
            <img src={mascotResult} alt="Mascote" className="w-full h-full object-contain" />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setMascotResult(null)}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold"
            >
              Criar Outro
            </button>
            <a
              href={mascotResult}
              download="mascote_artesa.png"
              className="flex-1 py-3 bg-pink-600 text-white rounded-xl font-bold text-center"
            >
              Salvar Mascote
            </a>
          </div>
        </div>
      )}
    </div>
  );

  const renderHistory = () => (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-serif font-bold text-gray-800">Minhas Criações</h2>
      {history.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <span className="text-6xl mb-4 block">📦</span>
          <p>Você ainda não criou nada hoje.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map(item => (
            <div key={item.id} className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                {item.type === 'image' || item.type === 'mascot' ? (
                  <img src={item.content} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">✍️</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-800 truncate">{item.title}</h4>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                  {new Date(item.timestamp).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <button 
                onClick={() => {
                  if (item.type === 'text' || item.type === 'story') {
                    setWriterResult(item.content);
                    setActiveTab(AppTab.WRITER);
                  } else if (item.type === 'image') {
                    setStudioResult(item.content);
                    setActiveTab(AppTab.STUDIO);
                  } else {
                    setMascotResult(item.content);
                    setActiveTab(AppTab.BRANDING);
                  }
                }}
                className="text-pink-600 p-2 font-bold"
              >
                Abrir
              </button>
            </div>
          ))}
          <button 
            onClick={() => {
              if(confirm("Deseja apagar todo o histórico?")) {
                setHistory([]);
                localStorage.removeItem('artesapro_history');
              }
            }}
            className="w-full py-2 text-xs text-red-400 font-medium"
          >
            Limpar Histórico
          </button>
        </div>
      )}
    </div>
  );

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === AppTab.HOME && renderHome()}
      {activeTab === AppTab.STUDIO && renderStudio()}
      {activeTab === AppTab.WRITER && renderWriter()}
      {activeTab === AppTab.BRANDING && renderBranding()}
      {activeTab === AppTab.HISTORY && renderHistory()}

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm max-w-md mx-auto">
          <div className="bg-white p-8 rounded-3xl flex flex-col items-center gap-4 animate-bounce">
            <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-serif font-bold text-pink-700">A mágica está acontecendo...</p>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
