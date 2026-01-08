'use client'; 

import React, { useState } from 'react';


interface FormData {
  name: string;
  email: string;
  message: string;
  gotcha: string;
}
interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}
export default function About() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
    gotcha: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: null, message: '' });
    setErrors({});

    const newErrors: FormErrors = {};
    Object.keys(formData).forEach((key) => {
      if (key !== 'gotcha') {
        const error = validateField(key, formData[key as keyof FormData]);
        if (error) newErrors[key as keyof FormErrors] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

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
        setStatus({ type: 'success', message: 'Message sent successfully!' });
        setFormData({ name: '', email: '', message: '', gotcha: '' }); 
        setErrors({});
      } else {
        setStatus({ type: 'error', message: data.error || 'Error at sending message' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Connection error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };

const validateField = (name: string, value: string): string => {
  switch(name) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) return 'Email is required';
      if (!emailRegex.test(value)) return 'Invalid email address';
      return '';
    case 'name':
      if (!value) return 'Name is required';
      if (value.length < 2) return 'Name must be at least 2 characters';
      return '';
    case 'message':
      if (!value) return 'Message is required';
      if (value.length < 10) return 'Message must be at least 10 characters';
      return '';
    default:
      return '';
  }
};
    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors({
        ...errors,
        [name]: error
      });
    }
  };
  return (
    <div className="overflow-hidden flex flex-col w-full  justify-center  items-center pt-20 pb-30 px-5  min-h-[calc(100vh-180px)]">
      <div className=" flex flex-col w-full   ">
        </div>
        <div className="flex flex-row w-full gap-8">
        <div className=" w-1/2 pt-3 flex flex-col items-center justify-center">
        <h1 className="text-lg text-center text-gray-500 leading-tight">
          Have any ideas you'd like to share?
          </h1>
        <h1 className="text-lg text-center text-gray-500 mb-6 leading-tight">
          Feel free to reach out! :)
        
        </h1>
        <h1 className="italic text-xl md:text-3xl text-center font-extrabold text-[var(--secondary)] mb-0 leading-tight break-all">
          biancatavaresilustra@gmail.com
        </h1>
        <video
              src="/icons/gatos_site_bibi_azul.webm"
              autoPlay
              muted
              loop
              playsInline
              controls={false}
              className="w-full h-auto mt-0 "
            />
        </div>
        <div className="w-1/2  flex flex-col">

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full ">
            
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
              <input 
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                maxLength={50} 
                type="text" 
                placeholder="Name" 
                className={`text-gray-900 w-full p-2 border-2 border-gray-500 rounded-md focus:outline-none focus:border-black transition-colors ${
                  errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-500 focus:border-black'
                }`} 
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-center text-red-600 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <input 
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                maxLength={255} 
                type="text" 
                placeholder="Email" 
                className={`text-gray-900 w-full p-2 border-2 border-gray-500 rounded-md focus:outline-none focus:border-black transition-colors ${
                  errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-500 focus:border-black'
                }`} 
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-center text-red-600 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <textarea 
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                maxLength={1500} 
                placeholder="Type your ideas here :D" 
                className={`h-32 w-full p-2 border-2 rounded-md resize-none text-gray-900 focus:outline-none transition-colors ${
                  errors.message ? 'border-red-500 focus:border-red-500' : 'border-gray-500 focus:border-black'
                }`}                
                disabled={isLoading}
              />
              {errors.message && (
                <p className="text-center text-red-600 text-xs mt-1">{errors.message}</p>
              )}
            </div>
            <div className="flex justify-between items-center gap-3 mt-2">
              <div className="flex-1">
                  {status.type && (
                    <p className={`text-sm font-medium ${
                      status.type === 'success' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {status.message}
                    </p>
                  )}
              </div>
  
              <button 
                type="submit" 
                disabled={isLoading}
                className={`cursor-pointer w-auto px-8 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-2xl font-bold transition-all ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Sending...' : 'Send'}
              </button>
            </div>
        </form>
        </div>
        </div>
      </div>
      
  );
}