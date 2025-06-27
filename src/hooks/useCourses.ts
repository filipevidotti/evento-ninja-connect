
import { useState, useEffect } from 'react';

export interface Course {
  id: string;
  title: string;
  description: string;
  duration_hours: number;
  difficulty_level: 'iniciante' | 'intermediario' | 'avancado';
  category: string;
  content: {
    modules: Array<{
      title: string;
      lessons: number;
    }>;
  };
  is_active: boolean;
}

export interface UserCourseProgress {
  id: string;
  user_id: string;
  course_id: string;
  status: 'nao_iniciado' | 'em_andamento' | 'concluido';
  progress_percentage: number;
  started_at?: string;
  completed_at?: string;
}

export const useCourses = () => {
  // Mock data - em produção seria conectado ao Supabase
  const [courses] = useState<Course[]>([
    {
      id: '1',
      title: 'Atendimento ao Cliente Excelente',
      description: 'Aprenda técnicas avançadas de atendimento ao cliente para eventos',
      duration_hours: 4,
      difficulty_level: 'iniciante',
      category: 'Atendimento',
      content: {
        modules: [
          { title: 'Fundamentos do Atendimento', lessons: 3 },
          { title: 'Comunicação Efetiva', lessons: 4 }
        ]
      },
      is_active: true
    },
    {
      id: '2',
      title: 'Segurança em Eventos',
      description: 'Curso completo sobre procedimentos de segurança em eventos',
      duration_hours: 8,
      difficulty_level: 'intermediario',
      category: 'Segurança',
      content: {
        modules: [
          { title: 'Protocolos Básicos', lessons: 5 },
          { title: 'Emergências', lessons: 3 }
        ]
      },
      is_active: true
    },
    {
      id: '3',
      title: 'Bartender Profissional',
      description: 'Do básico ao avançado na arte da coquetelaria',
      duration_hours: 12,
      difficulty_level: 'intermediario',
      category: 'Gastronomia',
      content: {
        modules: [
          { title: 'Drinks Clássicos', lessons: 6 },
          { title: 'Técnicas Avançadas', lessons: 4 }
        ]
      },
      is_active: true
    },
    {
      id: '4',
      title: 'Fotografia de Eventos',
      description: 'Técnicas profissionais para fotografar eventos',
      duration_hours: 6,
      difficulty_level: 'avancado',
      category: 'Arte',
      content: {
        modules: [
          { title: 'Equipamentos', lessons: 3 },
          { title: 'Composição', lessons: 5 }
        ]
      },
      is_active: true
    }
  ]);

  const [userProgress] = useState<UserCourseProgress[]>([
    {
      id: '1',
      user_id: '1',
      course_id: '1',
      status: 'concluido',
      progress_percentage: 100,
      started_at: '2024-01-15T10:00:00Z',
      completed_at: '2024-01-20T15:30:00Z'
    },
    {
      id: '2',
      user_id: '1',
      course_id: '2',
      status: 'em_andamento',
      progress_percentage: 65,
      started_at: '2024-02-01T09:00:00Z'
    }
  ]);

  const getCompletedCourses = () => {
    return userProgress
      .filter(progress => progress.status === 'concluido')
      .map(progress => {
        const course = courses.find(c => c.id === progress.course_id);
        return course ? { ...course, completed_at: progress.completed_at } : null;
      })
      .filter(Boolean);
  };

  const getCourseProgress = (courseId: string) => {
    return userProgress.find(progress => progress.course_id === courseId);
  };

  const startCourse = async (courseId: string) => {
    // Mock - em produção seria uma chamada para o Supabase
    console.log('Starting course:', courseId);
    return true;
  };

  const updateProgress = async (courseId: string, percentage: number) => {
    // Mock - em produção seria uma chamada para o Supabase
    console.log('Updating progress:', courseId, percentage);
    return true;
  };

  const completeCourse = async (courseId: string) => {
    // Mock - em produção seria uma chamada para o Supabase
    console.log('Completing course:', courseId);
    return true;
  };

  return {
    courses,
    userProgress,
    getCompletedCourses,
    getCourseProgress,
    startCourse,
    updateProgress,
    completeCourse
  };
};
