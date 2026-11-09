export const useProjectsStore = defineStore('projects', () => {
  const projects = ref<Project[]>([]);

  async function fetchProjects() {
    projects.value = await $fetch<Project[]>('/api/projects');
    return projects.value;
  }

  async function createProject(input: ProjectInput) {
    const project = await $fetch('/api/projects', {
      method: 'POST',
      body: input,
    });
    await fetchProjects();
    return project;
  }

  function fetchProject(slug: string) {
    return $fetch(`/api/projects/${encodeURIComponent(slug)}`);
  }

  async function updateProject(
    slug: string,
    input: { name?: string; clientId?: number | null }
  ) {
    const project = await $fetch(`/api/projects/${encodeURIComponent(slug)}`, {
      method: 'PUT',
      body: input,
    });
    await fetchProjects();
    return project;
  }

  async function removeProject(slug: string) {
    await $fetch(`/api/projects/${encodeURIComponent(slug)}`, {
      method: 'DELETE',
    });
    await fetchProjects();
  }

  return {
    projects,
    fetchProjects,
    createProject,
    fetchProject,
    updateProject,
    removeProject,
  };
});
