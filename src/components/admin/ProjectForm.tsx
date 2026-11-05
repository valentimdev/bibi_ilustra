'use client';
import {
  convertImageToWebP,
  IMAGE_PRESETS,
  type ImagePresetName,
} from '@/lib/imageUtils';
import {
  convertVideo,
  getVideoDuration,
  VIDEO_LIMITS,
  VideoConversionCanceledError,
} from '@/lib/videoUtils';
import { getMediaDimensions, isVideoUrl } from '@/lib/media';
import { useRef, useState } from 'react';
import type { ProjectData, MuralSection } from '@/lib/projectData';
import { uploadImage } from '@/lib/blob';

const GIF_WARNING =
  'GIF animado fica muito pesado. Exporte como MP4 para manter a animação com um arquivo bem menor.';

const EXPORT_TIP =
  'Exporte em H.264 (MP4), sem áudio, com 2 a 3 Mbps. Veja as dicas no "Guia da Bibi".';

type ConversionState = { key: string; progress: number } | null;

// Preview que mostra <video> para arquivos de vídeo e <img> para o resto.
function MediaPreview({ src, className }: { src: string; className: string }) {
  if (isVideoUrl(src)) {
    return (
      <video src={src} className={className} muted loop playsInline autoPlay />
    );
  }
  return <img src={src} alt="Preview" className={className} />;
}

// Progresso da conversão, botão de cancelar e avisos de um campo de upload.
function UploadStatus({
  uploadKey,
  conversion,
  notice,
  onCancel,
}: {
  uploadKey: string;
  conversion: ConversionState;
  notice?: string;
  onCancel: () => void;
}) {
  const converting = conversion?.key === uploadKey;
  return (
    <>
      {converting && (
        <div className="mt-2 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded bg-gray-200">
            <div
              className="h-full bg-[var(--secondary)] transition-[width]"
              style={{ width: `${Math.round(conversion.progress * 100)}%` }}
            />
          </div>
          <span className="text-xs text-gray-600 w-24">
            Convertendo {Math.round(conversion.progress * 100)}%
          </span>
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer text-sm text-red-600 hover:text-red-800"
          >
            Cancelar
          </button>
        </div>
      )}
      {notice && <p className="mt-1 text-sm text-amber-700">{notice}</p>}
    </>
  );
}

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
  const sanitizeSlugInput = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

  const normalizeSlug = (value: string) =>
    sanitizeSlugInput(value)
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

  const [fileSizes, setFileSizes] = useState<Record<string, number>>({});
  const [formData, setFormData] = useState<ProjectData>(project);
  const [uploading, setUploading] = useState<string | null>(null);
  const [useWebP, setUseWebP] = useState(true);
  const [useVideoOptimization, setUseVideoOptimization] = useState(true);
  const [conversion, setConversion] = useState<ConversionState>(null);
  const [notices, setNotices] = useState<Record<string, string | undefined>>({});
  const cancelRef = useRef<AbortController | null>(null);

  const setNotice = (key: string, message?: string) =>
    setNotices((prev) => ({ ...prev, [key]: message }));

  const cancelConversion = () => cancelRef.current?.abort();
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

  /**
   * Converte (se as opções estiverem marcadas) e valida o arquivo antes do
   * upload. Retorna null quando o envio deve ser interrompido.
   */
  const prepareFile = async (
    file: File,
    target: ImagePresetName,
    key: string
  ): Promise<File | null> => {
    setNotice(key, undefined);

    if (file.type === 'image/gif') {
      setNotice(key, GIF_WARNING);
    }

    if (file.type.startsWith('video/')) {
      return prepareVideo(file, target === 'cover' ? 'cover' : 'mural', key);
    }

    if (useWebP && file.type.startsWith('image/')) {
      const preset = IMAGE_PRESETS[target];
      try {
        return await convertImageToWebP(file, preset.quality, preset.maxSize);
      } catch (err) {
        console.error('Erro ao converter WebP, usando original', err);
      }
    }

    return file;
  };

  const prepareVideo = async (
    file: File,
    preset: 'cover' | 'mural',
    key: string
  ): Promise<File | null> => {
    if (file.size > VIDEO_LIMITS.maxInputSize) {
      alert(
        `Vídeo muito grande (${formatFileSize(file.size)}). O limite é ` +
          `${formatFileSize(VIDEO_LIMITS.maxInputSize)}, porque arquivos maiores ` +
          `podem travar o navegador. Exporte uma versão menor e tente de novo.`
      );
      return null;
    }

    let finalFile = file;

    if (useVideoOptimization) {
      const controller = new AbortController();
      cancelRef.current = controller;
      setConversion({ key, progress: 0 });
      try {
        finalFile = await convertVideo(
          file,
          preset,
          (progress) => setConversion({ key, progress }),
          controller.signal
        );
      } catch (err) {
        if (err instanceof VideoConversionCanceledError) {
          setNotice(key, 'Conversão cancelada. Nada foi enviado.');
          return null;
        }
        finalFile = file;
      } finally {
        setConversion(null);
        cancelRef.current = null;
      }

      setNotice(
        key,
        finalFile !== file
          ? `${formatFileSize(file.size)} → ${formatFileSize(finalFile.size)}`
          : 'Vídeo mantido no original: a conversão não foi possível neste navegador ou não reduziu o tamanho.'
      );
    }

    // A validação vale para o arquivo final (convertido ou original).
    if (preset === 'cover') {
      if (finalFile.size > VIDEO_LIMITS.coverMaxSize) {
        alert(
          `O vídeo da capa precisa ter no máximo ${formatFileSize(VIDEO_LIMITS.coverMaxSize)} ` +
            `(este tem ${formatFileSize(finalFile.size)}). ${EXPORT_TIP}`
        );
        return null;
      }
      try {
        const duration = await getVideoDuration(finalFile);
        if (duration > VIDEO_LIMITS.coverMaxDuration + 0.1) {
          alert(
            `O vídeo da capa precisa ter no máximo ${VIDEO_LIMITS.coverMaxDuration} segundos ` +
              `(este tem ${Math.round(duration)} s). Corte o vídeo ou marque "Otimizar vídeos". ${EXPORT_TIP}`
          );
          return null;
        }
      } catch {
        alert(`Não foi possível ler este vídeo. ${EXPORT_TIP}`);
        return null;
      }
    } else if (finalFile.size > VIDEO_LIMITS.muralMaxSize) {
      alert(
        `Vídeos do mural podem ter no máximo ${formatFileSize(VIDEO_LIMITS.muralMaxSize)} ` +
          `(este tem ${formatFileSize(finalFile.size)}). Vídeos longos e com som devem ir ` +
          `para o YouTube como não listado.`
      );
      return null;
    }

    return finalFile;
  };

  const handleCoverImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading('cover');
    try {
      const fileToUpload = await prepareFile(file, 'cover', 'cover');
      if (!fileToUpload) return;
      setFileSizes((prev) => ({ ...prev, cover: fileToUpload.size }));
      const folder = `projects/${formData.slug || 'temp'}`;
      const result = await uploadImage(fileToUpload, folder);
      handleInputChange('coverImage', result.url);
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao fazer upload do arquivo');
    } finally {
      setUploading(null);
      e.target.value = '';
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
      // A primeira seção, se for "full", é o header do projeto.
      const preset: ImagePresetName =
        sectionIndex === 0 && formData.muralSections[0]?.type === 'full'
          ? 'muralPresentation'
          : 'muralSection';
      const fileToUpload = await prepareFile(file, preset, key);
      if (!fileToUpload) return;
      setFileSizes((prev) => ({ ...prev, [key]: fileToUpload.size }));
      const folder = `projects/${formData.slug || 'temp'}`;
      const result = await uploadImage(fileToUpload, folder);
      const section = formData.muralSections[sectionIndex];

      if (section.type === 'full') {
        const dimensions = await getMediaDimensions(fileToUpload);
        handleSectionChange(sectionIndex, {
          ...section,
          imageUrl: result.url,
          width: dimensions?.width,
          height: dimensions?.height,
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
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formData.slug)) {
      alert('Slug inválido. Use apenas letras minúsculas, números e hífens.');
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

          <div className="flex items-center mb-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
          <input
            type="checkbox"
            id="useWebP"
            checked={useWebP}
            onChange={(e) => setUseWebP(e.target.checked)}
            className="w-4 h-4 text-[var(--secondary)] rounded border-gray-300 focus:ring-[var(--secondary)]"
          />
          <div className="ml-3">
            <label htmlFor="useWebP" className="text-sm font-medium text-gray-700 cursor-pointer">
              Otimizar imagens (Converter para WebP)
            </label>
            <p className="text-xs text-gray-500">
              Reduz drasticamente o tamanho dos arquivos e acelera o carregamento.
            </p>
            <p className="text-xs text-gray-500">
              Para line art, pixel art ou peças com linhas muito finas, desmarque para enviar o PNG original.
            </p>
          </div>
        </div>
          <div className="flex items-center mb-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
          <input
            type="checkbox"
            id="useVideoOptimization"
            checked={useVideoOptimization}
            onChange={(e) => setUseVideoOptimization(e.target.checked)}
            className="w-4 h-4 text-[var(--secondary)] rounded border-gray-300 focus:ring-[var(--secondary)]"
          />
          <div className="ml-3">
            <label htmlFor="useVideoOptimization" className="text-sm font-medium text-gray-700 cursor-pointer">
              Otimizar vídeos
            </label>
            <p className="text-xs text-gray-500">
              Converte no navegador, tira o áudio e comprime. Capa: 1080 × 1080, até 15 s. Mural: até 1920 px de largura.
            </p>
          </div>
        </div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ordem de exibição (número menor aparece primeiro)
          </label>
          <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={String(formData.order ?? 0)}
          onChange={(e) =>
            handleInputChange('order', e.target.value.replace(/\D/g, ''))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
           />
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
            onChange={(e) => handleInputChange('slug', sanitizeSlugInput(e.target.value))}
            onBlur={(e) => handleInputChange('slug', normalizeSlug(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
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
              required
              value={formData.category || ""} 
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="" disabled>Selecione uma categoria</option>
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
            accept="image/*,video/mp4,video/webm"
            onChange={handleCoverImageUpload}
            className="cursor-pointer w-full px-3 py-2 border border-gray-300 rounded-md"
            disabled={uploading === 'cover'}
          />
          <UploadStatus
            uploadKey="cover"
            conversion={conversion}
            notice={notices.cover}
            onCancel={cancelConversion}
          />
          {fileSizes.cover && (
            <p className="text-sm text-gray-500 mt-1">
              Tamanho: {formatFileSize(fileSizes.cover)}
            </p>
          )}
          {formData.coverImage && (
            <MediaPreview
              src={formData.coverImage}
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
          <div>
            <h2 className="text-xl font-semibold">Seções do Mural</h2>
            <p className="text-sm text-gray-600 mt-1">
              Se a <strong>primeira seção</strong> for do tipo <strong>Full</strong>, ela
              vira a <strong>capa do projeto</strong>: aparece no topo da página, em largura
              cheia, com o título por cima.
            </p>
          </div>
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
            conversion={conversion}
            notices={notices}
            onCancelConversion={cancelConversion}
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
  conversion,
  notices,
  onCancelConversion,
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
  conversion: ConversionState;
  notices: Record<string, string | undefined>;
  onCancelConversion: () => void;
}) {
  const status = (key: string) => (
    <UploadStatus
      uploadKey={key}
      conversion={conversion}
      notice={notices[key]}
      onCancel={onCancelConversion}
    />
  );

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
        {index === 0 && (
          <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
            <strong>Capa do projeto.</strong> Esta arte aparece no topo da página, em largura
            cheia, com o título e a data por cima do rodapé dela (no celular, eles ficam
            abaixo). Prefira artes <strong>horizontais</strong> (por exemplo, 1640 × 624 px),
            que aparecem inteiras. Artes mais altas que a tela perdem um pouco em cima e
            embaixo, e o rodapé fica escurecido para o título ficar legível: evite deixar
            detalhes importantes nas bordas.
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imagem
            </label>
            <input
              type="file"
              accept="image/*,video/mp4,video/webm"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onImageUpload(null, file);
              }}
              disabled={uploading === `${index}-null`}
              className="cursor-pointer w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {status(`${index}-null`)}
            {fileSizes[`${index}-null`] && (
              <p className="text-sm text-gray-500 mt-1">
                Tamanho: {formatFileSize(fileSizes[`${index}-null`] || 0)}
              </p>
            )}
            {section.imageUrl && (
              <MediaPreview
                src={section.imageUrl}
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
              {status(`${index}-${imgIndex}`)}
              {fileSizes[`${index}-${imgIndex}`] && (
                <p className="text-sm text-gray-500 mt-1">
                  Tamanho: {formatFileSize(fileSizes[`${index}-${imgIndex}`])}
                </p>
              )}
              {section.imagesUrl[imgIndex] && (
                <MediaPreview
                  src={section.imagesUrl[imgIndex]}
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
              {status(`${index}-${imgIndex}`)}
              {fileSizes[`${index}-${imgIndex}`] && (
                <p className="text-sm text-gray-500 mt-1">
                  Tamanho: {formatFileSize(fileSizes[`${index}-${imgIndex}`])}
                </p>
              )}
              {section.imagesUrl[imgIndex] && (
                <MediaPreview
                  src={section.imagesUrl[imgIndex]}
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
