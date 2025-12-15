export interface SOPStep {
  id: number;
  title: string;
  description: string;
  checklist: string[];
}

export interface WeatherData {
  temp: number;
  humidity: number;
  windSpeed: number;
  rainfall: number;
  fineDust: number;
  windDirection: string;
}

export interface EventData {
  equipment: string;
  location: string;
  event: string;
  status: '완료' | '미완료';
  time: string;
  level: 'danger' | 'warning' | 'info';
}

export interface ContactData {
  role: string;
  name: string;
  phone: string;
}
