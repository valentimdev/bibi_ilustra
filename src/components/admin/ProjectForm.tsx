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
  const [formData, setFormData] = useState<ProjectData>(project);
  const [uploading, setUploading] = useState<string | null>(null);

  const handleInputChange = (field: keyof ProjectData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
    setUploading(`${sectionIndex}-${imageIndex}`);
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
      className="bg-white shadow rounded-lg p-6 space-y-6"
    >
      {/* Informações Básicas */}
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data
            </label>
            <input
              type="text"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Novembro de 2025"
            />
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            disabled={uploading === 'cover'}
          />
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
              className="px-3 py-1 bg-indigo-600 text-white rounded text-sm"
            >
              + Full
            </button>
            <button
              type="button"
              onClick={() => handleAddSection('split')}
              className="px-3 py-1 bg-indigo-600 text-white rounded text-sm"
            >
              + Split
            </button>
            <button
              type="button"
              onClick={() => handleAddSection('trio')}
              className="px-3 py-1 bg-indigo-600 text-white rounded text-sm"
            >
              + Trio
            </button>
            <button
              type="button"
              onClick={() => handleAddSection('text')}
              className="px-3 py-1 bg-indigo-600 text-white rounded text-sm"
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
            onChange={(s) => handleSectionChange(index, s)}
            onRemove={() => handleRemoveSection(index)}
            onImageUpload={(imgIndex, file) =>
              handleImageUpload(index, imgIndex, file)
            }
            uploading={uploading}
          />
        ))}
      </div>

      {/* Botões */}
      <div className="flex justify-end gap-4 pt-4 border-t">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
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
  onChange,
  onRemove,
  onImageUpload,
  uploading,
}: {
  section: MuralSection;
  index: number;
  onChange: (section: MuralSection) => void;
  onRemove: () => void;
  onImageUpload: (imageIndex: number | null, file: File) => void;
  uploading: string | null;
}) {
  if (section.type === 'full') {
    return (
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Seção Full #{index + 1}</h3>
          <button
            type="button"
            onClick={onRemove}
            className="text-red-600 text-sm"
          >
            Remover
          </button>
        </div>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
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
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Seção Split #{index + 1}</h3>
          <button
            type="button"
            onClick={onRemove}
            className="text-red-600 text-sm"
          >
            Remover
          </button>
        </div>
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
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Seção Trio #{index + 1}</h3>
          <button
            type="button"
            onClick={onRemove}
            className="text-red-600 text-sm"
          >
            Remover
          </button>
        </div>
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
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Seção Text #{index + 1}</h3>
          <button
            type="button"
            onClick={onRemove}
            className="text-red-600 text-sm"
          >
            Remover
          </button>
        </div>
        <textarea
          value={section.content}
          onChange={(e) => onChange({ ...section, content: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          rows={6}
        />
      </div>
    );
  }

  return null;
}
