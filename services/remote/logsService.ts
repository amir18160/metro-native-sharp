import apiClient from '~/api/apiClient';

/*********** Get list of logs **************/

export async function getLogList() {
  const url = 'logs/get-logs';
  const response = await apiClient.get<string[]>(url);
  return response.data;
}

/*********** Register **************/
export interface logDTO {
  filename: string;
}

export async function getDetails(data: logDTO) {
  const url = `/logs/${data.filename}`;
  const response = await apiClient.get<string>(url);

  return response.data;
}
