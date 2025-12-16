'use client'; 

import React, { useState } from 'react';

export default function About() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
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
        setFormData({ name: '', email: '', message: '' }); // Limpa o formulário
      } else {
        setStatus({ type: 'error', message: data.error || 'Erro ao enviar mensagem' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Erro ao enviar mensagem. Tente novamente.' });
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
    <div className="flex flex-col w-full min-h-screen justify-center border border-black items-center py-20 mb-10">
      <div className="flex flex-col w-[50%] border border-black justify-center ">
        <h1 className="text-lg text-center  text-gray-900 mb-6 leading-tight">Whether you have a project in mind, a question, or just want to say hello, I'd love to hear from you. Feel free to use the form below or reach me directly via email at:</h1>
        <p className="text-2xl text-center  font-extrabold text-gray-900 mb-6 leading-tight">biancatavaresilustra@gmail.com</p>
        
        {/* Mensagem de status */}
        {status.type && (
          <div className={`mb-4 p-3 rounded-md text-center ${
            status.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-300' 
              : 'bg-red-100 text-red-800 border border-red-300'
          }`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 justify-center items-center">
            <p className="text-gray-900 font-extrabold">Name</p>
            <input 
              name="name"
              value={formData.name}
              onChange={handleChange}
              maxLength={20} 
              type="text" 
              placeholder="Name" 
              className="text-gray-900 w-full p-2 border border-gray-500 rounded-md max-length-5 focus:outline-none" 
              required
              disabled={isLoading}
            />
            <p className="text-gray-900 font-extrabold">Email</p>
            <input 
              name="email"
              value={formData.email}
              onChange={handleChange}
              maxLength={255} 
              type="email" 
              placeholder="Email" 
              className="text-gray-900 w-full p-2 border border-gray-500 rounded-md outline-none" 
              required
              disabled={isLoading}
            />
            <p className="text-gray-900 font-extrabold">Message</p>
            <textarea 
              name="message"
              value={formData.message}
              onChange={handleChange}
              maxLength={1500} 
              placeholder="Message" 
              className="h-30  w-full p-2 border border-gray-500 rounded-md resize-none text-gray-900 outline-none" 
              required
              disabled={isLoading}
            />
            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-1/2 p-2 bg-[var(--secondary)] hover:bg-[var(--secondary-hover)] text-white rounded-md resize-none cursor-pointer ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Enviando...' : 'Send'}
            </button>
        </form>
      </div>
    </div>
  );
}