import React, { useState, useRef } from 'react';
import { Camera, Loader2, Save, X, Image as ImageIcon } from 'lucide-react';
import { DrinkEntry, DrinkType, DrinkAnalysisResult } from '../types';
import { analyzeDrinkImage, fileToGenerativePart } from '../services/geminiService';
import { v4 as uuidv4 } from 'uuid';

interface AddDrinkProps {
  onSave: (entry: DrinkEntry) => void;
  onCancel: () => void;
}

const AddDrink: React.FC<AddDrinkProps> = ({ onSave, onCancel }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [type, setType] = useState<DrinkType>(DrinkType.BEER);
  const [volume, setVolume] = useState<string>('');
  const [abv, setAbv] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Create local preview
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
      
      setIsAnalyzing(true);
      setError(null);
      setSuccessMsg(null);

      try {
        const base64Data = await fileToGenerativePart(file);
        const result = await analyzeDrinkImage(base64Data, file.type);
        
        // Populate form
        if (result.name && result.name !== "Unknown") {
          setName(result.name);
          setSuccessMsg("Drink identified!");
        } else {
          setError("Could not identify the drink automatically. Please enter details.");
        }

        if (result.type) setType(result.type);
        if (result.volumeOz) setVolume(result.volumeOz.toString());
        if (result.abv) setAbv(result.abv.toString());

      } catch (err) {
        setError("Could not recognize drink. Please enter details manually.");
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !volume || !abv) {
      setError("Please fill in all required fields.");
      return;
    }

    const entry: DrinkEntry = {
      id: uuidv4(),
      timestamp: Date.now(),
      name,
      type,
      volumeOz: parseFloat(volume),
      abv: parseFloat(abv),
      imageUrl: imagePreview || undefined
    };

    onSave(entry);
  };

  return (
    <div className="flex flex-col h-full bg-white animate-fade-in-up">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-bold text-gray-800">Add Drink</h2>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Image Upload Section */}
        <div className="mb-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative w-full h-48 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all
              ${imagePreview ? 'border-indigo-500 bg-gray-50' : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'}
            `}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Drink Preview" className="h-full w-full object-contain rounded-lg" />
            ) : (
              <div className="text-center text-gray-400">
                <Camera size={48} className="mx-auto mb-2" />
                <p className="text-sm">Tap to take a photo</p>
              </div>
            )}
            
            {isAnalyzing && (
              <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center rounded-xl backdrop-blur-sm">
                <Loader2 className="animate-spin text-indigo-600 mb-2" size={32} />
                <p className="text-indigo-600 font-medium">Analyzing...</p>
              </div>
            )}
            
            <input 
              type="file" 
              ref={fileInputRef} 
              accept="image/*" 
              capture="environment"
              className="hidden" 
              onChange={handleFileChange}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100">
            {error}
          </div>
        )}
        
        {successMsg && !error && (
           <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm mb-4 border border-green-100">
            {successMsg}
          </div>
        )}

        {/* Form */}
        <form id="drink-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Drink Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Miller Lite, Gin & Tonic"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.values(DrinkType).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`p-2 text-xs font-medium rounded-md transition-colors ${
                    type === t ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Volume (oz)</label>
              <input 
                type="number" 
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                placeholder="12"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ABV (%)</label>
              <input 
                type="number" 
                step="0.1"
                value={abv}
                onChange={(e) => setAbv(e.target.value)}
                placeholder="5.0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
              />
            </div>
          </div>
        </form>
      </div>

      <div className="p-4 border-t bg-gray-50 safe-area-pb">
        <button 
          type="submit" 
          form="drink-form"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm active:transform active:scale-[0.98]"
        >
          <Save size={20} />
          Save Drink
        </button>
      </div>
    </div>
  );
};

export default AddDrink;