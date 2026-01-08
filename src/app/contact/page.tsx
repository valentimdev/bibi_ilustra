'use client'; 

import React, { useState } from 'react';
import Image from 'next/image';


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
        setStatus({ type: 'success', message: 'Mensagem enviada com sucesso!' });
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
    <div className="flex flex-col w-full min-h-screen justify-center items-center pt-20 pb-30 px-5 border border-black">
        <div className="flex flex-row w-full">
        <div className="border border-amber-300 w-1/2 pt-10">
        <h1 className="text-lg text-center text-gray-500 leading-tight">
          Have any ideas you'd like to share?
          </h1>
        <h1 className="text-lg text-center text-gray-500 mb-6 leading-tight">
          Feel free to reach out! :)
        
        </h1>
        <h1 className="italic text-xl md:text-3xl text-center font-extrabold text-[var(--secondary)] mb-8 leading-tight break-all">
          biancatavaresilustra@gmail.com
        </h1>
        </div>
        
        {status.type && (
          <div className={`mb-6 p-3 rounded-md text-center text-sm font-medium ${
            status.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-300' 
              : 'bg-red-100 text-red-800 border border-red-300'
          }`}>
            {status.message}
          </div>
        )}
        <div className="w-1/2">
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
              {/* <label htmlFor="name" className="text-gray-900 font-extrabold text-sm">Name</label> */}
              <input 
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={100} 
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
              {/* <label htmlFor="email" className="text-gray-900 font-extrabold text-sm">Email</label> */}
              <input 
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
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
              {/* <label htmlFor="message" className="text-gray-900 font-extrabold text-sm">Message</label> */}
              <textarea 
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                onBlur={handleBlur}
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
          <div className="flex justify-end items-end">
            <button 
              type="submit" 
              disabled={isLoading}
              className={` cursor-pointer w-1/5  mt-2 p-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-2xl font-bold transition-all ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
            </div>
        </form>
        </div>
        </div>
        <div className="border border-black flex flex-col w-full">
          <Image
          src="/icons/gatos_site_bibi.svg"
          alt="Cats facing multiple directions"
          width={1400}
          height={0}
          sizes="(max-width: 1000px) 80vw, 1000px"
          className="w-full h-auto cursor-zoom-in"
          style={{ height: '1/2' }}
          >

          </Image>
        </div>
      </div>
  );
}