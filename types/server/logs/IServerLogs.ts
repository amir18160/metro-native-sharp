interface LogProperties {
  SourceContext: string;
  [key: string]: any;
}

type LogRenderings = Record<string, any>;

export type ILogList = string[];

export interface ILogEntry {
  Timestamp: string;
  Level: 'Information' | 'Warning' | 'Error';
  MessageTemplate: string;
  Properties: LogProperties;
  Renderings?: LogRenderings;
}
