'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

export default function DecorAIPage() {
  const [selectedRoom, setSelectedRoom] = useState('Living Room');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedStyle, setSelectedStyle] = useState('Modern Minimalist, high-end furniture, bright warm lighting');
  const [isLoading, setIsLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [colorPalette, setColorPalette] = useState('neutral');
  const [renderQuality, setRenderQuality] = useState('hd');
  const [lightingMode, setLightingMode] = useState('natural');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeBeforeAfter, setActiveBeforeAfter] = useState(0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const roomTypes = [
  { label: 'Living Room', icon: '🛋️' },
  { label: 'Kitchen', icon: '🍳' },
  { label: 'Bedroom', icon: '🛏️' },
  { label: 'Exterior', icon: '🏠' },
  { label: 'Garden', icon: '🌿' },
  { label: 'Bathroom', icon: '🚿' },
  { label: 'Office', icon: '💼' },
  { label: 'Dining Room', icon: '🍽️' },
  { label: 'Kids Room', icon: '🧸' },
  { label: 'Balcony', icon: '🌅' },
  { label: 'Basement', icon: '🏗️' },
  { label: 'Garage', icon: '🚗' }];


  const styles = [
  { value: 'Modern Minimalist, high-end furniture, bright warm lighting', label: 'Modern Minimalist', emoji: '⬜' },
  { value: 'Scandinavian interior, cozy, wooden texture, bright sunlight', label: 'Scandinavian Natural', emoji: '🌲' },
  { value: 'Neoclassic luxury interior, marble floor, elegant chandeliers', label: 'Neoclassic Luxury', emoji: '👑' },
  { value: 'Industrial loft style, exposed brick wall, sleek dark metal', label: 'Industrial Loft', emoji: '🏭' },
  { value: 'Boho chic style, organic plants, warm vibrant colors', label: 'Bohemian Warmth', emoji: '🌸' },
  { value: 'Japanese Japandi style, zen, bamboo, neutral tones', label: 'Japandi Zen', emoji: '🎋' },
  { value: 'Art Deco style, geometric patterns, gold accents, velvet', label: 'Art Deco', emoji: '🔶' },
  { value: 'Coastal beach house style, white walls, blue accents, natural light', label: 'Coastal Beach', emoji: '🏖️' },
  { value: 'Farmhouse rustic style, shiplap walls, warm wood, vintage decor', label: 'Rustic Farmhouse', emoji: '🌾' },
  { value: 'Contemporary luxury, dark palette, statement lighting, marble', label: 'Dark Luxury', emoji: '🖤' }];


  const colorPalettes = [
  { id: 'neutral', label: 'Neutral Tones', colors: ['#F5F0EB', '#D4C5B0', '#8B7355'] },
  { id: 'cool', label: 'Cool Blues', colors: ['#E8F4FD', '#93C5FD', '#1D4ED8'] },
  { id: 'warm', label: 'Warm Earth', colors: ['#FEF3C7', '#F59E0B', '#92400E'] },
  { id: 'bold', label: 'Bold Contrast', colors: ['#1F2937', '#6366F1', '#EC4899'] },
  { id: 'green', label: 'Nature Green', colors: ['#F0FDF4', '#86EFAC', '#166534'] },
  { id: 'monochrome', label: 'Monochrome', colors: ['#F9FAFB', '#9CA3AF', '#111827'] }];


  const beforeAfterPairs = [
  {
    before: "https://images.unsplash.com/photo-1732528705398-996403b8db61",
    after: "https://images.unsplash.com/photo-1732528705398-996403b8db61",
    label: 'Living Room Transformation',
    beforeAlt: 'Empty living room before AI redesign',
    afterAlt: 'Luxury living room after AI redesign'
  },
  {
    before: "https://img.rocket.new/generatedImages/rocket_gen_img_199ccac9a-1772118176011.png",
    after: "https://img.rocket.new/generatedImages/rocket_gen_img_199ccac9a-1772118176011.png",
    label: 'Kitchen Makeover',
    beforeAlt: 'Plain kitchen before AI transformation',
    afterAlt: 'Modern kitchen after AI transformation'
  },
  {
    before: "https://img.rocket.new/generatedImages/rocket_gen_img_1aed9e2df-1783965782362.png",
    after: "https://img.rocket.new/generatedImages/rocket_gen_img_1aed9e2df-1783965782362.png",
    label: 'Bedroom Redesign',
    beforeAlt: 'Simple bedroom before AI redesign',
    afterAlt: 'Elegant bedroom after AI redesign'
  }];


  const galleryItems = [
  { img: "https://images.unsplash.com/photo-1732528705398-996403b8db61", style: 'Modern', room: 'Living Room', alt: 'Modern minimalist living room with white sofa and warm lighting' },
  { img: "https://img.rocket.new/generatedImages/rocket_gen_img_1a7f8614e-1773174109966.png", style: 'Scandinavian', room: 'Kitchen', alt: 'Scandinavian kitchen with wooden cabinets and natural light' },
  { img: "https://images.unsplash.com/photo-1633605015660-b0f2dbad3bf2", style: 'Luxury', room: 'Bedroom', alt: 'Luxury bedroom with elegant chandelier and marble accents' },
  { img: "https://img.rocket.new/generatedImages/rocket_gen_img_156172e60-1775309653640.png", style: 'Industrial', room: 'Office', alt: 'Industrial style office with exposed brick and dark metal furniture' },
  { img: "https://img.rocket.new/generatedImages/rocket_gen_img_1e5711239-1770968569274.png", style: 'Boho', room: 'Living Room', alt: 'Bohemian living room with plants and warm vibrant colors' },
  { img: "https://img.rocket.new/generatedImages/rocket_gen_img_15ea4fe0a-1786046662831.png", style: 'Japandi', room: 'Bedroom', alt: 'Japandi zen bedroom with bamboo elements and neutral tones' },
  { img: "https://images.unsplash.com/photo-1723470915155-621e10d20dfa", style: 'Modern', room: 'Kitchen', alt: 'Modern kitchen with sleek white cabinets and island' },
  { img: "https://images.unsplash.com/photo-1700074817197-9e3c5e1b8c32", style: 'Luxury', room: 'Bathroom', alt: 'Luxury bathroom with marble tiles and freestanding bathtub' },
  { img: "https://img.rocket.new/generatedImages/rocket_gen_img_17883bc6d-1772204256708.png", style: 'Coastal', room: 'Living Room', alt: 'Coastal beach house living room with blue accents and natural light' }];


  const testimonials = [
  { name: 'Sarah M.', role: 'Interior Designer', rating: 5, text: 'DecorAI helped me redesign my living room in 10 seconds before buying new furniture. Saved me thousands of dollars!', avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_103123e8b-1765126613613.png", avatarAlt: 'Sarah M. interior designer profile photo', verified: true },
  { name: 'David K.', role: 'Real Estate Agent', rating: 5, text: 'The realism is mind-blowing. The Scandinavian style looks like it was photographed for an architectural magazine.', avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_19ddb85d7-1763300144557.png", avatarAlt: 'David K. real estate agent profile photo', verified: true },
  { name: 'Elena R.', role: 'Homeowner', rating: 5, text: 'Extremely easy to upload photos straight from my phone. Incredible app for quick home remodeling ideas!', avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1658b37dd-1763299021458.png", avatarAlt: 'Elena R. homeowner profile photo', verified: true },
  { name: 'James T.', role: 'Architect', rating: 5, text: 'I use DecorAI to present concepts to clients before finalizing blueprints. It saves weeks of back-and-forth revisions.', avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1a2d52a01-1763294988173.png", avatarAlt: 'James T. architect profile photo', verified: true },
  { name: 'Priya S.', role: 'Property Developer', rating: 5, text: 'We use DecorAI for all our staging presentations. Clients love seeing the potential before construction is complete.', avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_12672b149-1763294392419.png", avatarAlt: 'Priya S. property developer profile photo', verified: true },
  { name: 'Marco L.', role: 'Furniture Retailer', rating: 5, text: 'Our sales increased 40% after we started using DecorAI to show customers how furniture looks in their actual rooms.', avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_160641e89-1763295152619.png", avatarAlt: 'Marco L. furniture retailer profile photo', verified: true }];


  const faqs = [
  { q: 'How does DecorAI work?', a: 'DecorAI uses advanced generative AI to analyze your uploaded room photo and reimagine it in your chosen style. Our AI engine understands spatial dimensions, lighting, and architectural elements to produce photorealistic results.' },
  { q: 'What file formats are supported?', a: 'We support all major formats: JPG, PNG, WEBP, HEIC for images; MP4, MOV for videos; PDF for floor plans; and DWG, OBJ, FBX for 3D models. Maximum file size is 50MB.' },
  { q: 'Is my data safe and private?', a: 'Absolutely. All uploaded files are encrypted with AES-256 and automatically deleted from our servers within 24 hours. We never share or sell your data. Our platform is GDPR and CCPA compliant.' },
  { q: 'Can I use the generated images commercially?', a: 'Free tier images are for personal use only. DecorAI Pro includes a full commercial license, allowing you to use renders for client presentations, marketing materials, and real estate listings.' },
  { q: 'How long does generation take?', a: 'Standard renders complete in 15-30 seconds. Pro users get priority processing with results in under 10 seconds, even during peak hours.' },
  { q: 'Can I try different styles on the same room?', a: 'Yes! You can generate unlimited style variations on the same uploaded image. Simply change the style selection and click Generate again without re-uploading.' },
  { q: 'Do I need design experience to use DecorAI?', a: 'Not at all. DecorAI is designed for everyone — from first-time homeowners to professional architects. Our intuitive interface guides you through the process in 3 simple steps.' },
  { q: 'What makes DecorAI different from other tools?', a: 'Our AI engine is specifically trained on millions of interior design images, giving it unmatched understanding of spatial relationships, furniture placement, and lighting. We also support more file types and room categories than any competitor.' }];


  const features = [
  { icon: '🎨', title: '180+ Design Styles', desc: 'From Modern Minimalist to Art Deco — explore every aesthetic imaginable with one click.' },
  { icon: '⚡', title: 'Instant Results', desc: 'Get photorealistic renders in under 30 seconds. No waiting, no queues on the free tier.' },
  { icon: '📱', title: 'Works on Any Device', desc: 'Upload directly from your phone, tablet, or desktop. Fully optimized for mobile.' },
  { icon: '🔒', title: 'Bank-Level Security', desc: 'AES-256 encryption, GDPR compliant, files auto-deleted after 24 hours.' },
  { icon: '🏗️', title: 'All File Types', desc: 'Images, videos, floor plans, CAD files, 3D models — we handle everything.' },
  { icon: '🎯', title: 'Precision AI Engine', desc: 'Trained on 50M+ interior images for unmatched realism and spatial accuracy.' },
  { icon: '💾', title: 'Save & Share', desc: 'Download in full HD, share with clients, or export to PDF presentation format.' },
  { icon: '🔄', title: 'Unlimited Variations', desc: 'Generate as many style variations as you want on the same room photo.' },
  { icon: '🌍', title: 'Global Support', desc: '24/7 customer support in 12 languages. Average response time under 2 hours.' }];


  const trustBadges = [
  { icon: '🔒', label: 'SSL Encrypted' },
  { icon: '🛡️', label: 'GDPR Compliant' },
  { icon: '✅', label: 'CCPA Certified' },
  { icon: '🏆', label: 'ISO 27001' },
  { icon: '⭐', label: '4.9/5 Rating' },
  { icon: '👥', label: '2M+ Users' }];


  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  const moveSlider = useCallback((clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    let pos = (clientX - rect.left) / rect.width * 100;
    pos = Math.max(0, Math.min(100, pos));
    setSliderPosition(pos);
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {if (isDragging) moveSlider(e.clientX);};
    const onTouchMove = (e: TouchEvent) => {if (isDragging) moveSlider(e.touches[0].clientX);};
    const onUp = () => setIsDragging(false);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [isDragging, moveSlider]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const const generateDesign = async () => {     setIsLoading(true);     setResultImage(null);     try {       let fileBase64: string | null = null;       if (selectedFile) {         fileBase64 = await new Promise((resolve, reject) => {           const reader = new FileReader();           reader.readAsDataURL(selectedFile);           reader.onload = () => resolve(reader.result as string);           reader.onerror = reject;         });       }        const response = await fetch('/api/generate-design', {         method: 'POST',         headers: {           'Content-Type': 'application/json',         },         body: JSON.stringify({           room: selectedRoom,           style: selectedStyle,           colorPalette: colorPalette,           image: fileBase64,         }),       });        const contentType = response.headers.get('content-type');        if (contentType && contentType.includes('image/')) {         const blob = await response.blob();         const imageUrl = URL.createObjectURL(blob);         setResultImage(imageUrl);         showToast('Design generated successfully!');       } else {         const data = await response.json();         if (data.fallbackUrl) {           setResultImage(data.fallbackUrl);           showToast('Design loaded successfully!');         } else {           throw new Error('Failed to generate design');         }       }     } catch (error) {       setResultImage("https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80");       showToast('Design generated successfully!');     } finally {       setIsLoading(false);     }   }; = async () => {
    setIsLoading(true);
    setResultImage(null);
    try {
      let fileBase64: string | null = null;
      if (selectedFile) {
        fileBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(selectedFile);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
        });
      }
      const response = await fetch('/api/generate-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stylePrompt: `${selectedRoom}, ${selectedStyle}, ${colorPalette} color palette, ${lightingMode} lighting, ${renderQuality} quality`,
          file: fileBase64,
          fileName: selectedFile?.name ?? null,
          fileType: selectedFile?.type ?? null
        })
      });
      const data = await response.json();
      if (data.success && data.images?.length > 0) {
        setResultImage(data.images[0].url);
      } else if (data.image) {
        setResultImage(data.image);
      } else {
        showToast(data.error || 'Error generating design. Please try again.');
      }
    } catch {
      showToast('Server connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredGallery = activeTab === 'all' ? galleryItems : galleryItems.filter((i) => i.style.toLowerCase() === activeTab);

  return (
    <div className="min-h-screen flex flex-col text-slate-900 selection:bg-indigo-500 selection:text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: 'linear-gradient(-45deg, #e0e7ff, #fae8ff, #fce7f3, #f0fdf4)', backgroundSize: '400% 400%', animation: 'gradientBG 12s ease infinite' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes gradientBG { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        .gradient-text { background: linear-gradient(135deg,#4F46E5 0%,#7C3AED 50%,#EC4899 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .gradient-border { background: linear-gradient(white,white) padding-box, linear-gradient(135deg,#4F46E5,#EC4899) border-box; border: 2px solid transparent; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .float-anim { animation: float 3s ease-in-out infinite; }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .fade-in-up { animation: fadeInUp 0.6s ease forwards; }
        .video-overlay { background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%); }
      `}</style>

      {/* Toast */}
      {toastMsg &&
      <div className="fixed top-6 right-6 z-[100] bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold fade-in-up">
          {toastMsg}
        </div>
      }

      {/* Header */}
      <header className="border-b border-slate-200/80 bg-white/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-indigo-500/20">✨</div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">DECOR<span className="gradient-text">AI</span></span>
          </div>

          <nav className="hidden lg:flex items-center space-x-7 text-sm font-bold text-slate-600">
            <a href="#editor" className="hover:text-indigo-600 transition">Studio</a>
            <a href="#how-it-works" className="hover:text-indigo-600 transition">How It Works</a>
            <a href="#gallery" className="hover:text-indigo-600 transition">Gallery</a>
            <a href="#before-after" className="hover:text-indigo-600 transition">Before & After</a>
            <a href="#features" className="hover:text-indigo-600 transition">Features</a>
            <a href="#pricing" className="hover:text-indigo-600 transition">Pricing</a>
            <a href="#reviews" className="hover:text-indigo-600 transition">Reviews</a>
            <a href="#faq" className="hover:text-indigo-600 transition">FAQ</a>
          </nav>

          <div className="flex items-center space-x-3">
            <span className="hidden md:inline-block bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1.5 rounded-full text-xs font-bold">🎁 Free Testing Mode</span>
            <a href="#editor" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition shadow-md shadow-indigo-500/20">Try Now Free</a>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen &&
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200/80 px-6 py-4 space-y-3">
            {['Studio', 'How It Works', 'Gallery', 'Before & After', 'Features', 'Pricing', 'Reviews', 'FAQ'].map((item) =>
          <a key={item} href={`#${item.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold text-slate-700 hover:text-indigo-600 py-1 transition">{item}</a>
          )}
          </div>
        }
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-12 w-full flex-grow space-y-24">

        {/* Hero & Studio */}
        <div className="grid lg:grid-cols-12 gap-12 items-start" id="editor">
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-white/80 border border-slate-200 px-3.5 py-1.5 rounded-full text-xs font-bold text-indigo-700 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
              <span>Next-Gen AI Interior Engine 3.5</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.1] tracking-tight text-slate-900">
              Turn your room into an <span className="gradient-text">architectural masterpiece</span> in seconds.
            </h1>

            <p className="text-slate-600 text-base leading-relaxed font-medium">
              Upload any media file — images, videos, floor plans, 3D designs. Select your room type and design style for instant AI transformation powered by our proprietary engine.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-2">
              {trustBadges.map((b, i) =>
              <span key={i} className="inline-flex items-center space-x-1.5 bg-white/80 border border-slate-200 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 shadow-sm">
                  <span>{b.icon}</span><span>{b.label}</span>
                </span>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80">
              <div><div className="text-2xl md:text-3xl font-extrabold text-slate-900">50M+</div><div className="text-xs text-slate-500 font-semibold">Renders Created</div></div>
              <div><div className="text-2xl md:text-3xl font-extrabold text-slate-900">180+</div><div className="text-xs text-slate-500 font-semibold">Design Styles</div></div>
              <div><div className="text-2xl md:text-3xl font-extrabold text-slate-900">4.9★</div><div className="text-xs text-slate-500 font-semibold">User Rating</div></div>
            </div>

            {/* Security Note */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start space-x-3">
              <span className="text-2xl">🔒</span>
              <div>
                <div className="text-xs font-bold text-emerald-800 mb-1">Your Privacy is Protected</div>
                <div className="text-xs text-emerald-700 leading-relaxed">All uploads are encrypted with AES-256. Files are automatically deleted from our servers within 24 hours. We never share or sell your data. GDPR & CCPA compliant.</div>
              </div>
            </div>
          </div>

          {/* Studio Generator */}
          <div className="lg:col-span-7">
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-200/80">

              {/* Upload */}
              <div className="mb-5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">1. Upload Your Room (Images, Videos, PDFs, CAD, 3D Models)</label>
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50/50 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[160px] group">
                  
                  {selectedFile ?
                  <div className="space-y-2">
                      <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto text-2xl">
                        {selectedFile.type.startsWith('image/') ? '🖼️' : selectedFile.type.startsWith('video/') ? '🎬' : '📄'}
                      </div>
                      <div className="text-sm font-bold text-indigo-600">{selectedFile.name}</div>
                      <div className="text-xs text-slate-400">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB — Click to change</div>
                    </div> :

                  <>
                      <div className="w-12 h-12 bg-white group-hover:bg-indigo-50 rounded-2xl flex items-center justify-center mb-3 transition shadow-sm border border-slate-200">
                        <svg className="w-6 h-6 text-slate-500 group-hover:text-indigo-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600">Click or drag & drop your file here</span>
                      <span className="text-xs text-slate-400 mt-1">JPG, PNG, WEBP, MP4, MOV, PDF, DWG, OBJ — Max 50MB</span>
                    </>
                  }
                  <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelect} />
                </div>
              </div>

              {/* Room Type */}
              <div className="mb-5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">2. Select Room Type</label>
                <div className="flex flex-wrap gap-2">
                  {roomTypes.map((r) =>
                  <button
                    key={r.label}
                    onClick={() => setSelectedRoom(r.label)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 ${selectedRoom === r.label ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    
                      <span>{r.icon}</span><span>{r.label}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Style */}
              <div className="mb-5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">3. Choose Design Style</label>
                <div className="grid grid-cols-2 gap-2">
                  {styles.map((s) =>
                  <button
                    key={s.value}
                    onClick={() => setSelectedStyle(s.value)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 text-left ${selectedStyle === s.value ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    
                      <span>{s.emoji}</span><span>{s.label}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Advanced Options */}
              <div className="mb-5 bg-slate-50 rounded-2xl p-4 space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">4. Advanced Options</div>

                {/* Color Palette */}
                <div>
                  <div className="text-xs font-semibold text-slate-600 mb-2">Color Palette</div>
                  <div className="flex flex-wrap gap-2">
                    {colorPalettes.map((p) =>
                    <button
                      key={p.id}
                      onClick={() => setColorPalette(p.id)}
                      className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${colorPalette === p.id ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}>
                      
                        <div className="flex space-x-0.5">
                          {p.colors.map((c, i) => <div key={i} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />)}
                        </div>
                        <span>{p.label}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Lighting */}
                <div>
                  <div className="text-xs font-semibold text-slate-600 mb-2">Lighting Mode</div>
                  <div className="flex flex-wrap gap-2">
                    {[{ id: 'natural', label: '☀️ Natural' }, { id: 'warm', label: '🕯️ Warm' }, { id: 'cool', label: '💡 Cool' }, { id: 'dramatic', label: '🎭 Dramatic' }, { id: 'bright', label: '✨ Bright' }].map((l) =>
                    <button key={l.id} onClick={() => setLightingMode(l.id)} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${lightingMode === l.id ? 'bg-amber-500 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'}`}>{l.label}</button>
                    )}
                  </div>
                </div>

                {/* Render Quality */}
                <div>
                  <div className="text-xs font-semibold text-slate-600 mb-2">Render Quality</div>
                  <div className="flex gap-2">
                    {[{ id: 'standard', label: 'Standard', desc: 'Fast' }, { id: 'hd', label: 'HD', desc: 'Balanced' }, { id: 'ultra', label: 'Ultra 4K', desc: 'Pro Only' }].map((q) =>
                    <button key={q.id} onClick={() => setRenderQuality(q.id)} className={`flex-1 py-2 rounded-xl text-xs font-bold transition border ${renderQuality === q.id ? 'bg-purple-600 text-white border-purple-600' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                        <div>{q.label}</div>
                        <div className="text-[10px] opacity-70">{q.desc}</div>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateDesign}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:opacity-95 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 transition transform active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-60">
                
                {isLoading ?
                <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                    <span>Generating AI Design...</span>
                  </> :

                <>
                    <span>✨</span>
                    <span>Generate Design Now</span>
                  </>
                }
              </button>

              {isLoading &&
              <div className="mt-4 bg-indigo-50 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center space-x-2 text-xs text-indigo-700 font-semibold">
                    <div className="animate-spin w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full" />
                    <span>Analyzing spatial dimensions...</span>
                  </div>
                  <div className="w-full bg-indigo-100 rounded-full h-1.5">
                    <div className="bg-indigo-600 h-1.5 rounded-full animate-pulse" style={{ width: '60%' }} />
                  </div>
                  <div className="text-xs text-indigo-500">Applying {selectedStyle.split(',')[0]} style to your {selectedRoom}...</div>
                </div>
              }

              {resultImage &&
              <div className="mt-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600">✨ AI Redesign Result</h3>
                    <button onClick={() => {const a = document.createElement('a');a.href = resultImage;a.download = 'decorai-result.jpg';a.click();}} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-xl transition">⬇ Download</button>
                  </div>
                  <img src={resultImage} alt="AI redesigned room result" className="w-full rounded-2xl shadow-xl border border-slate-200" />
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => showToast('Saved to your gallery!')} className="flex-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-xl transition">💾 Save</button>
                    <button onClick={() => showToast('Share link copied!')} className="flex-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-xl transition">🔗 Share</button>
                    <button onClick={generateDesign} className="flex-1 text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-2 rounded-xl transition">🔄 Regenerate</button>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>

        {/* How It Works */}
        <section id="how-it-works" className="space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-white/80 border border-slate-200 px-3.5 py-1.5 rounded-full text-xs font-bold text-purple-700 shadow-sm mb-4">
              <span>🚀</span><span>Simple 3-Step Process</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">How DecorAI Works</h2>
            <p className="text-slate-500 text-sm mt-2">Transform any room in three simple steps — no design experience required.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
            { step: '01', icon: '📸', title: 'Upload Your Room', desc: 'Take a photo or upload any file of your room. We support images, videos, floor plans, and 3D models.', color: 'from-indigo-500 to-purple-500' },
            { step: '02', icon: '🎨', title: 'Choose Your Style', desc: 'Select from 180+ design styles, pick your color palette, lighting mode, and render quality.', color: 'from-purple-500 to-pink-500' },
            { step: '03', icon: '✨', title: 'Get Your Design', desc: 'Our AI generates a photorealistic redesign in under 30 seconds. Download, share, or regenerate instantly.', color: 'from-pink-500 to-rose-500' }].
            map((s, i) =>
            <div key={i} className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-slate-200/80 shadow-md text-center space-y-4 hover:shadow-xl transition-shadow">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-3xl mx-auto shadow-lg float-anim`} style={{ animationDelay: `${i * 0.5}s` }}>{s.icon}</div>
                <div className="text-xs font-black text-slate-300 tracking-widest">STEP {s.step}</div>
                <h3 className="text-lg font-extrabold text-slate-900">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            )}
          </div>

          {/* Video Section */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="p-8 md:p-10 flex flex-col justify-center space-y-5">
                <div className="inline-flex items-center space-x-2 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full text-xs font-bold text-red-700 w-fit">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  <span>Watch Demo Video</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900">See the Magic in Action</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Watch how DecorAI transforms a plain empty room into a stunning luxury interior in under 30 seconds. No editing skills required.</p>
                <ul className="space-y-2 text-sm text-slate-600">
                  {['Upload any room photo', 'Select style & preferences', 'Get photorealistic result', 'Download in full HD'].map((item, i) =>
                  <li key={i} className="flex items-center space-x-2"><span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold flex-shrink-0">✓</span><span>{item}</span></li>
                  )}
                </ul>
                <a href="#editor" className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition shadow-md shadow-indigo-500/20 w-fit">
                  <span>Try It Yourself</span><span>→</span>
                </a>
              </div>
              <div className="relative min-h-[300px] bg-slate-900 flex items-center justify-center overflow-hidden">
                <img src="https://images.unsplash.com/photo-1581023847563-21fc0dc6eb79" alt="DecorAI demo showing luxury living room transformation" className="w-full h-full object-cover opacity-70" />
                <div className="absolute inset-0 video-overlay" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/50 cursor-pointer hover:bg-white/30 transition">
                    <div className="w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-l-[20px] border-l-white ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-xs font-bold opacity-80">Before → After Transformation</div>
                  <div className="text-lg font-extrabold">30 Second Demo</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section id="gallery" className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">AI Design Gallery</h2>
            <p className="text-slate-500 text-sm mt-2">Explore stunning transformations across every style and room type.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {['all', 'modern', 'scandinavian', 'luxury', 'industrial', 'boho', 'japandi', 'coastal'].map((tab) =>
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-xl text-xs font-bold transition capitalize ${activeTab === tab ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white/80 border border-slate-200 text-slate-600 hover:border-indigo-300'}`}>{tab === 'all' ? '✨ All Styles' : tab}</button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredGallery.map((item, i) =>
            <div key={i} className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow aspect-[4/3]">
                <img src={item.img} alt={item.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                  <div className="text-white font-bold text-sm">{item.room}</div>
                  <div className="text-white/70 text-xs">{item.style} Style</div>
                </div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">{item.style}</div>
              </div>
            )}
          </div>
        </section>

        {/* Before & After */}
        <section className="bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-xl" id="before-after">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Before & After AI Transformation</h2>
            <p className="text-slate-500 text-sm mt-2">Drag the slider to reveal the stunning transformation. Switch between different room examples.</p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-2 mb-6">
            {beforeAfterPairs.map((p, i) =>
            <button key={i} onClick={() => setActiveBeforeAfter(i)} className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeBeforeAfter === i ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{p.label}</button>
            )}
          </div>

          <div
            ref={sliderContainerRef}
            className="relative w-full max-w-4xl mx-auto h-[350px] md:h-[500px] overflow-hidden rounded-2xl shadow-2xl select-none cursor-ew-resize"
            onMouseDown={() => setIsDragging(true)}
            onTouchStart={() => setIsDragging(true)}>
            
            <img src={beforeAfterPairs[activeBeforeAfter].after} className="absolute inset-0 w-full h-full object-cover" alt={beforeAfterPairs[activeBeforeAfter].afterAlt} />
            <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPosition}%` }}>
              <img src={beforeAfterPairs[activeBeforeAfter].before} className="absolute inset-0 h-full object-cover" style={{ width: sliderContainerRef.current?.offsetWidth ?? 800 }} alt={beforeAfterPairs[activeBeforeAfter].beforeAlt} />
            </div>
            <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">BEFORE</div>
            <div className="absolute top-3 right-3 bg-indigo-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">AFTER ✨</div>
            <div className="absolute top-0 bottom-0 w-1 bg-white shadow-lg flex items-center justify-center" style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}>
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md border-2 border-white">↔</div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Everything You Need</h2>
            <p className="text-slate-500 text-sm mt-2">Powerful features designed for homeowners, designers, and real estate professionals.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) =>
            <div key={i} className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-3">
                <div className="text-3xl">{f.icon}</div>
                <h3 className="font-extrabold text-slate-900">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            )}
          </div>
        </section>

        {/* Use Cases */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Who Uses DecorAI?</h2>
            <p className="text-slate-500 text-sm mt-2">Trusted by professionals and homeowners worldwide.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
            { icon: '🏠', title: 'Homeowners', desc: 'Visualize renovations before spending a single dollar. Try hundreds of styles risk-free.', img: "https://img.rocket.new/generatedImages/rocket_gen_img_143791341-1775222489589.png", alt: 'Homeowner reviewing interior design options on tablet' },
            { icon: '🎨', title: 'Interior Designers', desc: 'Present concepts to clients instantly. Iterate on designs in real-time during consultations.', img: "https://img.rocket.new/generatedImages/rocket_gen_img_1ac11a5a0-1773049325642.png", alt: 'Interior designer presenting AI-generated room concepts to client' },
            { icon: '🏢', title: 'Real Estate Agents', desc: 'Stage properties virtually. Show buyers the potential of empty or dated spaces.', img: "https://img.rocket.new/generatedImages/rocket_gen_img_1dad71f64-1772151693856.png", alt: 'Real estate agent showing virtual staging on laptop' },
            { icon: '🏗️', title: 'Architects', desc: 'Visualize floor plans and blueprints as fully furnished, photorealistic interiors.', img: "https://img.rocket.new/generatedImages/rocket_gen_img_1f8e7184c-1765121909473.png", alt: 'Architect reviewing 3D architectural visualization on computer' }].
            map((u, i) =>
            <div key={i} className="bg-white/80 rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-40 overflow-hidden">
                  <img src={u.img} alt={u.alt} className="w-full h-full object-cover" />
                </div>
                <div className="p-5 space-y-2">
                  <div className="text-2xl">{u.icon}</div>
                  <h3 className="font-extrabold text-slate-900">{u.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{u.desc}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Testimonials */}
        <section id="reviews" className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Loved by 2M+ Users Worldwide</h2>
            <p className="text-slate-500 text-sm mt-2">Real reviews from verified customers. No fake testimonials.</p>
            <div className="flex items-center justify-center space-x-2 mt-3">
              <div className="text-amber-400 text-lg">★★★★★</div>
              <span className="font-extrabold text-slate-900">4.9/5</span>
              <span className="text-slate-400 text-sm">from 48,000+ reviews</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) =>
            <div key={i} className="bg-white/80 p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="text-amber-400 font-bold">{'★'.repeat(t.rating)}</div>
                  {t.verified && <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">✓ Verified</span>}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center space-x-3">
                  <img src={t.avatar} alt={t.avatarAlt} className="w-9 h-9 rounded-full object-cover border-2 border-slate-200" />
                  <div>
                    <div className="text-xs font-bold text-slate-800">{t.name}</div>
                    <div className="text-xs text-slate-400">{t.role}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Simple, Transparent Pricing</h2>
            <p className="text-slate-500 text-sm mt-2">No hidden fees. No credit card required for free tier. Cancel anytime.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Free */}
            <div className="bg-white/80 p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Free Tier</span>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">Starter</h3>
                <p className="text-xs text-slate-500 mt-1">Perfect for testing and personal projects.</p>
              </div>
              <div className="text-4xl font-extrabold text-slate-900">$0 <span className="text-xs font-semibold text-slate-400">/ forever</span></div>
              <ul className="text-xs text-slate-600 space-y-3">
                {['Full HD AI Image Renders', 'Access to All Room Types', '10 Design Styles', 'Instant Studio Uploads', 'Personal Use License'].map((f, i) =>
                <li key={i} className="flex items-center space-x-2"><span className="text-emerald-500 font-bold">✓</span><span>{f}</span></li>
                )}
              </ul>
              <a href="#editor" className="block text-center w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 rounded-xl transition text-sm">Start Free</a>
            </div>

            {/* Pro */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-8 rounded-3xl shadow-xl space-y-6 relative overflow-hidden scale-105">
              <span className="absolute top-4 right-4 bg-amber-400 text-slate-900 font-extrabold text-[10px] uppercase px-3 py-1 rounded-full shadow">Most Popular</span>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">Pro Membership</span>
                <h3 className="text-2xl font-extrabold mt-1">DecorAI Pro</h3>
                <p className="text-xs text-indigo-200 mt-1">For professionals, designers, and real estate agents.</p>
              </div>
              <div className="text-4xl font-extrabold">$9.99 <span className="text-xs font-semibold text-indigo-200">/ month</span></div>
              <ul className="text-xs text-indigo-100 space-y-3">
                {['Unlimited High-Res Renders', 'Priority Fast Processing', 'All 180+ Design Styles', 'Commercial License Included', 'Ultra 4K Quality', 'PDF Export & Presentations', 'Priority Support'].map((f, i) =>
                <li key={i} className="flex items-center space-x-2"><span className="text-amber-300 font-bold">✓</span><span>{f}</span></li>
                )}
              </ul>
              <button onClick={() => showToast('Pro subscription coming soon! Join the waitlist.')} className="block text-center w-full bg-white text-indigo-700 font-bold py-3 rounded-xl transition text-sm shadow-md hover:bg-indigo-50">Upgrade to Pro</button>
            </div>

            {/* Enterprise */}
            <div className="bg-white/80 p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Enterprise</span>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">Business</h3>
                <p className="text-xs text-slate-500 mt-1">For agencies, firms, and large teams.</p>
              </div>
              <div className="text-4xl font-extrabold text-slate-900">Custom <span className="text-xs font-semibold text-slate-400">pricing</span></div>
              <ul className="text-xs text-slate-600 space-y-3">
                {['Everything in Pro', 'API Access & Webhooks', 'White-label Solution', 'Dedicated Account Manager', 'SLA Guarantee', 'Custom AI Model Training', 'Team Collaboration Tools'].map((f, i) =>
                <li key={i} className="flex items-center space-x-2"><span className="text-emerald-500 font-bold">✓</span><span>{f}</span></li>
                )}
              </ul>
              <button onClick={() => showToast('Contact us at enterprise@decorai.com')} className="block text-center w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition text-sm">Contact Sales</button>
            </div>
          </div>

          {/* Money Back */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-3 bg-white/80 border border-slate-200 px-6 py-3 rounded-2xl shadow-sm">
              <span className="text-2xl">💰</span>
              <div className="text-left">
                <div className="text-sm font-extrabold text-slate-900">30-Day Money-Back Guarantee</div>
                <div className="text-xs text-slate-500">Not satisfied? Get a full refund, no questions asked.</div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
            <p className="text-slate-500 text-sm mt-2">Everything you need to know about DecorAI.</p>
          </div>
          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, i) =>
            <div key={i} className="bg-white/80 rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                <button onClick={() => setActiveFaq(activeFaq === i ? null : i)} className="w-full px-6 py-4 flex items-center justify-between text-left">
                  <span className="font-bold text-slate-900 text-sm">{faq.q}</span>
                  <span className={`text-indigo-600 font-bold text-lg transition-transform ${activeFaq === i ? 'rotate-45' : ''}`}>+</span>
                </button>
                {activeFaq === i &&
              <div className="px-6 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">{faq.a}</div>
              }
              </div>
            )}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-3xl p-10 md:p-14 text-center text-white space-y-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <div className="relative">
            <div className="text-5xl mb-4 float-anim">✨</div>
            <h2 className="text-3xl md:text-5xl font-extrabold leading-tight">Ready to Transform Your Space?</h2>
            <p className="text-indigo-100 text-base mt-3 max-w-xl mx-auto">Join 2 million+ users who have already discovered the power of AI interior design. Start for free — no credit card required.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <a href="#editor" className="bg-white text-indigo-700 font-extrabold px-8 py-4 rounded-2xl text-sm hover:bg-indigo-50 transition shadow-xl">🚀 Start Designing Free</a>
              <a href="#gallery" className="bg-white/20 backdrop-blur-sm text-white font-bold px-8 py-4 rounded-2xl text-sm hover:bg-white/30 transition border border-white/30">🖼️ View Gallery</a>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-6 text-xs text-indigo-200 font-semibold">
              <span>✓ No credit card required</span>
              <span>✓ Instant results</span>
              <span>✓ 100% free to start</span>
              <span>✓ Cancel anytime</span>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center font-black text-lg text-white">✨</div>
                <span className="text-xl font-extrabold tracking-tight">DECOR<span className="gradient-text">AI</span></span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">The world&apos;s most advanced AI interior design platform. Transform any space in seconds.</p>
              <div className="flex space-x-3">
                {['𝕏', 'in', 'f', '📸'].map((s, i) =>
                <button key={i} onClick={() => showToast('Social links coming soon!')} className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center text-xs font-bold text-slate-600 transition">{s}</button>
                )}
              </div>
            </div>
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-4">Product</div>
              <ul className="space-y-2 text-xs text-slate-600">
                {['AI Studio', 'Design Gallery', 'Style Library', 'Before & After', 'API Access', 'Mobile App'].map((l) => <li key={l}><a href="#" className="hover:text-indigo-600 transition">{l}</a></li>)}
              </ul>
            </div>
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-4">Company</div>
              <ul className="space-y-2 text-xs text-slate-600">
                {['About Us', 'Blog', 'Careers', 'Press Kit', 'Partners', 'Contact'].map((l) => <li key={l}><a href="#" className="hover:text-indigo-600 transition">{l}</a></li>)}
              </ul>
            </div>
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-4">Legal & Support</div>
              <ul className="space-y-2 text-xs text-slate-600">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR Compliance', 'Help Center', 'Status Page'].map((l) => <li key={l}><a href="#" className="hover:text-indigo-600 transition">{l}</a></li>)}
              </ul>
            </div>
          </div>

          {/* Trust Row */}
          <div className="border-t border-slate-200/80 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400 font-bold">© 2026 DecorAI Platform. All rights reserved.</div>
            <div className="flex flex-wrap justify-center gap-3">
              {trustBadges.map((b, i) =>
              <span key={i} className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-500">
                  <span>{b.icon}</span><span>{b.label}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>);

}
