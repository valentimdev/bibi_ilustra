'use client'; 

import React, { useState } from 'react';


interface FormData {
  name: string;
  email: string;
  message: string;
  gotcha: string;
}

export default function About() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
    gotcha: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: 'Mensagem enviada com sucesso!' });
        setFormData({ name: '', email: '', message: '', gotcha: '' }); 
      } else {
        setStatus({ type: 'error', message: data.error || 'Erro ao enviar mensagem' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Erro de conexão. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="flex flex-col w-full min-h-screen justify-center items-center py-20 mb-10 border border-black">
      <div className="flex flex-col w-full max-w-lg px-4 md:px-0 justify-center border border-black">
        
        <h1 className="text-lg text-center text-gray-900 mb-6 leading-tight">
          Whether you have a project in mind, a question, or just want to say hello, I'd love to hear from you. 
          Feel free to use the form below or reach me directly via email at:
        </h1>
        <p className="text-xl md:text-2xl text-center font-extrabold text-gray-900 mb-8 leading-tight break-all">
          biancatavaresilustra@gmail.com
        </p>
        
        {status.type && (
          <div className={`mb-6 p-3 rounded-md text-center text-sm font-medium ${
            status.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-300' 
              : 'bg-red-100 text-red-800 border border-red-300'
          }`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full border border-black">
            
            <input 
              name="gotcha"
              value={formData.gotcha}
              onChange={handleChange}
              type="text" 
              style={{ display: 'none' }} 
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="text-gray-900 font-extrabold text-sm">Name</label>
              <input 
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                maxLength={100} 
                type="text" 
                placeholder="Name" 
                className="text-gray-900 w-full p-2 border border-gray-500 rounded-md focus:outline-none focus:border-black transition-colors" 
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-gray-900 font-extrabold text-sm">Email</label>
              <input 
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                maxLength={255} 
                type="email" 
                placeholder="Email" 
                className="text-gray-900 w-full p-2 border border-gray-500 rounded-md focus:outline-none focus:border-black transition-colors" 
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="message" className="text-gray-900 font-extrabold text-sm">Message</label>
              <textarea 
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                maxLength={1500} 
                placeholder="Message" 
                className="h-32 w-full p-2 border border-gray-500 rounded-md resize-none text-gray-900 focus:outline-none focus:border-black transition-colors" 
                required
                disabled={isLoading}
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-1/2 self-center mt-2 p-2 bg-[var(--secondary)] hover:bg-[var(--secondary-hover)] text-white rounded-md font-bold transition-all ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
        </form>
      </div>
    </div>
  );
}