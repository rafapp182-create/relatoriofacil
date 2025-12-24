
import { Report } from '../types';

const STORAGE_KEY = 'report_master_om_data';
const THEME_KEY = 'report_master_theme';

export const storage = {
  getReports: (): Report[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading reports from storage', error);
      return [];
    }
  },

  saveReport: (report: Report): void => {
    const reports = storage.getReports();
    const index = reports.findIndex((r) => r.id === report.id);
    
    if (index !== -1) {
      reports[index] = { ...report, updatedAt: Date.now() };
    } else {
      reports.push({ ...report, createdAt: Date.now(), updatedAt: Date.now() });
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  },

  deleteReport: (id: string): void => {
    const reports = storage.getReports();
    const filtered = reports.filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  // Backup & Restore
  exportBackup: (): void => {
    const reports = storage.getReports();
    const data = JSON.stringify(reports, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_reportmaster_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  },

  importBackup: (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed)) {
        localStorage.setItem(STORAGE_KEY, jsonString);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  },

  // Theme Management
  getTheme: (): 'light' | 'dark' => {
    return (localStorage.getItem(THEME_KEY) as 'light' | 'dark') || 'light';
  },

  setTheme: (theme: 'light' | 'dark'): void => {
    localStorage.setItem(THEME_KEY, theme);
  }
};
