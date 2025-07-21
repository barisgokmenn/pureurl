import React, { useState, useRef } from 'react';
import { Copy, Shield, Zap, Globe, Check, X } from 'lucide-react';

const PureURL = () => {
  const [inputUrl, setInputUrl] = useState('');
  const [cleanedUrl, setCleanedUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const outputRef = useRef(null);

  const trackingParams = [
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id',
    'fbclid', 'fb_action_ids', 'fb_action_types', 'fb_source', 'fb_ref',
    'gclid', 'gclsrc', 'gcl_au', '_ga', '_gl',
    'tag', 'ref', 'ref_', 'linkCode', 'camp', 'creative', 'creativeASIN', '_encoding',
    'pd_rd_w', 'content-id', 'pf_rd_p', 'pf_rd_r', 'pd_rd_wg', 'pd_rd_r', 'pd_rd_i',
    'igshid', 'igsh', 'si', 'feature', 't', 's', 'ss_source', 'ss_campaign_id',
    'mc_cid', 'mc_eid', 'campaign', 'source', 'medium',
    'referral', 'affiliate', 'aff', 'partner', 'promo', 'discount',
    'click_id', 'clickid', 'msclkid', 'email_source', 'email_campaign',
  ];


  const cleanUrl = (url) => {
    try {
      if (!url.trim()) return '';

      let processedUrl = url.trim();
      if (!processedUrl.match(/^https?:\/\//i)) {
        processedUrl = 'https://' + processedUrl;
      }

      const urlObj = new URL(processedUrl);

      // Query parametrelerini temizle
      const searchParams = new URLSearchParams(urlObj.search);
      const trackingParamsSet = new Set(trackingParams.map(p => p.toLowerCase()));

      for (const [key] of searchParams.entries()) {
        if (trackingParamsSet.has(key.toLowerCase())) {
          searchParams.delete(key);
        }
      }

      urlObj.search = searchParams.toString();

      // Amazon için: sadece /dp/PRODUCT_ID kısmını döndür
      if (urlObj.hostname.includes('amazon.')) {
        const dpMatch = urlObj.pathname.match(/\/dp\/[A-Z0-9]+/i);
        if (dpMatch) {
          return urlObj.origin + dpMatch[0];
        }
      }

      // Diğer URL'lerde query temizlenmiş haliyle path'i döndür
      return urlObj.origin + urlObj.pathname;

    } catch {
      return url; // Geçersiz URL ise orijinali dön
    }
  };


  const handleCleanUrl = () => {
    if (!inputUrl.trim()) return;
    
    setIsProcessing(true);
    
    setTimeout(() => {
      try {
        const cleaned = cleanUrl(inputUrl);
        setCleanedUrl(cleaned);
        setShowComparison(inputUrl.length !== cleaned.length);
        setIsProcessing(false);
      } catch (error) {
        alert('Lütfen geçerli bir URL girin');
        setIsProcessing(false);
      }
    }, 800);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cleanedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      outputRef.current?.select();
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputUrl(text);
    } catch (err) {
      console.log('Clipboard erişimi desteklenmiyor');
    }
  };

  const savedBytes = inputUrl && cleanedUrl ? inputUrl.length - cleanedUrl.length : 0;

  return (
    <div className={`min-h-screen transition-all duration-500 ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className="border-b border-gray-700/20 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                PureURL
              </h1>
              <p className="text-sm opacity-70">Gizliliğe saygı</p>
            </div>
          </div>
          
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-lg hover:bg-gray-700/20 transition-colors"
          >
            {isDark ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-8">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Trackersız, Temiz Linkler
          </h2>
          <p className="text-xl opacity-80 mb-8 max-w-2xl mx-auto">
            URL'lerinizdeki gizlilik bozucu takip kodlarını kaldırın. 
            Daha temiz, güvenli ve hızlı linkler paylaşın.
          </p>
          
          {/* Stats */}
          <div className="flex justify-center space-x-8 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">50+</div>
              <div className="text-sm opacity-70">Takip Kodu Türü</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">Anında</div>
              <div className="text-sm opacity-70">Temizlik</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-400">100%</div>
              <div className="text-sm opacity-70">Gizlilik</div>
            </div>
          </div>
        </div>

        {/* Main Tool */}
        <div className={`${isDark ? 'bg-gray-800/50' : 'bg-white'} backdrop-blur-sm rounded-2xl border ${isDark ? 'border-gray-700/50' : 'border-gray-200'} p-8 shadow-2xl`}>
          {/* Input Section */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Temizlenecek URL
            </label>
            <div className="flex gap-3">
              <textarea
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://example.com/page?utm_source=facebook&fbclid=xyz..."
                className={`flex-1 p-4 rounded-xl border ${isDark ? 'bg-gray-900/50 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none`}
                rows="3"
              />
              <button
                onClick={handlePaste}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-xl transition-colors text-sm whitespace-nowrap"
              >
                Yapıştır
              </button>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={handleCleanUrl}
              disabled={!inputUrl.trim() || isProcessing}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 rounded-xl font-semibold transition-all transform hover:scale-105 disabled:scale-100 flex items-center gap-2 shadow-lg"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Temizleniyor...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Link Temizle
                </>
              )}
            </button>
          </div>

          {/* Output Section */}
          {cleanedUrl && (
            <div className="mb-6 animate-fade-in">
              <label className="block text-sm font-semibold mb-3 flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                Temizlenmiş URL
              </label>
              <div className="flex gap-3">
                <textarea
                  ref={outputRef}
                  value={cleanedUrl}
                  readOnly
                  className={`flex-1 p-4 rounded-xl border ${isDark ? 'bg-gray-900/50 border-gray-600 text-green-400' : 'bg-green-50 border-green-300 text-green-700'} resize-none`}
                  rows="3"
                />
                <button
                  onClick={handleCopy}
                  className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                    copied 
                      ? 'bg-green-500 text-white' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Kopyalandı!' : 'Kopyala'}
                </button>
              </div>
            </div>
          )}

          {/* Comparison Stats */}
          {showComparison && cleanedUrl && (
            <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700/30' : 'bg-blue-50'} border ${isDark ? 'border-gray-600' : 'border-blue-200'}`}>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span>Takip kodları temizlendi</span>
                </div>
                <div className="text-green-400 font-semibold">
                  {savedBytes} karakter kısaldı
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800/30' : 'bg-white'} border ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
            <Shield className="w-8 h-8 text-blue-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Tam Gizlilik</h3>
            <p className="opacity-70 text-sm">Linkleriniz sadece tarayıcınızda işlenir. Sunucularımıza veri gönderilmez.</p>
          </div>
          
          <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800/30' : 'bg-white'} border ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
            <Zap className="w-8 h-8 text-purple-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Hızlı İşlem</h3>
            <p className="opacity-70 text-sm">50+ farklı takip kodu türünü anında tespit edip temizler.</p>
          </div>
          
          <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800/30' : 'bg-white'} border ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
            <Globe className="w-8 h-8 text-pink-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Tüm Platformlar</h3>
            <p className="opacity-70 text-sm">Facebook, Google, Amazon, email kampanyaları ve daha fazlası desteklenir.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={`border-t ${isDark ? 'border-gray-700/20' : 'border-gray-200'} mt-16`}>
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm opacity-70">
              © 2025 PureURL - Gizliliğiniz için tasarlandı
            </div>
            <div className="flex gap-4 text-sm">
              <span className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full">
                🚀 PRO sürüm yakında!
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PureURL;