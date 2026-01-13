'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  published: boolean;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
    loadProjects();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      setAuthenticated(data.authenticated);

      if (!data.authenticated) {
        router.push('/bibi-login-admin');
      }
    } catch (error) {
      router.push('/bibi-login-admin');
    }
  };

  const loadProjects = async () => {
    try {
      const response = await fetch('/api/admin/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`Tem certeza que deseja deletar o projeto "${title}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    setDeleting(slug);
    try {
      const response = await fetch(`/api/admin/projects/${slug}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar projeto');
      }

      await loadProjects();
      alert('Projeto deletado com sucesso!');
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao deletar projeto');
    } finally {
      setDeleting(null);
    }
  };
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/bibi-login-admin');
  };

  if (authenticated === null || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--background)] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Painel Admin</h1>
          <div className="flex gap-4">
            <Link
              href="/admin/projects/new"
              className="cursor-pointer bg-[var(--secondary)] text-white px-4 py-2 rounded-md hover:bg-[var(--secondary-hover)]"
            >
              Novo Projeto
            </Link>
            <button
              onClick={handleLogout}
              className="bg-gray-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-gray-700"
            >
              Sair
            </button>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Projetos</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {projects.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                Nenhum projeto encontrado. Crie seu primeiro projeto!
              </div>
            ) : (
              projects.map((project) => (
                <div
                  key={project.id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {project.slug} • {project.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        project.published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {project.published ? 'Publicado' : 'Rascunho'}
                    </span>
                    <Link
                      href={`/admin/projects/${project.slug}/edit`}
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Editar
                    </Link>
                    <Link
                      href={`/work/${project.slug}`}
                      target="_blank"
                      className="text-gray-600 hover:text-gray-800 text-sm"
                    >
                      Ver
                    </Link>
                    <button
                      onClick={() => handleDelete(project.slug, project.title)}
                      disabled={deleting === project.slug}
                      className="text-red-600 hover:text-red-800 font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deleting === project.slug ? 'Deletando...' : 'Deletar'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
