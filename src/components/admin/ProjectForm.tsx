'use client';

import { useState } from 'react';
import type { ProjectData, MuralSection } from '@/lib/projectData';
import { uploadImage } from '@/lib/blob';

interface ProjectFormProps {
  project: ProjectData;
  onSave: (project: ProjectData) => void;
  loading: boolean;
}

export default function ProjectForm({
  project,
  onSave,
  loading,
}: ProjectFormProps) {
  const [fileSizes, setFileSizes] = useState<Record<string, number>>({});
  const [formData, setFormData] = useState<ProjectData>(project);
  const [uploading, setUploading] = useState<string | null>(null);

  const handleInputChange = (field: keyof ProjectData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handleCoverImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading('cover');
    try {
      const folder = `projects/${formData.slug || 'temp'}`;
      const result = await uploadImage(file, folder);
      handleInputChange('coverImage', result.url);
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao fazer upload da imagem');
    } finally {
      setUploading(null);
    }
  };

  const handleAddSection = (type: MuralSection['type']) => {
    let newSection: MuralSection;

    switch (type) {
      case 'full':
        newSection = { type: 'full', imageUrl: '', alt: '' };
        break;
      case 'split':
        newSection = {
          type: 'split',
          imagesUrl: ['', ''],
          alts: ['', ''],
        };
        break;
      case 'trio':
        newSection = {
          type: 'trio',
          imagesUrl: ['', '', ''],
          alts: ['', '', ''],
        };
        break;
      case 'text':
        newSection = { type: 'text', content: '' };
        break;
    }

    setFormData((prev) => ({
      ...prev,
      muralSections: [...prev.muralSections, newSection],
    }));
  };

  const handleRemoveSection = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      muralSections: prev.muralSections.filter((_, i) => i !== index),
    }));
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === formData.muralSections.length - 1)
    ) {
      return;
    }

    const newSections = [...formData.muralSections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Trocar posições
    [newSections[index], newSections[targetIndex]] = [
      newSections[targetIndex],
      newSections[index],
    ];

    setFormData((prev) => ({
      ...prev,
      muralSections: newSections,
    }));
  };

  const handleSectionChange = (index: number, section: MuralSection) => {
    setFormData((prev) => {
      const newSections = [...prev.muralSections];
      newSections[index] = section;
      return { ...prev, muralSections: newSections };
    });
  };

  const handleImageUpload = async (
    sectionIndex: number,
    imageIndex: number | null,
    file: File
  ) => {
    const key = `${sectionIndex}-${imageIndex}`;
    
    // Armazenar tamanho do arquivo
    setFileSizes((prev) => ({ ...prev, [key]: file.size }));

    setUploading(key);
    try {
      const folder = `projects/${formData.slug || 'temp'}`;
      const result = await uploadImage(file, folder);
      const section = formData.muralSections[sectionIndex];

      if (section.type === 'full') {
        handleSectionChange(sectionIndex, {
          ...section,
          imageUrl: result.url,
        });
      } else if (section.type === 'split' || section.type === 'trio') {
        const newImagesUrl = [...section.imagesUrl];
        if (imageIndex !== null) {
          newImagesUrl[imageIndex] = result.url;
        }
        handleSectionChange(sectionIndex, {
          ...section,
          imagesUrl: newImagesUrl as any,
        });
      }

    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao fazer upload da imagem');
    } finally {
      setUploading(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.slug || !formData.title) {
      alert('Preencha pelo menos o slug e o título');
      return;
    }
    onSave(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[var(--background)] text-black p-6 space-y-6"
    >
      {/* Informações Básicas - mantém tudo igual */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Informações Básicas</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Slug *
          </label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => handleInputChange('slug', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
            pattern="[a-z0-9-]+"
            title="Apenas letras minúsculas, números e hífens"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Descrição
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="resize-none w-full px-3 py-2 border border-gray-300 rounded-md"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Data
            </label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={formData.date.split(' de ')[0] || ''}
                onChange={(e) => {
                  const year = formData.date.split(' de ')[1] || '';
                  const newDate = year ? `${e.target.value} de ${year}` : e.target.value;
                  handleInputChange('date', newDate);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Mês</option>
                <option value="Janeiro">Janeiro</option>
                <option value="Fevereiro">Fevereiro</option>
                <option value="Março">Março</option>
                <option value="Abril">Abril</option>
                <option value="Maio">Maio</option>
                <option value="Junho">Junho</option>
                <option value="Julho">Julho</option>
                <option value="Agosto">Agosto</option>
                <option value="Setembro">Setembro</option>
                <option value="Outubro">Outubro</option>
                <option value="Novembro">Novembro</option>
                <option value="Dezembro">Dezembro</option>
              </select>
              <select
                value={formData.date.split(' de ')[1] || ''}
                onChange={(e) => {
                  const month = formData.date.split(' de ')[0] || '';
                  const newDate = month ? `${month} de ${e.target.value}` : e.target.value;
                  handleInputChange('date', newDate);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Ano</option>
                {Array.from({ length: 10 }, (_, i) => {
                  const year = new Date().getFullYear() - 8 + i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="design">Design</option>
              <option value="ilustracao">Ilustração</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Imagem de Capa
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverImageUpload}
            className="cursor-pointer w-full px-3 py-2 border border-gray-300 rounded-md"
            disabled={uploading === 'cover'}
          />
          {fileSizes.cover && (
            <p className="text-sm text-gray-500 mt-1">
              Tamanho: {formatFileSize(fileSizes.cover)}
            </p>
          )}
          {formData.coverImage && (
            <img
              src={formData.coverImage}
              alt="Cover"
              className="mt-2 w-32 h-32 object-cover rounded"
            />
          )}
          {uploading === 'cover' && (
            <p className="text-sm text-gray-500">Uploading...</p>
          )}
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="published"
            checked={formData.published}
            onChange={(e) => handleInputChange('published', e.target.checked)}
            className="mr-2"
          />
          <label
            htmlFor="published"
            className="text-sm font-medium text-gray-700"
          >
            Publicado
          </label>
        </div>
      </div>

      {/* Seções do Mural */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Seções do Mural</h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleAddSection('full')}
              className="cursor-pointer px-3 py-1 bg-[var(--secondary)] text-white rounded text-sm hover:bg-[var(--secondary-hover)]"
            >
              + Full
            </button>
            <button
              type="button"
              onClick={() => handleAddSection('split')}
              className="cursor-pointer px-3 py-1 bg-[var(--secondary)] text-white rounded text-sm hover:bg-[var(--secondary-hover)]"
            >
              + Split
            </button>
            <button
              type="button"
              onClick={() => handleAddSection('trio')}
              className="cursor-pointer px-3 py-1 bg-[var(--secondary)] text-white rounded text-sm hover:bg-[var(--secondary-hover)]"
            >
              + Trio
            </button>
            <button
              type="button"
              onClick={() => handleAddSection('text')}
              className="cursor-pointer px-3 py-1 bg-[var(--secondary)] text-white rounded text-sm hover:bg-[var(--secondary-hover)]"
            >
              + Text
            </button>
          </div>
        </div>

        {formData.muralSections.map((section, index) => (
          <SectionEditor
            key={index}
            section={section}
            index={index}
            totalSections={formData.muralSections.length}
            onChange={(s) => handleSectionChange(index, s)}
            onRemove={() => handleRemoveSection(index)}
            onMove={(direction) => handleMoveSection(index, direction)}
            onImageUpload={(imgIndex, file) =>
              handleImageUpload(index, imgIndex, file)
            }
            uploading={uploading}
            fileSizes={fileSizes}
            formatFileSize={formatFileSize}
          />
        ))}
      </div>

      {/* Botões */}
      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer px-4 py-2 bg-[var(--secondary)] text-white rounded-md hover:bg-[var(--secondary-hover)] disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Salvar Projeto'}
        </button>
      </div>
    </form>
  );
}

// Componente para editar cada seção
function SectionEditor({
  section,
  index,
  totalSections,
  onChange,
  onRemove,
  onMove,
  onImageUpload,
  uploading,
  fileSizes,
  formatFileSize,
}: {
  section: MuralSection;
  index: number;
  totalSections: number;
  onChange: (section: MuralSection) => void;
  onRemove: () => void;
  onMove: (direction: 'up' | 'down') => void;
  onImageUpload: (imageIndex: number | null, file: File) => void;
  uploading: string | null;
  fileSizes: Record<string, number>;
  formatFileSize: (bytes: number) => string;
}) {
  // Cabeçalho comum para todas as seções
  const SectionHeader = ({ title }: { title: string }) => (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-3">
        {/* Botões de ordenação */}
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => onMove('up')}
            disabled={index === 0}
            className="text-gray-400 hover:text-gray-700 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
            title="Mover para cima"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd"/>
            </svg>
          </button>
          <button
            type="button"
            onClick={() => onMove('down')}
            disabled={index === totalSections - 1}
            className="text-gray-400 hover:text-gray-700 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
            title="Mover para baixo"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>
        </div>
        <h3 className="font-medium">{title}</h3>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="text-red-600 text-sm cursor-pointer hover:text-red-800"
      >
        Remover
      </button>
    </div>
  );

  if (section.type === 'full') {
    return (
      <div className="border border-gray-200 rounded-lg p-4 bg-white">
        <SectionHeader title={`Seção Full #${index + 1}`} />
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imagem
            </label>
            <input
              type="file"
              accept="image/*,video/mp4"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onImageUpload(null, file);
              }}
              disabled={uploading === `${index}-null`}
              className="cursor-pointer w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {fileSizes[`${index}-null`] && (
              <p className="text-sm text-gray-500 mt-1">
                Tamanho: {formatFileSize(fileSizes[`${index}-null`] || 0)}
              </p>
            )}
            {section.imageUrl && (
              <img
                src={section.imageUrl}
                alt="Preview"
                className="mt-2 w-full max-w-md h-48 object-cover rounded"
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alt Text
            </label>
            <input
              type="text"
              value={section.alt}
              onChange={(e) => onChange({ ...section, alt: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>
    );
  }

  if (section.type === 'split') {
    return (
      <div className="border border-gray-200 rounded-lg p-4 bg-white">
        <SectionHeader title={`Seção Split #${index + 1}`} />
        <div className="grid grid-cols-2 gap-4">
          {[0, 1].map((imgIndex) => (
            <div key={imgIndex}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imagem {imgIndex + 1}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onImageUpload(imgIndex, file);
                }}
                disabled={uploading === `${index}-${imgIndex}`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {fileSizes[`${index}-${imgIndex}`] && (
                <p className="text-sm text-gray-500 mt-1">
                  Tamanho: {formatFileSize(fileSizes[`${index}-${imgIndex}`])}
                </p>
              )}
              {section.imagesUrl[imgIndex] && (
                <img
                  src={section.imagesUrl[imgIndex]}
                  alt="Preview"
                  className="mt-2 w-full h-48 object-cover rounded"
                />
              )}
              <input
                type="text"
                value={section.alts[imgIndex]}
                onChange={(e) => {
                  const newAlts = [...section.alts];
                  newAlts[imgIndex] = e.target.value;
                  onChange({ ...section, alts: newAlts as [string, string] });
                }}
                placeholder="Alt text"
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (section.type === 'trio') {
    return (
      <div className="border border-gray-200 rounded-lg p-4 bg-white">
        <SectionHeader title={`Seção Trio #${index + 1}`} />
        <div className="grid grid-cols-3 gap-4">
          {[0, 1, 2].map((imgIndex) => (
            <div key={imgIndex}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imagem {imgIndex + 1}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onImageUpload(imgIndex, file);
                }}
                disabled={uploading === `${index}-${imgIndex}`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {fileSizes[`${index}-${imgIndex}`] && (
                <p className="text-sm text-gray-500 mt-1">
                  Tamanho: {formatFileSize(fileSizes[`${index}-${imgIndex}`])}
                </p>
              )}
              {section.imagesUrl[imgIndex] && (
                <img
                  src={section.imagesUrl[imgIndex]}
                  alt="Preview"
                  className="mt-2 w-full h-32 object-cover rounded"
                />
              )}
              <input
                type="text"
                value={section.alts[imgIndex]}
                onChange={(e) => {
                  const newAlts = [...section.alts];
                  newAlts[imgIndex] = e.target.value;
                  onChange({
                    ...section,
                    alts: newAlts as [string, string, string],
                  });
                }}
                placeholder="Alt text"
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (section.type === 'text') {
    return (
      <div className="border border-gray-200 rounded-lg p-4 bg-white">
        <SectionHeader title={`Seção Text #${index + 1}`} />
        <textarea
          value={section.content}
          onChange={(e) => onChange({ ...section, content: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none text-black"
          rows={6}
        />
      </div>
    );
  }

  return null;
}