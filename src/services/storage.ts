import { SurveyResponse, BenchmarkReport } from '../types/survey';

class StorageService {
  private getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error parsing item from localStorage (${key}):`, error);
      return null;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving item to localStorage (${key}):`, error);
    }
  }

  saveSurveyResponse(roleId: string, response: SurveyResponse): void {
    const key = `survey_${roleId}`;
    const responses = this.getSurveyResponses(roleId);
    responses.push(response);
    this.setItem(key, responses);
  }

  getSurveyResponses(roleId: string): SurveyResponse[] {
    const key = `survey_${roleId}`;
    return this.getItem<SurveyResponse[]>(key) || [];
  }

  saveReport(roleId: string, report: BenchmarkReport): void {
    const key = `report_${roleId}`;
    this.setItem(key, report);
  }

  getReport(roleId: string): BenchmarkReport | null {
    const key = `report_${roleId}`;
    return this.getItem<BenchmarkReport>(key);
  }

  clearStorage(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
}

export const storage = new StorageService(); 