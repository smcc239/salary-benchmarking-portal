import { SurveyResponse, BenchmarkReport } from '../types/survey';

class StorageService {
  private getItem<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  private setItem<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
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
}

export const storage = new StorageService(); 