'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProjectForm from '@/components/admin/ProjectForm';
import type { ProjectData } from '@/lib/projectData';

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProject();
  }, [slug]);

  const loadProject = async () => {
    try {
      const response = await fetch(`/api/admin/projects/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data);
      } else {
        router.push('/admin');
      }
    } catch (error) {
      console.error('Erro ao carregar projeto:', error);
      router.push('/admin');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updatedProject: ProjectData) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/projects/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProject),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar projeto');
      }

      router.push('/admin');
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao salvar projeto');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--background)] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Editar Projeto</h1>
        </div>
        <ProjectForm project={project} onSave={handleSave} loading={saving} />
      </div>
    </div>
  );
}
