import axios from 'axios';
import { Application, Assessment } from '@/types';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,
});

export const api = {
  // Applications
  createApplication: async (data: any): Promise<Application> => {
    const res = await apiClient.post(`/applications/`, data);
    return res.data;
  },

  getApplications: async (): Promise<Application[]> => {
    const res = await apiClient.get(`/applications/`);
    return res.data;
  },
  
  getApplication: async (id: number): Promise<Application> => {
    const res = await apiClient.get(`/applications/${id}`);
    return res.data;
  },

  // Assessments
  generateAssessment: async (applicationId: number): Promise<Assessment> => {
    const res = await apiClient.post(`/assessments/${applicationId}/generate`);
    return res.data;
  },

  getAssessment: async (applicationId: number): Promise<Assessment> => {
    const res = await apiClient.get(`/assessments/${applicationId}`);
    return res.data;
  },

  // Decisions
  submitDecision: async (applicationId: number, data: { recommendation: string; notes: string; final_confidence: number }) => {
    const res = await apiClient.post(`/decisions/${applicationId}`, data);
    return res.data;
  },

  // Analytics
  getPortfolioOverview: async () => {
    const res = await apiClient.get(`/analytics/portfolio-overview`);
    return res.data;
  },

  getRiskDistribution: async () => {
    const res = await apiClient.get(`/analytics/risk-distribution`);
    return res.data;
  },

  getTimeSeries: async (days: number = 30) => {
    const res = await apiClient.get(`/analytics/time-series?days=${days}`);
    return res.data;
  },

  getSectorDistribution: async () => {
    const res = await apiClient.get(`/analytics/sector-distribution`);
    return res.data;
  },

  getAIvsHuman: async () => {
    const res = await apiClient.get(`/analytics/ai-vs-human`);
    return res.data;
  },

  getDetailedApplications: async (params?: any) => {
    const res = await apiClient.get(`/analytics/applications-detailed`, { params });
    return res.data;
  },

  // Documents
  uploadDocument: async (applicationId: number, file: File, documentType: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', documentType);
    const res = await apiClient.post(`/documents/upload/${applicationId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  getApplicationDocuments: async (applicationId: number) => {
    const res = await apiClient.get(`/documents/${applicationId}`);
    return res.data;
  }
};